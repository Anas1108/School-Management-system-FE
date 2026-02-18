import React, { useEffect, useState, useCallback } from 'react';
import {
    Box, Grid, Paper, Typography, Button, TextField, MenuItem, Table, TableBody, TableCell,
    TableContainer, TableHead, TableRow
} from '@mui/material';

import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import SearchIcon from '@mui/icons-material/Search';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import StudentFeeHistoryModal from '../../../components/StudentFeeHistoryModal';

const FeeDefaulters = () => {
    const navigate = useNavigate();
    const { currentUser } = useSelector(state => state.user);
    const [classes, setClasses] = useState([]);
    const [selectedClass, setSelectedClass] = useState('');
    const [invoices, setInvoices] = useState([]);
    const [loading, setLoading] = useState(false);

    // History Modal State
    const [historyOpen, setHistoryOpen] = useState(false);
    const [historyStudentId, setHistoryStudentId] = useState(null);

    useEffect(() => {
        if (currentUser && currentUser._id) {
            fetchClasses();
        }
    }, [currentUser, fetchClasses]);

    useEffect(() => {
        if (selectedClass) {
            fetchInvoices(selectedClass);
        }
    }, [selectedClass]);

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

    const fetchInvoices = async (classId) => {
        setLoading(true);
        try {
            const result = await axios.get(`${process.env.REACT_APP_BASE_URL}/FeeDefaulters/${classId}`);
            setInvoices(result.data);
            setLoading(false);
        } catch (error) {
            console.error(error);
            setLoading(false);
        }
    };

    const filteredInvoices = invoices;

    return (
        <Box sx={{ mt: 2, mb: 4, px: 3 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
                <Typography variant="h4" fontWeight="bold">Fee Defaulters List</Typography>
                <Box sx={{ display: 'flex', gap: 1 }}>
                    <Button
                        variant="outlined"
                        startIcon={<ArrowBackIcon />}
                        onClick={() => navigate('/Admin/fees')}
                        sx={{ borderRadius: 2 }}
                    >
                        Back to Dashboard
                    </Button>
                    <Button
                        variant="contained"
                        color="secondary"
                        startIcon={<SearchIcon />}
                        onClick={() => navigate('/Admin/fees/search')}
                        sx={{ borderRadius: 2 }}
                    >
                        Search
                    </Button>
                </Box>
            </Box>

            <Paper elevation={0} sx={{ p: 3, mb: 3, borderRadius: 3, border: '1px solid', borderColor: 'divider' }}>
                <Grid container spacing={2} alignItems="center">
                    <Grid item xs={12} md={6}>
                        <TextField
                            select
                            label="Select Class"
                            fullWidth
                            value={selectedClass}
                            onChange={(e) => setSelectedClass(e.target.value)}
                            size="small"
                        >
                            {classes.map((option) => (
                                <MenuItem key={option._id} value={option._id}>
                                    {option.sclassName}
                                </MenuItem>
                            ))}
                        </TextField>
                    </Grid>
                    <Grid item xs={12} md={6}>
                        <Typography variant="body2" color="text.secondary">
                            Showing defaulters for the selected class. Total: <strong>{filteredInvoices.length}</strong>
                        </Typography>
                    </Grid>
                </Grid>
            </Paper>

            <TableContainer component={Paper} elevation={0} sx={{ borderRadius: 3, border: '1px solid', borderColor: 'divider', overflow: 'hidden' }}>
                <Table>
                    <TableHead sx={{ bgcolor: 'action.hover' }}>
                        <TableRow>
                            <TableCell sx={{ fontWeight: 'bold' }}>Roll Num</TableCell>
                            <TableCell sx={{ fontWeight: 'bold' }}>Name</TableCell>
                            <TableCell align="right" sx={{ fontWeight: 'bold' }}>Total Due Amount</TableCell>
                            <TableCell align="center" sx={{ fontWeight: 'bold' }}>Action</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {filteredInvoices.length > 0 ? (
                            filteredInvoices.map((row) => (
                                <TableRow key={row.studentId} hover>
                                    <TableCell>{row.rollNum}</TableCell>
                                    <TableCell>{row.studentName}</TableCell>
                                    <TableCell align="right" sx={{ color: 'error.main', fontWeight: 'bold' }}>
                                        {row.totalDue}
                                    </TableCell>
                                    <TableCell align="center">
                                        <Button
                                            variant="contained"
                                            size="small"
                                            onClick={() => { setHistoryStudentId(row.studentId); setHistoryOpen(true); }}
                                            sx={{ borderRadius: 2 }}
                                        >
                                            View Details / Pay
                                        </Button>
                                    </TableCell>
                                </TableRow>
                            ))
                        ) : (
                            <TableRow>
                                <TableCell colSpan={4} align="center" sx={{ py: 4 }}>
                                    {loading ? "Loading..." : (selectedClass ? "No defaulters found" : "Please select a class to view defaulters")}
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </TableContainer>

            <StudentFeeHistoryModal
                open={historyOpen}
                handleClose={() => {
                    setHistoryOpen(false);
                    if (selectedClass) fetchInvoices(selectedClass);
                }}
                studentId={historyStudentId}
            />
        </Box>
    );
};

export default FeeDefaulters;
