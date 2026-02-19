import React, { useState, useEffect, useCallback } from 'react';
import {
    Box, Paper, Typography, TextField, MenuItem, Button, Table, TableBody,
    TableCell, TableContainer, TableHead, TableRow, IconButton, Tooltip,
    InputAdornment, Grid
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import VisibilityIcon from '@mui/icons-material/Visibility';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import StudentFeeHistoryModal from '../../../components/StudentFeeHistoryModal';

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
        <Box sx={{ mt: 2, mb: 4, px: 3 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
                <Typography variant="h4" fontWeight="bold">Search Student Fees</Typography>
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
                        variant="outlined"
                        onClick={() => navigate('/Admin/fees/defaulters')}
                        sx={{ borderRadius: 2 }}
                    >
                        Defaulters
                    </Button>
                </Box>
            </Box>

            <Paper elevation={0} sx={{ p: 3, mb: 4, borderRadius: 3, border: '1px solid', borderColor: 'divider' }}>
                <Box component="form" onSubmit={handleSearch}>
                    <Grid container spacing={3} alignItems="flex-end">
                        <Grid item xs={12} md={4}>
                            <TextField
                                fullWidth
                                label="Roll Number"
                                value={rollNum}
                                onChange={(e) => setRollNum(e.target.value)}
                                size="small"
                                InputProps={{
                                    startAdornment: (
                                        <InputAdornment position="start">
                                            <SearchIcon />
                                        </InputAdornment>
                                    ),
                                }}
                            />
                        </Grid>
                        <Grid item xs={12} md={4}>
                            <TextField
                                select
                                fullWidth
                                label="Select Class"
                                value={selectedClass}
                                onChange={(e) => setSelectedClass(e.target.value)}
                                size="small"
                            >
                                <MenuItem value="">All Classes</MenuItem>
                                {classes.map((option) => (
                                    <MenuItem key={option._id} value={option._id}>
                                        {option.sclassName}
                                    </MenuItem>
                                ))}
                            </TextField>
                        </Grid>
                        <Grid item xs={12} md={4}>
                            <Button
                                type="submit"
                                variant="contained"
                                fullWidth
                                size="large"
                                startIcon={<SearchIcon />}
                                disabled={loading}
                                sx={{ height: 40, borderRadius: 2 }}
                            >
                                {loading ? "Searching..." : "Search"}
                            </Button>
                        </Grid>
                    </Grid>
                </Box>
            </Paper>

            <Typography variant="h6" fontWeight="bold" gutterBottom>Search Results</Typography>
            <TableContainer component={Paper} elevation={0} sx={{ borderRadius: 3, border: '1px solid', borderColor: 'divider', overflow: 'hidden' }}>
                <Table>
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
                                        {row.totalPaid}
                                    </TableCell>
                                    <TableCell align="right" sx={{ color: 'error.main', fontWeight: 'bold' }}>
                                        {row.totalDue}
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

            <StudentFeeHistoryModal
                open={historyOpen}
                handleClose={() => {
                    setHistoryOpen(false);
                    handleSearch(); // Refresh results in case payments were made
                }}
                studentId={historyStudentId}
            />
        </Box>
    );
};

export default FeeSearch;
