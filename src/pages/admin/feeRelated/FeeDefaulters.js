import React, { useEffect, useState, useCallback } from 'react';
import {
    Container, Box, Typography, Button, TextField, MenuItem, Table, TableBody, TableCell,
    TableContainer, TableHead, TableRow
} from '@mui/material';

import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import SearchIcon from '@mui/icons-material/Search';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import StudentFeeHistoryModal from '../../../components/StudentFeeHistoryModal';
import CustomLoader from '../../../components/CustomLoader';

const formatPKR = (amount) => {
    return new Intl.NumberFormat('en-PK', { style: 'currency', currency: 'PKR', minimumFractionDigits: 0 }).format(amount);
};

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
        if (currentUser && currentUser._id) {
            fetchClasses();
        }
    }, [currentUser, fetchClasses]);

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
        <Container maxWidth={false} sx={{ mt: 2, mb: 2 }}>
            <Box sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, justifyContent: 'space-between', alignItems: { xs: 'flex-start', sm: 'center' }, gap: 2, mb: 2 }}>
                <Typography variant="h4" component="h1" sx={{ fontWeight: 'bold', color: 'error.main' }}>
                    Fee Defaulters List
                </Typography>
                <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
                    <Button
                        variant="outlined"
                        startIcon={<ArrowBackIcon />}
                        onClick={() => navigate('/Admin/fees')}
                        sx={{ borderRadius: 'var(--border-radius-md)', px: 2, textTransform: 'none', borderColor: 'var(--border-color)' }}
                    >
                        Back to Dashboard
                    </Button>
                    <Button
                        variant="contained"
                        color="info"
                        startIcon={<SearchIcon />}
                        onClick={() => navigate('/Admin/fees/search')}
                        sx={{ borderRadius: 'var(--border-radius-md)', px: 2, textTransform: 'none', boxShadow: 'none' }}
                    >
                        Search
                    </Button>
                </Box>
            </Box>

            <Box sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, justifyContent: 'space-between', alignItems: { xs: 'flex-start', sm: 'center' }, gap: 2, mb: 2 }}>
                <Typography variant="body1" color="text.secondary">
                    Total Defaulters: <strong>{filteredInvoices.length}</strong>
                </Typography>
                <TextField
                    select
                    label="Select Class"
                    value={selectedClass}
                    onChange={(e) => {
                        setSelectedClass(e.target.value);
                        fetchInvoices(e.target.value);
                    }}
                    size="small"
                    sx={{ minWidth: 200, width: { xs: '100%', sm: 'auto' } }}
                    InputProps={{ style: { borderRadius: 'var(--border-radius-md)', backgroundColor: 'var(--bg-paper)' } }}
                >
                    {classes.map((option) => (
                        <MenuItem key={option._id} value={option._id}>
                            {option.sclassName}
                        </MenuItem>
                    ))}
                </TextField>
            </Box>

            {loading ? (
                <CustomLoader />
            ) : (
                <Box sx={{ borderRadius: 'var(--border-radius-lg)', overflow: 'hidden', border: '1px solid var(--border-color)', background: 'var(--bg-paper)' }}>
                    <TableContainer sx={{ maxHeight: '75vh', overflowX: 'auto' }}>
                        <Table stickyHeader>
                            <TableHead sx={{ bgcolor: 'action.hover' }}>
                                <TableRow>
                                    <TableCell sx={{ fontWeight: 'bold' }}>Name</TableCell>
                                    <TableCell sx={{ fontWeight: 'bold' }}>Roll Num</TableCell>
                                    <TableCell align="right" sx={{ fontWeight: 'bold' }}>Total Due Amount</TableCell>
                                    <TableCell align="center" sx={{ fontWeight: 'bold' }}>Action</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {filteredInvoices.length > 0 ? (
                                    filteredInvoices.map((row) => (
                                        <TableRow key={row.studentId} hover>
                                            <TableCell>{row.studentName}</TableCell>
                                            <TableCell>{row.rollNum}</TableCell>
                                            <TableCell align="right" sx={{ color: 'error.main', fontWeight: 'bold' }}>
                                                {formatPKR(row.totalDue)}
                                            </TableCell>
                                            <TableCell align="center">
                                                <Button
                                                    variant="contained"
                                                    size="small"
                                                    onClick={() => { setHistoryStudentId(row.studentId); setHistoryOpen(true); }}
                                                    sx={{ borderRadius: 2, textTransform: 'none', px: 2 }}
                                                >
                                                    View Details / Pay
                                                </Button>
                                            </TableCell>
                                        </TableRow>
                                    ))
                                ) : (
                                    <TableRow>
                                        <TableCell colSpan={4} align="center" sx={{ py: 4 }}>
                                            {selectedClass ? "No defaulters found" : "Please select a class to view defaulters"}
                                        </TableCell>
                                    </TableRow>
                                )}
                            </TableBody>
                        </Table>
                    </TableContainer>
                </Box>
            )}

            <StudentFeeHistoryModal
                open={historyOpen}
                handleClose={() => {
                    setHistoryOpen(false);
                    if (selectedClass) fetchInvoices(selectedClass);
                }}
                studentId={historyStudentId}
            />
        </Container>
    );
};

export default FeeDefaulters;
