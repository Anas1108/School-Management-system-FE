import React, { useEffect, useState, useCallback } from 'react';
import {
    Dialog, DialogTitle, DialogContent, DialogActions, Button,
    Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper,
    Typography, Box, CircularProgress, Chip, Divider, TextField
} from '@mui/material';
import axios from 'axios';

const StudentFeeHistoryModal = ({ open, handleClose, studentId }) => {
    const [history, setHistory] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    // Payment State
    const [payDialogOpen, setPayDialogOpen] = useState(false);
    const [selectedInvoice, setSelectedInvoice] = useState(null);
    const [paymentAmount, setPaymentAmount] = useState('');
    const [paymentDate, setPaymentDate] = useState(new Date().toISOString().split('T')[0]);

    const fetchHistory = useCallback(async () => {
        if (!studentId) return;
        setLoading(true);
        setError(null);
        try {
            const result = await axios.get(`${process.env.REACT_APP_BASE_URL}/FeeHistory/${studentId}`);
            setHistory(result.data);
        } catch (err) {
            console.error("Error fetching fee history:", err);
            setError("Failed to load fee history.");
        } finally {
            setLoading(false);
        }
    }, [studentId]);

    useEffect(() => {
        if (open && studentId) {
            fetchHistory();
        } else {
            setHistory(null); // Reset on close/change
        }
    }, [open, studentId, fetchHistory]);

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
            fetchHistory(); // Refresh history
            alert("Payment Recorded");
        } catch (error) {
            console.error(error);
            alert("Payment Failed");
        }
    };

    const monthNames = ["January", "February", "March", "April", "May", "June",
        "July", "August", "September", "October", "November", "December"
    ];

    return (
        <Dialog open={open} onClose={handleClose} maxWidth="md" fullWidth>
            <DialogTitle>Student Fee History</DialogTitle>
            <DialogContent dividers>
                {loading ? (
                    <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
                        <CircularProgress />
                    </Box>
                ) : error ? (
                    <Typography color="error" align="center">{error}</Typography>
                ) : history ? (
                    <Box>
                        <Box sx={{ mb: 2, display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: 2 }}>
                            <Box>
                                <Typography variant="subtitle1"><strong>Name:</strong> {history.studentName}</Typography>
                                <Typography variant="subtitle1"><strong>Class:</strong> {history.className}</Typography>
                            </Box>
                            <Box sx={{ textAlign: 'right' }}>
                                <Typography variant="subtitle1" color="error"><strong>Total Due:</strong> {history.totalDue}</Typography>
                                <Typography variant="subtitle1" color="success.main"><strong>Total Paid:</strong> {history.totalPaid}</Typography>
                            </Box>
                        </Box>
                        <Divider sx={{ mb: 2 }} />

                        <TableContainer component={Paper} elevation={0} variant="outlined">
                            <Table size="small">
                                <TableHead>
                                    <TableRow sx={{ backgroundColor: '#f5f5f5' }}>
                                        <TableCell><strong>Month/Year</strong></TableCell>
                                        <TableCell><strong>Challan #</strong></TableCell>
                                        <TableCell align="right"><strong>Total Amount</strong></TableCell>
                                        <TableCell align="right"><strong>Paid</strong></TableCell>
                                        <TableCell align="right"><strong>Balance</strong></TableCell>
                                        <TableCell align="center"><strong>Status</strong></TableCell>
                                        <TableCell align="center"><strong>Action</strong></TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {history.invoices && history.invoices.length > 0 ? (
                                        history.invoices.map((inv) => {
                                            const due = (inv.totalAmount + inv.lateFine) - inv.paidAmount;
                                            return (
                                                <TableRow key={inv._id}>
                                                    <TableCell>
                                                        {monthNames[parseInt(inv.month) - 1]} {inv.year}
                                                    </TableCell>
                                                    <TableCell>{inv.challanNumber}</TableCell>
                                                    <TableCell align="right">{inv.totalAmount + inv.lateFine}</TableCell>
                                                    <TableCell align="right">{inv.paidAmount}</TableCell>
                                                    <TableCell align="right" sx={{ color: due > 0 ? 'error.main' : 'inherit', fontWeight: due > 0 ? 'bold' : 'normal' }}>
                                                        {due}
                                                    </TableCell>
                                                    <TableCell align="center">
                                                        <Chip
                                                            label={inv.status}
                                                            size="small"
                                                            color={inv.status === 'Paid' ? 'success' : inv.status === 'Partial' ? 'warning' : 'error'}
                                                            variant="outlined"
                                                        />
                                                    </TableCell>
                                                    <TableCell align="center">
                                                        {inv.status !== 'Paid' && (
                                                            <Button
                                                                variant="contained"
                                                                color="primary"
                                                                size="small"
                                                                onClick={() => handlePayClick(inv)}
                                                            >
                                                                Pay
                                                            </Button>
                                                        )}
                                                    </TableCell>
                                                </TableRow>
                                            );
                                        })
                                    ) : (
                                        <TableRow>
                                            <TableCell colSpan={6} align="center">No invoice history found.</TableCell>
                                        </TableRow>
                                    )}
                                </TableBody>
                            </Table>
                        </TableContainer>
                    </Box>
                ) : (
                    <Typography align="center">No data available.</Typography>
                )}
            </DialogContent>
            <DialogActions>
                <Button onClick={handleClose} variant="outlined">Close</Button>
            </DialogActions>

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
        </Dialog >
    );
};

export default StudentFeeHistoryModal;
