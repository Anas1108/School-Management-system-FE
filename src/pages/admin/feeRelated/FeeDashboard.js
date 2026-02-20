import { useNavigate } from 'react-router-dom';
import React, { useEffect, useState, useCallback } from 'react';
import {
    Container, Box, Grid, Paper, Typography, Button, TextField, MenuItem, Table, TableBody, TableCell,
    TableContainer, TableHead, TableRow, Chip, Dialog, DialogTitle,
    DialogContent, DialogActions, Menu, Checkbox, ListItemText, IconButton, Tooltip, Divider
} from '@mui/material';
import FilterListIcon from '@mui/icons-material/FilterList';
import SearchIcon from '@mui/icons-material/Search';
import { useSelector } from 'react-redux';
import CountUp from 'react-countup';
import axios from 'axios';
import MonetizationOnIcon from '@mui/icons-material/MonetizationOn';
import SettingsIcon from '@mui/icons-material/Settings';
import PaymentsIcon from '@mui/icons-material/Payments';
import WarningAmberIcon from '@mui/icons-material/WarningAmber';
import CustomModal from '../../../components/CustomModal';
import CustomLoader from '../../../components/CustomLoader';

const formatPKR = (amount) => {
    return new Intl.NumberFormat('en-PK', { style: 'currency', currency: 'PKR', minimumFractionDigits: 0 }).format(amount);
};

const FeeDashboard = () => {
    const navigate = useNavigate();
    const { currentUser } = useSelector(state => state.user);
    const [stats, setStats] = useState({ totalExpected: 0, totalCollected: 0, totalLateFines: 0 });
    const [loading, setLoading] = useState(true);

    const [generationData, setGenerationData] = useState({
        classId: '',
        month: new Date().getMonth() + 1,
        year: new Date().getFullYear()
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
        fetchClasses();
        setLoading(false);
    }, [fetchClasses]);

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
            setModalData({ open: true, title: 'Success', message: "Payment Recorded", type: 'success' });
        } catch (error) {
            console.error(error);
            setModalData({ open: true, title: 'Error', message: "Payment Failed", type: 'error' });
        }
    };


    return (
        <Container maxWidth={false} sx={{ mt: 2, mb: 2 }}>
            {loading ? (
                <CustomLoader />
            ) : (
                <>
                    <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, justifyContent: 'space-between', alignItems: { xs: 'flex-start', md: 'center' }, gap: 2, mb: 2 }}>
                        <Typography variant="h4" component="h1" sx={{ fontWeight: 'bold', color: 'var(--text-primary)' }}>
                            Fee Management
                        </Typography>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, flexWrap: 'wrap' }}>
                            <Button variant="contained" startIcon={<PaymentsIcon />} onClick={() => setGenModalOpen(true)} sx={{ borderRadius: 'var(--border-radius-md)', textTransform: 'none', boxShadow: 'none' }}>
                                Generate Invoices
                            </Button>
                            <Button variant="outlined" color="error" onClick={() => navigate('/Admin/fees/defaulters')} startIcon={<WarningAmberIcon />} sx={{ borderRadius: 'var(--border-radius-md)', textTransform: 'none' }}>
                                Defaulters
                            </Button>
                            <Button variant="outlined" color="primary" onClick={() => navigate('/Admin/fees/structure')} startIcon={<SettingsIcon />} sx={{ borderRadius: 'var(--border-radius-md)', textTransform: 'none' }}>
                                Config Fees
                            </Button>
                            <Button variant="contained" color="info" onClick={() => navigate('/Admin/fees/search')} startIcon={<SearchIcon />} sx={{ borderRadius: 'var(--border-radius-md)', textTransform: 'none', boxShadow: 'none' }}>
                                Search
                            </Button>
                        </Box>
                    </Box>

                    {/* Generated Invoices List */}
                    <Box sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, justifyContent: 'space-between', alignItems: { xs: 'flex-start', sm: 'center' }, gap: 2, mb: 2 }}>
                        <Typography variant="h6" sx={{ fontWeight: 'bold', color: 'var(--text-primary)' }}>Monthly Invoices</Typography>
                        <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap', width: { xs: '100%', sm: 'auto' } }}>
                            <TextField
                                select
                                size="small"
                                label="Class"
                                value={generationData.classId}
                                onChange={(e) => setGenerationData({ ...generationData, classId: e.target.value })}
                                sx={{ minWidth: 150, flexGrow: { xs: 1, sm: 0 } }}
                                InputProps={{ style: { borderRadius: 'var(--border-radius-md)', backgroundColor: 'var(--bg-paper)' } }}
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
                                sx={{ minWidth: 120, flexGrow: { xs: 1, sm: 0 } }}
                                InputProps={{ style: { borderRadius: 'var(--border-radius-md)', backgroundColor: 'var(--bg-paper)' } }}
                            >
                                {Array.from({ length: 12 }, (_, i) => (
                                    <MenuItem key={i + 1} value={i + 1}>
                                        {new Date(0, i).toLocaleString('default', { month: 'long' })}
                                    </MenuItem>
                                ))}
                            </TextField>
                        </Box>
                    </Box>
                    <Box sx={{ borderRadius: 'var(--border-radius-lg)', overflow: 'hidden', border: '1px solid var(--border-color)', background: 'var(--bg-paper)' }}>
                        <TableContainer sx={{ maxHeight: '75vh', overflowX: 'auto' }}>
                            <Table stickyHeader>
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
                                                    <TableCell align="right">{formatPKR(totalDue)}</TableCell>
                                                    <TableCell align="right" sx={{ color: 'success.main', fontWeight: 'bold' }}>{formatPKR(row.paidAmount)}</TableCell>
                                                    <TableCell align="right" sx={{ color: 'error.main', fontWeight: 'bold' }}>
                                                        {formatPKR(balance)}
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
                    </Box>

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
                                <Box sx={{ display: 'flex', gap: 2, flexDirection: { xs: 'column', sm: 'row' } }}>
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
                                    inputProps={{ min: 1, step: "any" }}
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
        </Container>
    );
};

export default FeeDashboard;
