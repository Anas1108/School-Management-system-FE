import React, { useEffect, useState } from 'react';
import {
    Box, Paper, Typography, TextField, MenuItem, Table, TableBody, TableCell,
    TableContainer, TableHead, TableRow, Button, Chip, Dialog, DialogTitle,
    DialogContent, DialogActions
} from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import axios from 'axios';

const FeeDefaulters = () => {
    const { currentUser } = useSelector(state => state.user);
    const [classes, setClasses] = useState([]);
    const [selectedClass, setSelectedClass] = useState('');
    const [invoices, setInvoices] = useState([]);
    const [loading, setLoading] = useState(false);

    // Payment Dialog State
    const [payDialogOpen, setPayDialogOpen] = useState(false);
    const [selectedInvoice, setSelectedInvoice] = useState(null);
    const [paymentAmount, setPaymentAmount] = useState('');
    const [paymentDate, setPaymentDate] = useState(new Date().toISOString().split('T')[0]);

    useEffect(() => {
        fetchClasses();
    }, []);

    useEffect(() => {
        if (selectedClass) {
            fetchInvoices(selectedClass);
        }
    }, [selectedClass]);

    const fetchClasses = async () => {
        try {
            const result = await axios.get(`${process.env.REACT_APP_BASE_URL}/SclassList/${currentUser._id}`);
            if (!result.data.message) {
                setClasses(result.data);
            }
        } catch (error) {
            console.error(error);
        }
    }

    const fetchInvoices = async (classId) => {
        setLoading(true);
        try {
            const result = await axios.get(`${process.env.REACT_APP_BASE_URL}/FeeInvoices/${classId}`);
            // Filter only unpaid/partial
            const defaulters = result.data.filter(inv => inv.status !== 'Paid');
            setInvoices(defaulters);
            setLoading(false);
        } catch (error) {
            console.error(error);
            setLoading(false);
        }
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
            fetchInvoices(selectedClass); // Refresh
            alert("Payment Recorded");
        } catch (error) {
            console.error(error);
            alert("Payment Failed");
        }
    };

    return (
        <Box sx={{ mt: 4, mb: 4 }}>
            <Typography variant="h4" gutterBottom>Fee Defaulters List</Typography>

            <Paper elevation={3} sx={{ p: 2, mb: 3 }}>
                <TextField
                    select
                    label="Select Class"
                    fullWidth
                    value={selectedClass}
                    onChange={(e) => setSelectedClass(e.target.value)}
                >
                    {classes.map((option) => (
                        <MenuItem key={option._id} value={option._id}>
                            {option.sclassName}
                        </MenuItem>
                    ))}
                </TextField>
            </Paper>

            <TableContainer component={Paper}>
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
                            <TableCell>Status</TableCell>
                            <TableCell>Action</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {invoices.length > 0 ? (
                            invoices.map((row) => {
                                const totalDue = row.totalAmount + row.lateFine;
                                const balance = totalDue - row.paidAmount;
                                return (
                                    <TableRow key={row._id}>
                                        <TableCell>{row.studentId?.rollNum}</TableCell>
                                        <TableCell>{row.studentId?.name}</TableCell>
                                        <TableCell>{`${row.month}/${row.year}`}</TableCell>
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
                                            <Button variant="contained" size="small" onClick={() => handlePayClick(row)}>
                                                Pay
                                            </Button>
                                        </TableCell>
                                    </TableRow>
                                );
                            })
                        ) : (
                            <TableRow>
                                <TableCell colSpan={9} align="center">
                                    {selectedClass ? "No defaulters found" : "Select a class"}
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </TableContainer>

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

export default FeeDefaulters;
