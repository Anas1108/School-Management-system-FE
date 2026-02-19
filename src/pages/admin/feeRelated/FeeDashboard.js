import { useNavigate } from 'react-router-dom';
import React, { useEffect, useState, useCallback } from 'react';
import {
    Box, Grid, Paper, Typography, Button, TextField, MenuItem, Table, TableBody, TableCell,
    TableContainer, TableHead, TableRow, Chip, Dialog, DialogTitle,
    DialogContent, DialogActions, Menu, Checkbox, ListItemText, IconButton, Tooltip
} from '@mui/material';
import FilterListIcon from '@mui/icons-material/FilterList';
import SearchIcon from '@mui/icons-material/Search';
import { useSelector } from 'react-redux';
import CountUp from 'react-countup';
import axios from 'axios';
import MonetizationOnIcon from '@mui/icons-material/MonetizationOn';
import CustomModal from '../../../components/CustomModal';
import CustomLoader from '../../../components/CustomLoader';

const FeeDashboard = () => {
    const navigate = useNavigate();
    const { currentUser } = useSelector(state => state.user);
    const [stats, setStats] = useState({ totalExpected: 0, totalCollected: 0, totalLateFines: 0 });
    const [loading, setLoading] = useState(true);

    const [generationData, setGenerationData] = useState({
        classId: '',
        month: new Date().getMonth() + 1,
        year: new Date().getFullYear(),
        dueDate: new Date().toISOString().split('T')[0]
    });
    const [classes, setClasses] = useState([]);
    const [generatedInvoices, setGeneratedInvoices] = useState([]);
    const [loadingInvoices, setLoadingInvoices] = useState(false);

    // Modal State
    const [modalData, setModalData] = useState({ open: false, title: '', message: '', type: 'info' });
    const [genModalOpen, setGenModalOpen] = useState(false);

    // Payment Dialog State
    const [payDialogOpen, setPayDialogOpen] = useState(false);
    const [selectedInvoice, setSelectedInvoice] = useState(null);
    const [paymentAmount, setPaymentAmount] = useState('');
    const [paymentDate, setPaymentDate] = useState(new Date().toISOString().split('T')[0]);

    // Filter State
    const [anchorEl, setAnchorEl] = useState(null);
    const [filterColumn, setFilterColumn] = useState('');
    const [filters, setFilters] = useState({
        status: [],
    });
    const [uniqueStatus, setUniqueStatus] = useState([]);

    const fetchStats = useCallback(async () => {
        try {
            const result = await axios.get(`${process.env.REACT_APP_BASE_URL}/FeeStats/${currentUser._id}`);
            setStats(result.data);
            setLoading(false);
        } catch (error) {
            console.error(error);
            setLoading(false);
        }
    }, [currentUser._id]);

    const fetchClasses = useCallback(async () => {
        try {
            const result = await axios.get(`${process.env.REACT_APP_BASE_URL}/SclassList/${currentUser._id}`);
            if (!result.data.message) {
                setClasses(result.data);
            }
        } catch (error) {
            console.error(error);
        }
    }, [currentUser._id]);

    useEffect(() => {
        fetchStats();
        fetchClasses();
    }, [fetchStats, fetchClasses]);

    const handleGenerate = async () => {
        if (!generationData.classId) {
            setModalData({ open: true, title: 'Warning', message: 'Please select a class', type: 'warning' });
            return;
        }
        try {
            const data = { ...generationData, adminID: currentUser._id };
            const response = await axios.post(`${process.env.REACT_APP_BASE_URL}/FeeInvoiceGenerate`, data);

            setModalData({ open: true, title: 'Success', message: response.data.message || "Invoices Generation Processed", type: 'success' });
            setGenModalOpen(false);
            fetchStats();
            fetchInvoices(generationData.classId);
        } catch (error) {
            console.error(error);
            if (error.response && error.response.data && error.response.data.message) {
                setModalData({ open: true, title: 'Error', message: error.response.data.message, type: 'warning' });
            } else {
                setModalData({ open: true, title: 'Error', message: "Error generating invoices", type: 'error' });
            }
        }
    };

    const fetchInvoices = useCallback(async (classId) => {
        const idToUse = classId || generationData.classId;
        if (!idToUse) return;
        setLoadingInvoices(true);
        try {
            const result = await axios.get(`${process.env.REACT_APP_BASE_URL}/FeeInvoices/${idToUse}`, {
                params: { month: generationData.month, year: generationData.year }
            });
            const allInvoices = result.data;
            setGeneratedInvoices(allInvoices);

            const statusSet = new Set(allInvoices.map(i => i.status));
            setUniqueStatus([...statusSet]);

            setLoadingInvoices(false);
        } catch (error) {
            console.error(error);
            setLoadingInvoices(false);
        }
    }, [generationData.classId, generationData.month, generationData.year]);

    useEffect(() => {
        if (generationData.classId) {
            fetchInvoices();
        }
    }, [fetchInvoices, generationData.classId]);

    const handleFilterClick = (event, column) => {
        setAnchorEl(event.currentTarget);
        setFilterColumn(column);
    };

    const handleFilterClose = () => {
        setAnchorEl(null);
        setFilterColumn('');
    };

    const handleFilterChange = (value) => {
        const currentFilters = filters[filterColumn] || [];
        const newFilters = currentFilters.includes(value)
            ? currentFilters.filter(item => item !== value)
            : [...currentFilters, value];

        setFilters({ ...filters, [filterColumn]: newFilters });
    };

    const getFilteredInvoices = () => {
        return generatedInvoices.filter(row => {
            const statusMatch = filters.status.length === 0 || filters.status.includes(row.status);
            return statusMatch;
        });
    };

    const openFilter = Boolean(anchorEl);
    const filteredInvoices = getFilteredInvoices();

    const handleModalClose = () => {
        setModalData({ ...modalData, open: false });
    };

    const handlePayClick = (invoice) => {
        setSelectedInvoice(invoice);
        const due = (invoice.totalAmount + invoice.lateFine) - invoice.paidAmount;
        setPaymentAmount(due);
        setPayDialogOpen(true);
    };

    const submitPayment = async () => {
        if (!selectedInvoice) return;
        try {
            await axios.put(`${process.env.REACT_APP_BASE_URL}/FeeInvoicePay/${selectedInvoice._id}`, {
                amount: paymentAmount,
                date: paymentDate
            });
            setPayDialogOpen(false);
            fetchInvoices();
            fetchStats();
            setModalData({ open: true, title: 'Success', message: "Payment Recorded", type: 'success' });
        } catch (error) {
            console.error(error);
            setModalData({ open: true, title: 'Error', message: "Payment Failed", type: 'error' });
        }
    };

    const StatCard = ({ title, value, color, icon: Icon }) => (
        <Paper
            elevation={0}
            sx={{
                p: 3,
                display: 'flex',
                flexDirection: 'column',
                position: 'relative',
                overflow: 'hidden',
                borderRadius: 4,
                border: '1px solid',
                borderColor: 'divider',
                '&:hover': {
                    boxShadow: '0 8px 24px rgba(0,0,0,0.1)',
                    transform: 'translateY(-4px)',
                    transition: 'all 0.3s ease'
                }
            }}
        >
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                <Typography variant="subtitle2" color="text.secondary" fontWeight="600">{title}</Typography>
                <Box sx={{ p: 1, borderRadius: 2, bgcolor: `${color}15`, color: color }}>
                    <Icon />
                </Box>
            </Box>
            <Typography variant="h4" fontWeight="800" sx={{ color: color }}>
                <CountUp start={0} end={value} duration={2.5} separator="," prefix="PKR " />
            </Typography>
        </Paper>
    );

    return (
        <Box sx={{ mt: 2, mb: 4, px: 3 }}>
            {loading ? (
                <CustomLoader />
            ) : (
                <>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
                        <Typography variant="h4" fontWeight="bold">Fee Management</Typography>
                        <Box sx={{ display: 'flex', gap: 1 }}>
                            <Button variant="contained" startIcon={<MonetizationOnIcon />} onClick={() => setGenModalOpen(true)} sx={{ borderRadius: 2 }}>
                                Generate Invoices
                            </Button>
                            <Button variant="outlined" onClick={() => navigate('/Admin/fees/defaulters')} sx={{ borderRadius: 2 }}>
                                Defaulters
                            </Button>
                            <Button variant="outlined" onClick={() => navigate('/Admin/fees/structure')} sx={{ borderRadius: 2 }}>
                                Config Fees
                            </Button>
                            <Button variant="contained" color="secondary" onClick={() => navigate('/Admin/fees/search')} startIcon={<SearchIcon />} sx={{ borderRadius: 2 }}>
                                Search
                            </Button>
                        </Box>
                    </Box>

                    <Grid container spacing={3} sx={{ mb: 4 }}>
                        <Grid item xs={12} sm={6} md={4}>
                            <StatCard title="Expected Revenue" value={stats.totalExpected} color="#1976d2" icon={MonetizationOnIcon} />
                        </Grid>
                        <Grid item xs={12} sm={6} md={4}>
                            <StatCard title="Collected Revenue" value={stats.totalCollected} color="#2e7d32" icon={MonetizationOnIcon} />
                        </Grid>
                        <Grid item xs={12} sm={6} md={4}>
                            <StatCard title="Total Late Fines" value={stats.totalLateFines} color="#ed6c02" icon={MonetizationOnIcon} />
                        </Grid>
                    </Grid>

                    {/* Generated Invoices List */}
                    <Paper elevation={0} sx={{ p: 0, mb: 4, borderRadius: 3, border: '1px solid', borderColor: 'divider', overflow: 'hidden' }}>
                        <Box sx={{ p: 3, borderBottom: '1px solid', borderColor: 'divider', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <Typography variant="h6" fontWeight="bold">Monthly Invoices</Typography>
                            <Box sx={{ display: 'flex', gap: 2 }}>
                                <TextField
                                    select
                                    size="small"
                                    label="Class"
                                    value={generationData.classId}
                                    onChange={(e) => setGenerationData({ ...generationData, classId: e.target.value })}
                                    sx={{ minWidth: 150 }}
                                >
                                    {classes.map((option) => (
                                        <MenuItem key={option._id} value={option._id}>
                                            {option.sclassName}
                                        </MenuItem>
                                    ))}
                                </TextField>
                                <TextField
                                    select
                                    size="small"
                                    label="Month"
                                    value={generationData.month}
                                    onChange={(e) => setGenerationData({ ...generationData, month: e.target.value })}
                                    sx={{ minWidth: 120 }}
                                >
                                    {Array.from({ length: 12 }, (_, i) => (
                                        <MenuItem key={i + 1} value={i + 1}>
                                            {new Date(0, i).toLocaleString('default', { month: 'long' })}
                                        </MenuItem>
                                    ))}
                                </TextField>
                            </Box>
                        </Box>
                        <TableContainer>
                            <Table>
                                <TableHead sx={{ bgcolor: 'action.hover' }}>
                                    <TableRow>
                                        <TableCell sx={{ fontWeight: 'bold' }}>Roll Num</TableCell>
                                        <TableCell sx={{ fontWeight: 'bold' }}>Name</TableCell>
                                        <TableCell sx={{ fontWeight: 'bold' }}>Month/Year</TableCell>
                                        <TableCell sx={{ fontWeight: 'bold' }}>Challan #</TableCell>
                                        <TableCell align="right" sx={{ fontWeight: 'bold' }}>Due Amount</TableCell>
                                        <TableCell align="right" sx={{ fontWeight: 'bold' }}>Paid</TableCell>
                                        <TableCell align="right" sx={{ fontWeight: 'bold' }}>Balance</TableCell>
                                        <TableCell align="center" sx={{ fontWeight: 'bold' }}>
                                            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                                Status
                                                <IconButton size="small" onClick={(e) => handleFilterClick(e, 'status')}>
                                                    <FilterListIcon fontSize="small" />
                                                </IconButton>
                                            </Box>
                                        </TableCell>
                                        <TableCell align="center" sx={{ fontWeight: 'bold' }}>Action</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {filteredInvoices.length > 0 ? (
                                        filteredInvoices.map((row) => {
                                            const totalDue = row.totalAmount + row.lateFine;
                                            const balance = totalDue - row.paidAmount;
                                            const isPaid = row.status === 'Paid' || balance <= 0;
                                            return (
                                                <TableRow key={row._id} hover>
                                                    <TableCell>{row.studentId?.rollNum}</TableCell>
                                                    <TableCell>{row.studentId?.name}</TableCell>
                                                    <TableCell>
                                                        {new Date(0, row.month - 1).toLocaleString('default', { month: 'long' })} {row.year}
                                                    </TableCell>
                                                    <TableCell>{row.challanNumber}</TableCell>
                                                    <TableCell align="right">{totalDue}</TableCell>
                                                    <TableCell align="right">{row.paidAmount}</TableCell>
                                                    <TableCell align="right" sx={{ color: 'error.main', fontWeight: 'bold' }}>
                                                        {balance}
                                                    </TableCell>
                                                    <TableCell align="center">
                                                        <Chip
                                                            label={row.status}
                                                            size="small"
                                                            color={row.status === 'Paid' ? 'success' : row.status === 'Partial' ? 'warning' : 'error'}
                                                            sx={{ fontWeight: 'bold' }}
                                                        />
                                                    </TableCell>
                                                    <TableCell align="center">
                                                        <Button
                                                            variant="contained"
                                                            size="small"
                                                            onClick={() => handlePayClick(row)}
                                                            disabled={isPaid}
                                                            sx={{ borderRadius: 2 }}
                                                        >
                                                            Pay
                                                        </Button>
                                                    </TableCell>
                                                </TableRow>
                                            );
                                        })
                                    ) : (
                                        <TableRow>
                                            <TableCell colSpan={9} align="center" sx={{ py: 4 }}>
                                                {loadingInvoices ? "Loading..." : "No invoices found for this selection."}
                                            </TableCell>
                                        </TableRow>
                                    )}
                                </TableBody>
                            </Table>
                        </TableContainer>
                    </Paper>

                    {/* Generate Invoices Modal */}
                    <Dialog open={genModalOpen} onClose={() => setGenModalOpen(false)} maxWidth="sm" fullWidth>
                        <DialogTitle sx={{ fontWeight: 'bold' }}>Generate Monthly Invoices</DialogTitle>
                        <DialogContent>
                            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3, mt: 1 }}>
                                <TextField
                                    select
                                    label="Select Class"
                                    fullWidth
                                    value={generationData.classId}
                                    onChange={(e) => setGenerationData({ ...generationData, classId: e.target.value })}
                                >
                                    {classes.map((option) => (
                                        <MenuItem key={option._id} value={option._id}>
                                            {option.sclassName}
                                        </MenuItem>
                                    ))}
                                </TextField>
                                <Box sx={{ display: 'flex', gap: 2 }}>
                                    <TextField
                                        select
                                        label="Month"
                                        value={generationData.month}
                                        onChange={(e) => setGenerationData({ ...generationData, month: e.target.value })}
                                        sx={{ flex: 1 }}
                                    >
                                        {Array.from({ length: 12 }, (_, i) => (
                                            <MenuItem key={i + 1} value={i + 1}>
                                                {new Date(0, i).toLocaleString('default', { month: 'long' })}
                                            </MenuItem>
                                        ))}
                                    </TextField>
                                    <TextField
                                        label="Year"
                                        type="number"
                                        value={generationData.year}
                                        onChange={(e) => setGenerationData({ ...generationData, year: e.target.value })}
                                        sx={{ flex: 1 }}
                                    />
                                </Box>
                                <TextField
                                    label="Due Date"
                                    type="date"
                                    fullWidth
                                    value={generationData.dueDate}
                                    onChange={(e) => setGenerationData({ ...generationData, dueDate: e.target.value })}
                                    InputLabelProps={{ shrink: true }}
                                />
                            </Box>
                        </DialogContent>
                        <DialogActions sx={{ p: 3 }}>
                            <Button onClick={() => setGenModalOpen(false)} color="inherit">Cancel</Button>
                            <Button variant="contained" onClick={handleGenerate} startIcon={<MonetizationOnIcon />}>
                                Generate Now
                            </Button>
                        </DialogActions>
                    </Dialog>

                    <CustomModal
                        open={modalData.open}
                        handleClose={handleModalClose}
                        title={modalData.title}
                        message={modalData.message}
                        type={modalData.type}
                    />

                    <Menu
                        anchorEl={anchorEl}
                        open={openFilter}
                        onClose={handleFilterClose}
                    >
                        {filterColumn === 'status' && uniqueStatus.map((status) => (
                            <MenuItem key={status} onClick={() => handleFilterChange(status)}>
                                <Checkbox checked={filters.status.includes(status)} />
                                <ListItemText primary={status} />
                            </MenuItem>
                        ))}
                    </Menu>

                    {/* Payment Dialog */}
                    <Dialog open={payDialogOpen} onClose={() => setPayDialogOpen(false)}>
                        <DialogTitle sx={{ fontWeight: 'bold' }}>Record Payment</DialogTitle>
                        <DialogContent>
                            <Box sx={{ mt: 1, display: 'flex', flexDirection: 'column', gap: 2 }}>
                                <TextField
                                    autoFocus
                                    label="Amount"
                                    type="number"
                                    fullWidth
                                    value={paymentAmount}
                                    onChange={(e) => setPaymentAmount(e.target.value)}
                                />
                                <TextField
                                    label="Date"
                                    type="date"
                                    fullWidth
                                    value={paymentDate}
                                    onChange={(e) => setPaymentDate(e.target.value)}
                                    InputLabelProps={{ shrink: true }}
                                />
                            </Box>
                        </DialogContent>
                        <DialogActions sx={{ p: 3 }}>
                            <Button onClick={() => setPayDialogOpen(false)} color="inherit">Cancel</Button>
                            <Button onClick={submitPayment} variant="contained">Submit Payment</Button>
                        </DialogActions>
                    </Dialog>
                </>
            )}
        </Box>
    );
};

export default FeeDashboard;
