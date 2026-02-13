import React, { useEffect, useState } from 'react';
import {
    Box, Paper, Typography, TextField, MenuItem, Table, TableBody, TableCell,
    TableContainer, TableHead, TableRow, Button, Chip, Dialog, DialogTitle,
    DialogContent, DialogActions, Menu, Checkbox, ListItemText, IconButton, Tooltip
} from '@mui/material';
import FilterListIcon from '@mui/icons-material/FilterList';
import { useDispatch, useSelector } from 'react-redux';
import axios from 'axios';
import StudentFeeHistoryModal from '../../../components/StudentFeeHistoryModal';

const FeeDefaulters = () => {
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
    }, [currentUser]);

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
                            <TableCell align="right">Total Due Amount</TableCell>
                            <TableCell align="center">Action</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {filteredInvoices.length > 0 ? (
                            filteredInvoices.map((row) => (
                                <TableRow key={row.studentId}>
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
                                        >
                                            View Details / Pay
                                        </Button>
                                    </TableCell>
                                </TableRow>
                            ))
                        ) : (
                            <TableRow>
                                <TableCell colSpan={4} align="center">
                                    {selectedClass ? "No defaulters found" : "Select a class"}
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
