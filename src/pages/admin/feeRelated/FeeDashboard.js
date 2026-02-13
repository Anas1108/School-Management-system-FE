import React, { useEffect, useState } from 'react';
import {
    Box, Grid, Paper, Typography, Button, TextField, MenuItem, Table, TableBody, TableCell,
    TableContainer, TableHead, TableRow, Chip, Dialog, DialogTitle,
    DialogContent, DialogActions, Menu, Checkbox, ListItemText, IconButton, Tooltip
} from '@mui/material';
import FilterListIcon from '@mui/icons-material/FilterList';
import { useDispatch, useSelector } from 'react-redux';
import CountUp from 'react-countup';
import axios from 'axios';
import MonetizationOnIcon from '@mui/icons-material/MonetizationOn';
import CustomModal from '../../../components/CustomModal';

const FeeDashboard = () => {
    const dispatch = useDispatch();
    const { currentUser } = useSelector(state => state.user);
    const [stats, setStats] = useState({ totalExpected: 0, totalCollected: 0, totalLateFines: 0 });
    const [loading, setLoading] = useState(true);

    const [generationData, setGenerationData] = useState({
        classId: '',
        month: new Date().getMonth() + 1, // Default current month
        year: new Date().getFullYear(),
        dueDate: new Date().toISOString().split('T')[0]
    });
    const [classes, setClasses] = useState([]);
    const [generatedInvoices, setGeneratedInvoices] = useState([]);
    const [loadingInvoices, setLoadingInvoices] = useState(false);

    // Modal State
    const [modalData, setModalData] = useState({ open: false, title: '', message: '', type: 'info' });

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

    useEffect(() => {
        fetchStats();
        fetchClasses();
    }, []);

    const fetchStats = async () => {
        try {
            const result = await axios.get(`${process.env.REACT_APP_BASE_URL}/FeeStats/${currentUser._id}`);
            setStats(result.data);
            setLoading(false);
        } catch (error) {
            console.error(error);
            setLoading(false);
        }
    };

    const fetchClasses = async () => {
        try {
            const result = await axios.get(`${process.env.REACT_APP_BASE_URL}/SclassList/${currentUser._id}`);
            if (result.data.message) {
                // handle no classes
            } else {
                setClasses(result.data);
            }
        } catch (error) {
            console.error(error);
        }
    }

    const handleGenerate = async () => {
        try {
            const data = { ...generationData, adminID: currentUser._id };
            // Ensure month is formatted correctly if needed
            const response = await axios.post(`${process.env.REACT_APP_BASE_URL}/FeeInvoiceGenerate`, data);

            setModalData({ open: true, title: 'Success', message: response.data.message || "Invoices Generation Processed", type: 'success' });
            fetchStats(); // Refresh stats
            fetchInvoices(); // Fetch the generated invoices
        } catch (error) {
            console.error(error);
            if (error.response && error.response.data && error.response.data.message) {
                setModalData({ open: true, title: 'Error', message: error.response.data.message, type: 'warning' });
            } else {
                setModalData({ open: true, title: 'Error', message: "Error generating invoices", type: 'error' });
            }
        }
    };

    const fetchInvoices = async () => {
        if (!generationData.classId) return;
        setLoadingInvoices(true);
        try {
            const result = await axios.get(`${process.env.REACT_APP_BASE_URL}/FeeInvoices/${generationData.classId}`, {
                params: { month: generationData.month, year: generationData.year }
            });
            const allInvoices = result.data;
            setGeneratedInvoices(allInvoices);

            // Extract unique status for filter
            const statusSet = new Set(allInvoices.map(i => i.status));
            setUniqueStatus([...statusSet]);

            setLoadingInvoices(false);
        } catch (error) {
            console.error(error);
            setLoadingInvoices(false);
        }
    };

    // Filter Logic
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
        // Default to remaining amount
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
            fetchInvoices(); // Refresh list to show updated status
            fetchStats(); // Refresh stats
            setModalData({ open: true, title: 'Success', message: "Payment Recorded", type: 'success' });
        } catch (error) {
            console.error(error);
            setModalData({ open: true, title: 'Error', message: "Payment Failed", type: 'error' });
        }
    };


    const StatCard = ({ title, value, color }) => (
        <Paper elevation={3} sx={{ p: 3, display: 'flex', flexDirection: 'column', alignItems: 'center', bgcolor: color, color: 'white' }}>
            <Typography variant="h6" gutterBottom>{title}</Typography>
            <Typography variant="h4" fontWeight="bold">
                <CountUp start={0} end={value} duration={2.5} separator="," prefix="PKR " />
            </Typography>
        </Paper>
    );

    return (
        <Box sx={{ mt: 4, mb: 4 }}>
            <Typography variant="h4" gutterBottom>Fee Management Dashboard</Typography>

            <Grid container spacing={3} sx={{ mb: 4 }}>
                <Grid item xs={12} md={4}>
                    <StatCard title="Expected Revenue" value={stats.totalExpected} color="#1976d2" />
                </Grid>
                <Grid item xs={12} md={4}>
                    <StatCard title="Collected Revenue" value={stats.totalCollected} color="#2e7d32" />
                </Grid>
                <Grid item xs={12} md={4}>
                    <StatCard title="Total Late Fines" value={stats.totalLateFines} color="#ed6c02" />
                </Grid>
            </Grid>

            <Paper elevation={3} sx={{ p: 3, mb: 4 }}>
                <Typography variant="h6" gutterBottom>Generate Monthly Invoices</Typography>
                <Box component="form" sx={{ display: 'flex', gap: 2, alignItems: 'end', flexWrap: 'wrap' }}>
                    <TextField
                        select
                        label="Select Class"
                        value={generationData.classId}
                        onChange={(e) => setGenerationData({ ...generationData, classId: e.target.value })}
                        sx={{ minWidth: 200 }}
                    >
                        {classes.map((option) => (
                            <MenuItem key={option._id} value={option._id}>
                                {option.sclassName}
                            </MenuItem>
                        ))}
                    </TextField>
                    <TextField
                        select
                        label="Month"
                        value={generationData.month}
                        onChange={(e) => setGenerationData({ ...generationData, month: e.target.value })}
                        sx={{ minWidth: 150 }}
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
                    />
                    <Button variant="contained" startIcon={<MonetizationOnIcon />} onClick={handleGenerate}>
                        Generate Invoices
                    </Button>
                </Box>
            </Paper>

            {/* Generated Invoices List - Table View */}
            <Paper elevation={3} sx={{ p: 3, mb: 4 }}>
                <Typography variant="h6" gutterBottom>Generated Invoices</Typography>
                <TableContainer>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell>Roll Num</TableCell>
                                <TableCell>Name</TableCell>
                                <TableCell>Month/Year</TableCell>
                                <TableCell>Challan #</TableCell>
                                <TableCell align="right">Due Amount</TableCell>
                                <TableCell align="right">Paid</TableCell>
                                <TableCell align="right">Balance</TableCell>
                                <TableCell>
                                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                        Status
                                        <IconButton size="small" onClick={(e) => handleFilterClick(e, 'status')}>
                                            <FilterListIcon fontSize="small" />
                                        </IconButton>
                                    </Box>
                                </TableCell>
                                <TableCell>Action</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {filteredInvoices.length > 0 ? (
                                filteredInvoices.map((row) => {
                                    const totalDue = row.totalAmount + row.lateFine;
                                    const balance = totalDue - row.paidAmount;
                                    const isPaid = row.status === 'Paid' || balance <= 0;
                                    return (
                                        <TableRow key={row._id}>
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
                                            <TableCell>
                                                <Chip label={row.status} color={row.status === 'Paid' ? 'success' : row.status === 'Partial' ? 'warning' : 'error'} />
                                            </TableCell>
                                            <TableCell>
                                                <Button
                                                    variant="contained"
                                                    size="small"
                                                    onClick={() => handlePayClick(row)}
                                                    disabled={isPaid}
                                                >
                                                    Pay
                                                </Button>
                                            </TableCell>
                                        </TableRow>
                                    );
                                })
                            ) : (
                                <TableRow>
                                    <TableCell colSpan={9} align="center">
                                        {loadingInvoices ? "Loading..." : "No invoices generated/fetched for this selection."}
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </TableContainer>
            </Paper>

            {/* Quick Links */}
            <Box sx={{ mt: 3, display: 'flex', gap: 2 }}>
                <Button variant="outlined" href="/Admin/fees/defaulters">View Defaulters</Button>
                <Button variant="outlined" href="/Admin/fees/structure">Configure Fees</Button>
            </Box>

            <CustomModal
                open={modalData.open}
                handleClose={handleModalClose}
                title={modalData.title}
                message={modalData.message}
                type={modalData.type}
            />

            {/* Filter Menu */}
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
                <DialogTitle>Record Payment</DialogTitle>
                <DialogContent>
                    <TextField
                        autoFocus
                        margin="dense"
                        label="Amount"
                        type="number"
                        fullWidth
                        value={paymentAmount}
                        onChange={(e) => setPaymentAmount(e.target.value)}
                    />
                    <TextField
                        margin="dense"
                        label="Date"
                        type="date"
                        fullWidth
                        value={paymentDate}
                        onChange={(e) => setPaymentDate(e.target.value)}
                        InputLabelProps={{ shrink: true }}
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setPayDialogOpen(false)}>Cancel</Button>
                    <Button onClick={submitPayment} variant="contained">Submit</Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
};

export default FeeDashboard;
