import React, { useState, useEffect, useCallback } from 'react';
import {
    Container, Box, Typography, TextField, MenuItem, Button, Table, TableBody,
    TableCell, TableContainer, TableHead, TableRow, IconButton, Tooltip,
    InputAdornment
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import VisibilityIcon from '@mui/icons-material/Visibility';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import StudentFeeHistoryModal from '../../../components/StudentFeeHistoryModal';

const formatPKR = (amount) => {
    return new Intl.NumberFormat('en-PK', { style: 'currency', currency: 'PKR', minimumFractionDigits: 0 }).format(amount);
};

const FeeSearch = () => {
    const navigate = useNavigate();
    const { currentUser } = useSelector(state => state.user);
    const [classes, setClasses] = useState([]);
    const [rollNum, setRollNum] = useState('');
    const [selectedClass, setSelectedClass] = useState('');
    const [results, setResults] = useState([]);
    const [loading, setLoading] = useState(false);

    // Modal State
    const [historyOpen, setHistoryOpen] = useState(false);
    const [historyStudentId, setHistoryStudentId] = useState(null);

    const fetchClasses = useCallback(async () => {
        try {
            const result = await axios.get(`${process.env.REACT_APP_BASE_URL}/SclassList/${currentUser._id}`);
            if (!result.data.message) {
                setClasses(result.data);
            }
        } catch (error) {
            console.error("Error fetching classes:", error);
        }
    }, [currentUser._id]);

    useEffect(() => {
        if (currentUser && currentUser._id) {
            fetchClasses();
        }
    }, [currentUser, fetchClasses]);

    const handleSearch = async (e) => {
        if (e) e.preventDefault();
        setLoading(true);
        try {
            const response = await axios.get(`${process.env.REACT_APP_BASE_URL}/FeeSearch`, {
                params: {
                    rollNum: rollNum || undefined,
                    classId: selectedClass || undefined,
                    schoolId: currentUser._id
                }
            });
            setResults(response.data);
            setLoading(false);
        } catch (error) {
            console.error("Error searching fees:", error);
            setLoading(false);
        }
    };

    const handleViewDetails = (studentId) => {
        setHistoryStudentId(studentId);
        setHistoryOpen(true);
    };

    return (
        <Container maxWidth={false} sx={{ mt: 2, mb: 2 }}>
            <Box sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, justifyContent: 'space-between', alignItems: { xs: 'flex-start', sm: 'center' }, gap: 2, mb: 2 }}>
                <Typography variant="h4" component="h1" sx={{ fontWeight: 'bold', color: 'var(--text-primary)' }}>
                    Search Student Fees
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
                        variant="outlined"
                        color="error"
                        onClick={() => navigate('/Admin/fees/defaulters')}
                        sx={{ borderRadius: 'var(--border-radius-md)', px: 2, textTransform: 'none' }}
                    >
                        Defaulters
                    </Button>
                </Box>
            </Box>

            <Box component="form" onSubmit={handleSearch} sx={{ mb: 3 }}>
                <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, gap: 2, alignItems: { xs: 'stretch', md: 'center' }, flexWrap: 'wrap' }}>
                    <TextField
                        label="Roll Number"
                        value={rollNum}
                        onChange={(e) => setRollNum(e.target.value)}
                        size="small"
                        InputProps={{
                            startAdornment: (
                                <InputAdornment position="start">
                                    <SearchIcon fontSize="small" />
                                </InputAdornment>
                            ),
                            style: { borderRadius: 'var(--border-radius-md)', backgroundColor: 'var(--bg-paper)' }
                        }}
                        sx={{ minWidth: { md: 200 }, width: { xs: '100%', md: 'auto' } }}
                    />
                    <TextField
                        select
                        label="Select Class"
                        value={selectedClass}
                        onChange={(e) => setSelectedClass(e.target.value)}
                        size="small"
                        sx={{ minWidth: { md: 200 }, width: { xs: '100%', md: 'auto' } }}
                        InputProps={{ style: { borderRadius: 'var(--border-radius-md)', backgroundColor: 'var(--bg-paper)' } }}
                    >
                        <MenuItem value="">All Classes</MenuItem>
                        {classes.map((option) => (
                            <MenuItem key={option._id} value={option._id}>
                                {option.sclassName}
                            </MenuItem>
                        ))}
                    </TextField>
                    <Button
                        type="submit"
                        variant="contained"
                        startIcon={<SearchIcon />}
                        disabled={loading}
                        sx={{ borderRadius: 'var(--border-radius-md)', textTransform: 'none', boxShadow: 'none' }}
                    >
                        {loading ? "Searching..." : "Search"}
                    </Button>
                </Box>
            </Box>

            <Typography variant="h6" sx={{ fontWeight: 'bold', color: 'var(--text-primary)', mb: 2 }}>Search Results</Typography>
            <Box sx={{ borderRadius: 'var(--border-radius-lg)', overflow: 'hidden', border: '1px solid var(--border-color)', background: 'var(--bg-paper)' }}>
                <TableContainer sx={{ maxHeight: '75vh', overflowX: 'auto' }}>
                    <Table stickyHeader>
                        <TableHead sx={{ bgcolor: 'action.hover' }}>
                            <TableRow>
                                <TableCell sx={{ fontWeight: 'bold' }}>Roll Num</TableCell>
                                <TableCell sx={{ fontWeight: 'bold' }}>Name</TableCell>
                                <TableCell sx={{ fontWeight: 'bold' }}>Class</TableCell>
                                <TableCell align="right" sx={{ fontWeight: 'bold' }}>Total Paid</TableCell>
                                <TableCell align="right" sx={{ fontWeight: 'bold' }}>Total Due Balance</TableCell>
                                <TableCell align="center" sx={{ fontWeight: 'bold' }}>Action</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {results.length > 0 ? (
                                results.map((row) => (
                                    <TableRow key={row.studentId} hover>
                                        <TableCell>{row.rollNum}</TableCell>
                                        <TableCell>{row.studentName}</TableCell>
                                        <TableCell>{row.className}</TableCell>
                                        <TableCell align="right" sx={{ color: 'success.main', fontWeight: 'bold' }}>
                                            {formatPKR(row.totalPaid)}
                                        </TableCell>
                                        <TableCell align="right" sx={{ color: 'error.main', fontWeight: 'bold' }}>
                                            {formatPKR(row.totalDue)}
                                        </TableCell>
                                        <TableCell align="center">
                                            <Tooltip title="View History / Pay">
                                                <IconButton color="primary" onClick={() => handleViewDetails(row.studentId)}>
                                                    <VisibilityIcon />
                                                </IconButton>
                                            </Tooltip>
                                        </TableCell>
                                    </TableRow>
                                ))
                            ) : (
                                <TableRow>
                                    <TableCell colSpan={6} align="center" sx={{ py: 6 }}>
                                        {loading ? "Searching for records..." : (
                                            <Box sx={{ color: 'text.secondary' }}>
                                                <SearchIcon sx={{ fontSize: 40, mb: 1, opacity: 0.3 }} />
                                                <Typography variant="body2">No records found. Enter search criteria above.</Typography>
                                            </Box>
                                        )}
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </TableContainer>
            </Box>

            <StudentFeeHistoryModal
                open={historyOpen}
                handleClose={() => {
                    setHistoryOpen(false);
                    handleSearch(); // Refresh results in case payments were made
                }}
                studentId={historyStudentId}
            />
        </Container>
    );
};

export default FeeSearch;
