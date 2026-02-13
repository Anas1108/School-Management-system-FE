import React, { useState, useEffect } from 'react';
import {
    Box, Paper, Typography, TextField, MenuItem, Button, Table, TableBody,
    TableCell, TableContainer, TableHead, TableRow, IconButton, Tooltip,
    InputAdornment, Grid
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import VisibilityIcon from '@mui/icons-material/Visibility';
import { useSelector } from 'react-redux';
import axios from 'axios';
import StudentFeeHistoryModal from '../../../components/StudentFeeHistoryModal';

const FeeSearch = () => {
    const { currentUser } = useSelector(state => state.user);
    const [classes, setClasses] = useState([]);
    const [rollNum, setRollNum] = useState('');
    const [selectedClass, setSelectedClass] = useState('');
    const [results, setResults] = useState([]);
    const [loading, setLoading] = useState(false);

    // Modal State
    const [historyOpen, setHistoryOpen] = useState(false);
    const [historyStudentId, setHistoryStudentId] = useState(null);

    useEffect(() => {
        if (currentUser && currentUser._id) {
            fetchClasses();
        }
    }, [currentUser]);

    const fetchClasses = async () => {
        try {
            const result = await axios.get(`${process.env.REACT_APP_BASE_URL}/SclassList/${currentUser._id}`);
            if (!result.data.message) {
                setClasses(result.data);
            }
        } catch (error) {
            console.error("Error fetching classes:", error);
        }
    };

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
        <Box sx={{ mt: 4, mb: 4 }}>
            <Typography variant="h4" gutterBottom>Search Student Fees</Typography>

            <Paper elevation={3} sx={{ p: 3, mb: 4 }}>
                <Box component="form" onSubmit={handleSearch}>
                    <Grid container spacing={2} alignItems="center">
                        <Grid item xs={12} md={4}>
                            <TextField
                                fullWidth
                                label="Roll Number"
                                value={rollNum}
                                onChange={(e) => setRollNum(e.target.value)}
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
                            >
                                {loading ? "Searching..." : "Search"}
                            </Button>
                        </Grid>
                    </Grid>
                </Box>
            </Paper>

            <TableContainer component={Paper} elevation={3}>
                <Table>
                    <TableHead sx={{ bgcolor: 'var(--color-primary-50)' }}>
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
                                    <TableCell align="right" sx={{ color: 'success.main' }}>
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
                                <TableCell colSpan={6} align="center" sx={{ py: 3 }}>
                                    {loading ? "Loading results..." : "No records found. Enter search criteria above."}
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </TableContainer>

            <StudentFeeHistoryModal
                open={historyOpen}
                handleClose={() => setHistoryOpen(false)}
                studentId={historyStudentId}
            />
        </Box>
    );
};

export default FeeSearch;
