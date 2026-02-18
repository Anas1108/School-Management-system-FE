import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getAllSclasses } from '../../redux/sclassRelated/sclassHandle';
import { getAllTeachers } from '../../redux/teacherRelated/teacherHandle';
import {
    Box, Button, Checkbox, FormControl, FormControlLabel, FormGroup,
    InputLabel, MenuItem, Select, Typography, CircularProgress, Alert,
    Grid, Paper, Switch, RadioGroup, Radio, Table, TableBody, TableCell,
    TableContainer, TableHead, TableRow, Chip
} from '@mui/material';
import axios from 'axios';
import styled from 'styled-components';

const SubjectAllocation = () => {
    const dispatch = useDispatch();
    const { currentUser } = useSelector(state => state.user);
    const { sclassesList } = useSelector(state => state.sclass);
    const { teachersList } = useSelector(state => state.teacher);

    const [loading, setLoading] = useState(false);
    const [teacher, setTeacher] = useState('');
    const [sclass, setSclass] = useState('');
    const [subjects, setSubjects] = useState([]);
    const [selectedSubjects, setSelectedSubjects] = useState([]);
    const [academicYear, setAcademicYear] = useState('2026');
    const [isClassIncharge, setIsClassIncharge] = useState(false);
    const [allocationType, setAllocationType] = useState('Primary');
    const [workload, setWorkload] = useState([]);
    const [message, setMessage] = useState({ type: '', content: '' });

    const adminID = currentUser._id;

    useEffect(() => {
        dispatch(getAllSclasses(adminID, "Sclass"));
        dispatch(getAllTeachers(adminID));
    }, [adminID, dispatch]);

    // Fetch subjects when Class is selected
    useEffect(() => {
        if (sclass) {
            axios.get(`${process.env.REACT_APP_BASE_URL}/ClassSubjects/${sclass}`)
                .then(response => {
                    setSubjects(response.data);
                })
                .catch(error => {
                    console.error("Error fetching subjects:", error);
                    setSubjects([]);
                });
        } else {
            setSubjects([]);
            setSelectedSubjects([]);
        }
    }, [sclass]);

    // Fetch Workload when Teacher is selected
    useEffect(() => {
        if (teacher) {
            fetchWorkload(teacher);
        } else {
            setWorkload([]);
        }
    }, [teacher]);

    const fetchWorkload = (teacherId) => {
        axios.get(`${process.env.REACT_APP_BASE_URL}/TeacherWorkload/${teacherId}`)
            .then(response => {
                setWorkload(response.data);
            })
            .catch(error => {
                console.error("Error fetching workload:", error);
            });
    };

    const handleSubjectChange = (subjectId) => {
        setSelectedSubjects(prev =>
            prev.includes(subjectId)
                ? prev.filter(id => id !== subjectId)
                : [...prev, subjectId]
        );
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setMessage({ type: '', content: '' });

        try {
            const response = await axios.post(`${process.env.REACT_APP_BASE_URL}/SubjectAllocation`, {
                teacherId: teacher,
                classId: sclass,
                subjects: selectedSubjects,
                academicYear,
                schoolId: adminID,
                isClassIncharge,
                type: allocationType
            });

            if (response.data.message) {
                setMessage({ type: 'success', content: response.data.message });
                setSelectedSubjects([]);
                setIsClassIncharge(false);
                fetchWorkload(teacher); // Refresh workload
            }
        } catch (error) {
            if (error.response && error.response.data && error.response.data.message) {
                const errorMsg = error.response.data.message + (error.response.data.errors ? `: ${error.response.data.errors.join(', ')}` : '');
                setMessage({ type: 'error', content: errorMsg });
            } else {
                setMessage({ type: 'error', content: "An error occurred during allocation." });
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <Box sx={{ p: 3 }}>
            <Typography variant="h4" component="h1" sx={{ fontWeight: 'bold', color: 'var(--text-primary)', mb: 4 }}>
                Subject Allocation
            </Typography>

            <Grid container spacing={4}>
                {/* Allocation Form */}
                <Grid item xs={12} md={6}>
                    <Paper elevation={3} sx={{ p: 4, borderRadius: 2 }}>
                        <Typography variant="h6" gutterBottom sx={{ color: '#3f51b5', mb: 3 }}>
                            Assign Subjects
                        </Typography>

                        {message.content && <Alert severity={message.type} sx={{ mb: 3 }}>{message.content}</Alert>}

                        <form onSubmit={handleSubmit}>
                            <FormControl fullWidth margin="normal">
                                <InputLabel>Select Teacher</InputLabel>
                                <Select
                                    value={teacher}
                                    label="Select Teacher"
                                    onChange={(e) => setTeacher(e.target.value)}
                                    required
                                >
                                    {teachersList && teachersList.map((tea) => (
                                        <MenuItem key={tea._id} value={tea._id}>
                                            {tea.name} ({tea.employeeId || 'No ID'})
                                        </MenuItem>
                                    ))}
                                </Select>
                            </FormControl>

                            <FormControl fullWidth margin="normal">
                                <InputLabel>Select Class</InputLabel>
                                <Select
                                    value={sclass}
                                    label="Select Class"
                                    onChange={(e) => setSclass(e.target.value)}
                                    required
                                >
                                    {sclassesList && sclassesList.map((item) => (
                                        <MenuItem key={item._id} value={item._id}>
                                            {item.sclassName}
                                        </MenuItem>
                                    ))}
                                </Select>
                            </FormControl>

                            {/* Regional Features */}
                            <Box sx={{ mt: 2, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                                <FormControl component="fieldset">
                                    <Typography variant="subtitle2" color="textSecondary">Allocation Type</Typography>
                                    <RadioGroup
                                        row
                                        value={allocationType}
                                        onChange={(e) => setAllocationType(e.target.value)}
                                    >
                                        <FormControlLabel value="Primary" control={<Radio size="small" />} label="Primary" />
                                        <FormControlLabel value="Substitute" control={<Radio size="small" />} label="Substitute" />
                                    </RadioGroup>
                                </FormControl>

                                <FormControlLabel
                                    control={
                                        <Switch
                                            checked={isClassIncharge}
                                            onChange={(e) => setIsClassIncharge(e.target.checked)}
                                            color="primary"
                                        />
                                    }
                                    label="Class In-charge"
                                />
                            </Box>

                            {/* Subject Selection */}
                            {subjects.length > 0 ? (
                                <Box sx={{ mt: 3, p: 2, border: '1px solid #eee', borderRadius: 1 }}>
                                    <Typography variant="subtitle1" gutterBottom>Success Subjects:</Typography>
                                    <FormGroup row>
                                        {subjects.map((sub) => (
                                            <FormControlLabel
                                                key={sub._id}
                                                control={
                                                    <Checkbox
                                                        checked={selectedSubjects.includes(sub._id)}
                                                        onChange={() => handleSubjectChange(sub._id)}
                                                        color="primary"
                                                    />
                                                }
                                                label={
                                                    <Typography variant="body2">
                                                        {sub.subName} <span style={{ color: '#888', fontSize: '0.8em' }}>({sub.subCode})</span>
                                                    </Typography>
                                                }
                                                sx={{ width: '45%', mr: 1 }}
                                            />
                                        ))}
                                    </FormGroup>
                                </Box>
                            ) : (
                                sclass && <Typography sx={{ mt: 2, color: 'text.secondary' }}>No subjects found for this class.</Typography>
                            )}

                            <Button
                                type="submit"
                                variant="contained"
                                size="large"
                                fullWidth
                                sx={{ mt: 4, bgcolor: '#1a237e', '&:hover': { bgcolor: '#0d47a1' } }}
                                disabled={loading || selectedSubjects.length === 0}
                            >
                                {loading ? <CircularProgress size={24} color="inherit" /> : 'Allocate Subjects'}
                            </Button>
                        </form>
                    </Paper>
                </Grid>

                {/* Teacher Workload Preview */}
                <Grid item xs={12} md={6}>
                    <Paper elevation={3} sx={{ p: 4, borderRadius: 2, height: '100%' }}>
                        <Typography variant="h6" gutterBottom sx={{ color: '#3f51b5', mb: 3 }}>
                            Teacher's Current Workload
                        </Typography>

                        {!teacher ? (
                            <Typography color="textSecondary" align="center" sx={{ mt: 5 }}>
                                Select a teacher to view their workload.
                            </Typography>
                        ) : workload.length === 0 ? (
                            <Typography color="textSecondary" align="center" sx={{ mt: 5 }}>
                                No active allocations for this teacher.
                            </Typography>
                        ) : (
                            <TableContainer>
                                <Table size="small">
                                    <TableHead>
                                        <TableRow sx={{ bgcolor: '#f5f5f5' }}>
                                            <TableCell><strong>Class</strong></TableCell>
                                            <TableCell><strong>Subject</strong></TableCell>
                                            <TableCell><strong>Type</strong></TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {workload.map((alloc) => (
                                            <TableRow key={alloc._id}>
                                                <TableCell>{alloc.classId?.sclassName || 'N/A'}</TableCell>
                                                <TableCell>
                                                    {alloc.subjectId?.subName} ({alloc.subjectId?.subCode})
                                                </TableCell>
                                                <TableCell>
                                                    <Chip
                                                        label={alloc.type}
                                                        size="small"
                                                        color={alloc.type === 'Primary' ? 'success' : 'warning'}
                                                        variant="outlined"
                                                    />
                                                    {alloc.isClassIncharge && (
                                                        <Chip label="In-charge" size="small" color="info" sx={{ ml: 1 }} />
                                                    )}
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </TableContainer>
                        )}
                    </Paper>
                </Grid>
            </Grid>
        </Box>
    );
};

export default SubjectAllocation;
