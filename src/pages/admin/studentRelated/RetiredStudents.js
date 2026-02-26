import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useSelector } from 'react-redux';
import {
    Box, Typography, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, CircularProgress
} from '@mui/material';
import { NoAccounts } from '@mui/icons-material';

const RetiredStudents = () => {
    const { currentUser } = useSelector(state => state.user);
    const [students, setStudents] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchRetiredStudents = async () => {
            try {
                const res = await axios.get(`${process.env.REACT_APP_BASE_URL}/Students/${currentUser._id}?status=Retired`);
                if (Array.isArray(res.data)) {
                    setStudents(res.data);
                } else if (res.data && res.data.students) {
                    setStudents(res.data.students);
                } else {
                    setStudents([]);
                }
            } catch (err) {
                console.error(err);
                setStudents([]);
            } finally {
                setLoading(false);
            }
        };
        fetchRetiredStudents();
    }, [currentUser._id]);

    return (
        <Box sx={{ p: 4 }}>
            <Box sx={{ mb: 4, display: 'flex', alignItems: 'center', gap: 2 }}>
                <NoAccounts color="primary" sx={{ fontSize: 40 }} />
                <Typography variant="h4" fontWeight="600" color="primary.main">
                    Retired Students
                </Typography>
            </Box>
            <Paper elevation={3} sx={{ p: 4, borderRadius: 3 }}>
                {loading ? (
                    <Box display="flex" justifyContent="center">
                        <CircularProgress />
                    </Box>
                ) : students.length > 0 ? (
                    <TableContainer>
                        <Table>
                            <TableHead>
                                <TableRow sx={{ backgroundColor: 'primary.light' }}>
                                    <TableCell sx={{ fontWeight: 'bold' }}>Name</TableCell>
                                    <TableCell sx={{ fontWeight: 'bold' }}>Roll Number</TableCell>
                                    <TableCell sx={{ fontWeight: 'bold' }}>Last Class</TableCell>
                                    <TableCell sx={{ fontWeight: 'bold' }}>Retirement Date</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {students.map((student) => (
                                    <TableRow key={student._id}>
                                        <TableCell>{student.name}</TableCell>
                                        <TableCell>{student.rollNum}</TableCell>
                                        <TableCell>{student.sclassName?.sclassName || 'N/A'}</TableCell>
                                        <TableCell>{student.retirementDate ? new Date(student.retirementDate).toLocaleDateString() : 'N/A'}</TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </TableContainer>
                ) : (
                    <Typography>No retired students found.</Typography>
                )}
            </Paper>
        </Box>
    );
};

export default RetiredStudents;
