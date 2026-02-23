import React, { useEffect, useState, useCallback } from 'react';
import {
    Dialog, DialogTitle, DialogContent, DialogActions, Button,
    Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper,
    Typography, Box, CircularProgress, Chip, Divider, TextField, InputAdornment, IconButton, Tooltip
} from '@mui/material';
import PrintIcon from '@mui/icons-material/Print';
import axios from 'axios';
import CustomModal from './CustomModal';
import schoolLogo from '../assets/tks-Kulluwal.png';

const formatPKR = (amount) => {
    return new Intl.NumberFormat('en-PK', { style: 'currency', currency: 'PKR', minimumFractionDigits: 0 }).format(amount);
};

const StudentFeeHistoryModal = ({ open, handleClose, studentId }) => {
    const [history, setHistory] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const [payDialogOpen, setPayDialogOpen] = useState(false);
    const [selectedInvoice, setSelectedInvoice] = useState(null);
    const [paymentAmount, setPaymentAmount] = useState('');
    const [paymentDate, setPaymentDate] = useState(new Date().toISOString().split('T')[0]);

    // Modal State
    const [modalData, setModalData] = useState({ open: false, title: '', message: '', type: 'info' });

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
            setModalData({ open: true, title: 'Success', message: "Payment Recorded", type: 'success' });
        } catch (error) {
            console.error(error);
            setModalData({ open: true, title: 'Error', message: "Payment Failed", type: 'error' });
        }
    };

    const monthNames = ["January", "February", "March", "April", "May", "June",
        "July", "August", "September", "October", "November", "December"
    ];

    const handlePrint = (invoice) => {
        const printWindow = window.open('', '_blank');
        const due = (invoice.totalAmount + invoice.lateFine) - invoice.paidAmount;

        const htmlContent = `
            <html>
                <head>
                    <title>Fee Invoice - ${history?.studentName}</title>
                    <link rel="icon" href="${schoolLogo}" type="image/png">
                    <style>
                        body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; padding: 20px; color: #333; }
                        .invoice-box { max-width: 800px; margin: auto; padding: 30px; border: 1px solid #eee; box-shadow: 0 0 10px rgba(0, 0, 0, 0.15); font-size: 16px; line-height: 24px; }
                        .header { display: flex; justify-content: space-between; align-items: center; border-bottom: 2px solid #333; padding-bottom: 20px; margin-bottom: 20px; }
                        .school-logo { max-height: 80px; }
                        .invoice-title { font-size: 28px; font-weight: bold; text-align: right; color: #555; }
                        .details { display: flex; justify-content: space-between; margin-bottom: 30px; }
                        .details-section { width: 45%; }
                        table { width: 100%; line-height: inherit; text-align: left; border-collapse: collapse; margin-bottom: 20px; }
                        table th, table td { padding: 12px; border: 1px solid #ddd; }
                        table th { background-color: #f5f5f5; font-weight: bold; }
                        .total-section { display: flex; justify-content: flex-end; }
                        .total-box { width: 300px; }
                        .total-row { display: flex; justify-content: space-between; padding: 8px 0; border-bottom: 1px solid #ddd; }
                        .total-row.grand-total { font-weight: bold; font-size: 18px; border-bottom: 2px solid #333; padding-top: 12px; }
                        .footer { margin-top: 50px; text-align: center; font-size: 14px; color: #777; border-top: 1px solid #eee; padding-top: 20px; }
                        @media print {
                            .invoice-box { box-shadow: none; border: none; padding: 0; }
                            body { -webkit-print-color-adjust: exact; padding: 0; }
                        }
                    </style>
                </head>
                <body>
                    <div class="invoice-box">
                        <div class="header">
                            <div>
                                <img src="${schoolLogo}" alt="School Logo" class="school-logo" />
                            </div>
                            <div class="invoice-title">INVOICE</div>
                        </div>
                        
                        <div class="details">
                            <div class="details-section">
                                <strong>Billed To:</strong><br>
                                Student Name: ${history?.studentName}<br>
                                Class: ${history?.className}<br>
                                Roll Number: ${history?.rollNum || 'N/A'}
                            </div>
                            <div class="details-section" style="text-align: right;">
                                <strong>Invoice Details:</strong><br>
                                Challan #: ${invoice.challanNumber}<br>
                                Month: ${monthNames[parseInt(invoice.month) - 1]} ${invoice.year}<br>
                                Status: <span style="color: ${invoice.status === 'Paid' ? 'green' : invoice.status === 'Partial' ? 'orange' : 'red'}; font-weight: bold;">${invoice.status}</span>
                            </div>
                        </div>

                        <table>
                            <thead>
                                <tr>
                                    <th>Description</th>
                                    <th style="text-align: right;">Amount</th>
                                </tr>
                            </thead>
                            <tbody>
                                ${invoice.feeBreakdown && invoice.feeBreakdown.length > 0 ?
                invoice.feeBreakdown.map(head => `
                                    <tr>
                                        <td>${head.headName}</td>
                                        <td style="text-align: right;">${formatPKR(head.amount)}</td>
                                    </tr>
                                    `).join('')
                : `
                                <tr>
                                    <td>Tuition Fee - ${monthNames[parseInt(invoice.month) - 1]} ${invoice.year}</td>
                                    <td style="text-align: right;">${formatPKR(invoice.totalAmount)}</td>
                                </tr>
                                `}
                                ${invoice.lateFine > 0 ? `
                                <tr>
                                    <td>Late Fine</td>
                                    <td style="text-align: right;">${formatPKR(invoice.lateFine)}</td>
                                </tr>
                                ` : ''}
                            </tbody>
                        </table>

                        <div class="total-section">
                            <div class="total-box">
                                <div class="total-row">
                                    <span>Total Amount:</span>
                                    <span>${formatPKR(invoice.totalAmount + invoice.lateFine)}</span>
                                </div>
                                <div class="total-row">
                                    <span>Paid Amount:</span>
                                    <span>${formatPKR(invoice.paidAmount)}</span>
                                </div>
                                <div class="total-row grand-total" style="color: ${due > 0 ? 'red' : 'green'};">
                                    <span>Balance Due:</span>
                                    <span>${formatPKR(due)}</span>
                                </div>
                            </div>
                        </div>

                        <div class="footer">
                            <p>This is a computer generated invoice and does not require a physical signature.</p>
                        </div>
                    </div>
                </body>
            </html>
        `;

        printWindow.document.open();
        printWindow.document.write(htmlContent);
        printWindow.document.close();

        setTimeout(() => {
            printWindow.print();
        }, 250);
    };

    const handlePrintFullHistory = () => {
        if (!history || !history.invoices || history.invoices.length === 0) return;

        const printWindow = window.open('', '_blank');

        // Generate rows for each invoice
        const invoiceRows = history.invoices.map(inv => {
            const due = (inv.totalAmount + inv.lateFine) - inv.paidAmount;
            return `
                <tr>
                    <td>${monthNames[parseInt(inv.month) - 1]} ${inv.year}</td>
                    <td>${inv.challanNumber}</td>
                    <td style="text-align: right;">${formatPKR(inv.totalAmount + inv.lateFine)}</td>
                    <td style="text-align: right;">${formatPKR(inv.paidAmount)}</td>
                    <td style="text-align: right; color: ${due > 0 ? 'red' : 'inherit'}; font-weight: ${due > 0 ? 'bold' : 'normal'};">${formatPKR(due)}</td>
                    <td style="text-align: center;">
                        <span style="color: ${inv.status === 'Paid' ? 'green' : inv.status === 'Partial' ? 'orange' : 'red'}; font-weight: bold;">
                            ${inv.status}
                        </span>
                    </td>
                </tr>
            `;
        }).join('');

        const htmlContent = `
            <html>
                <head>
                    <title>Full Fee History - ${history.studentName}</title>
                    <link rel="icon" href="${schoolLogo}" type="image/png">
                    <style>
                        body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; padding: 20px; color: #333; }
                        .history-box { max-width: 900px; margin: auto; padding: 30px; border: 1px solid #eee; box-shadow: 0 0 10px rgba(0, 0, 0, 0.15); font-size: 14px; line-height: 20px; }
                        .header { display: flex; justify-content: space-between; align-items: center; border-bottom: 2px solid #333; padding-bottom: 20px; margin-bottom: 20px; }
                        .school-logo { max-height: 80px; }
                        .report-title { font-size: 24px; font-weight: bold; text-align: right; color: #555; }
                        .details { display: flex; justify-content: space-between; margin-bottom: 30px; background-color: #f9f9f9; padding: 15px; border-radius: 8px; border: 1px solid #e0e0e0; }
                        .details-section { width: 45%; }
                        .summary-section { width: 45%; text-align: right; }
                        table { width: 100%; line-height: inherit; text-align: left; border-collapse: collapse; margin-bottom: 30px; }
                        table th, table td { padding: 10px; border: 1px solid #ddd; }
                        table th { background-color: #f5f5f5; font-weight: bold; }
                        .footer { margin-top: 50px; text-align: center; font-size: 14px; color: #777; border-top: 1px solid #eee; padding-top: 20px; }
                        @media print {
                            .history-box { box-shadow: none; border: none; padding: 0; max-width: 100%; }
                            body { -webkit-print-color-adjust: exact; padding: 0; }
                        }
                    </style>
                </head>
                <body>
                    <div class="history-box">
                        <div class="header">
                            <div>
                                <img src="${schoolLogo}" alt="School Logo" class="school-logo" />
                            </div>
                            <div class="report-title">FEE HISTORY REPORT</div>
                        </div>
                        
                        <div class="details">
                            <div class="details-section">
                                <strong style="font-size: 16px;">Student Details:</strong><br><br>
                                <strong>Name:</strong> ${history.studentName}<br>
                                <strong>Class:</strong> ${history.className}<br>
                                <strong>Roll Number:</strong> ${history.rollNum || 'N/A'}
                            </div>
                            <div class="summary-section">
                                <strong style="font-size: 16px;">Financial Summary:</strong><br><br>
                                <strong>Total Paid:</strong> <span style="color: green;">${formatPKR(history.totalPaid)}</span><br>
                                <strong style="font-size: 16px;">Total Due Balance: <span style="color: red;">${formatPKR(history.totalDue)}</span></strong>
                            </div>
                        </div>

                        <table>
                            <thead>
                                <tr>
                                    <th>Month/Year</th>
                                    <th>Challan #</th>
                                    <th style="text-align: right;">Total Amount</th>
                                    <th style="text-align: right;">Paid</th>
                                    <th style="text-align: right;">Balance</th>
                                    <th style="text-align: center;">Status</th>
                                </tr>
                            </thead>
                            <tbody>
                                ${invoiceRows}
                            </tbody>
                        </table>

                        <div class="footer">
                            <p>This is a computer generated summary and does not require a physical signature.</p>
                            <p>Generated on: ${new Date().toLocaleDateString()}</p>
                        </div>
                    </div>
                </body>
            </html>
        `;

        printWindow.document.open();
        printWindow.document.write(htmlContent);
        printWindow.document.close();

        setTimeout(() => {
            printWindow.print();
        }, 250);
    };

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
                            <Box sx={{ textAlign: 'right', display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 1 }}>
                                <Box>
                                    <Typography variant="subtitle1" color="error"><strong>Total Due:</strong> {formatPKR(history.totalDue)}</Typography>
                                    <Typography variant="subtitle1" color="success.main"><strong>Total Paid:</strong> {formatPKR(history.totalPaid)}</Typography>
                                </Box>
                                {history.invoices && history.invoices.length > 0 && (
                                    <Button
                                        variant="outlined"
                                        color="primary"
                                        size="small"
                                        startIcon={<PrintIcon />}
                                        onClick={handlePrintFullHistory}
                                    >
                                        Print Full History
                                    </Button>
                                )}
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
                                                    <TableCell align="right">{formatPKR(inv.totalAmount + inv.lateFine)}</TableCell>
                                                    <TableCell align="right">{formatPKR(inv.paidAmount)}</TableCell>
                                                    <TableCell align="right" sx={{ color: due > 0 ? 'error.main' : 'inherit', fontWeight: due > 0 ? 'bold' : 'normal' }}>
                                                        {formatPKR(due)}
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
                                                        <Box sx={{ display: 'flex', justifyContent: 'center', gap: 1 }}>
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
                                                            <Tooltip title="Print Invoice">
                                                                <IconButton color="info" size="small" onClick={() => handlePrint(inv)}>
                                                                    <PrintIcon fontSize="small" />
                                                                </IconButton>
                                                            </Tooltip>
                                                        </Box>
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
                        inputProps={{ min: 1, step: "any" }}
                        InputProps={{ startAdornment: <InputAdornment position="start">PKR</InputAdornment> }}
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

            <CustomModal
                open={modalData.open}
                handleClose={() => setModalData({ ...modalData, open: false })}
                title={modalData.title}
                message={modalData.message}
                type={modalData.type}
            />
        </Dialog >
    );
};

export default StudentFeeHistoryModal;
