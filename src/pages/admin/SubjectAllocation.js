import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getAllSclasses } from '../../redux/sclassRelated/sclassHandle';
import { getAllTeachers } from '../../redux/teacherRelated/teacherHandle';
import {
    Box, Button, Checkbox, FormControl, FormControlLabel, FormGroup,
    InputLabel, MenuItem, Select, Typography, CircularProgress, Alert,
    Grid, Paper, Switch, RadioGroup, Radio, Table, TableBody, TableCell,
    TableContainer, TableHead, TableRow, Chip, Container, Tabs, Tab
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
    const [academicYear, setAcademicYear] = useState('2026'); // Ideally this should be dynamic or from settings
    const [isClassIncharge, setIsClassIncharge] = useState(false);
    const [allocationType, setAllocationType] = useState('Primary');
    const [workload, setWorkload] = useState([]);
    const [classAllocations, setClassAllocations] = useState([]);
    const [message, setMessage] = useState({ type: '', content: '' });
    const [tabValue, setTabValue] = useState(0);

    const adminID = currentUser._id;

    useEffect(() => {
        dispatch(getAllSclasses(adminID, "Sclass"));
        dispatch(getAllTeachers(adminID));
    }, [adminID, dispatch]);

    // Fetch subjects and allocations when Class is selected
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

            fetchClassAllocations(sclass);
        } else {
            setSubjects([]);
            setSelectedSubjects([]);
            setClassAllocations([]);
        }
    }, [sclass]);

    const fetchClassAllocations = (classId) => {
        axios.get(`${process.env.REACT_APP_BASE_URL}/ClassAllocations/${classId}`, {
            params: { schoolId: adminID, academicYear }
        })
            .then(response => {
                setClassAllocations(response.data);
            })
            .catch(error => {
                console.error("Error fetching class allocations:", error);
                setClassAllocations([]);
            });
    };

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

    const handleTabChange = (event, newValue) => {
        setTabValue(newValue);
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

            setMessage({ type: 'success', content: response.data.message });
            setSelectedSubjects([]);
            setIsClassIncharge(false);
            fetchWorkload(teacher); // Refresh workload
            fetchClassAllocations(sclass); // Refresh class allocations
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
        <Container maxWidth={false} sx={{ mt: 2, mb: 2 }}>
            <Typography variant="h4" gutterBottom sx={{ fontWeight: 'bold', color: 'var(--text-primary)', mb: 3 }}>
                Subject Allocation
            </Typography>

            <Grid container spacing={3}>
                {/* Top Control Bar: Selection Context */}
                <Grid item xs={12}>
                    <Paper elevation={1} sx={{ p: 2, borderRadius: 2, display: 'flex', gap: 2, alignItems: 'center', flexWrap: 'wrap' }}>
                        <FormControl size="small" sx={{ minWidth: 250 }}>
                            <InputLabel>Select Class (To Allocate)</InputLabel>
                            <Select
                                value={sclass}
                                label="Select Class (To Allocate)"
                                onChange={(e) => setSclass(e.target.value)}
                            >
                                {sclassesList && sclassesList.map((item) => (
                                    <MenuItem key={item._id} value={item._id}>
                                        {item.sclassName}
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                        <FormControl size="small" sx={{ minWidth: 250 }}>
                            <InputLabel>Select Teacher (To Assign)</InputLabel>
                            <Select
                                value={teacher}
                                label="Select Teacher (To Assign)"
                                onChange={(e) => setTeacher(e.target.value)}
                            >
                                {teachersList && teachersList.map((tea) => (
                                    <MenuItem key={tea._id} value={tea._id}>
                                        {tea.name} ({tea.employeeId || 'No ID'})
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                    </Paper>
                </Grid>

                {/* Left Column: Allocation Controls */}
                <Grid item xs={12} md={4}>
                    <Paper elevation={2} sx={{ p: 3, borderRadius: 2, height: '100%' }}>
                        <Typography variant="h6" gutterBottom sx={{ color: 'var(--text-primary)', mb: 2 }}>
                            Allocation Details
                        </Typography>

                        {message.content && <Alert severity={message.type} sx={{ mb: 2 }}>{message.content}</Alert>}

                        <form onSubmit={handleSubmit}>
                            {!sclass || !teacher ? (
                                <Box sx={{ p: 2, bgcolor: '#f5f5f5', borderRadius: 1, textAlign: 'center' }}>
                                    <Typography variant="body2" color="textSecondary">
                                        Please select both a <strong>Class</strong> and a <strong>Teacher</strong> from the top bar to proceed.
                                    </Typography>
                                </Box>
                            ) : (
                                <>
                                    <Box sx={{ mb: 2 }}>
                                        <Typography variant="subtitle2" gutterBottom color="textSecondary">Allocation Type</Typography>
                                        <RadioGroup
                                            row
                                            value={allocationType}
                                            onChange={(e) => setAllocationType(e.target.value)}
                                        >
                                            <FormControlLabel value="Primary" control={<Radio size="small" />} label="Primary" />
                                            <FormControlLabel value="Substitute" control={<Radio size="small" />} label="Substitute" />
                                        </RadioGroup>
                                    </Box>

                                    <Box sx={{ mb: 2 }}>
                                        <FormControlLabel
                                            control={
                                                <Switch
                                                    checked={isClassIncharge}
                                                    onChange={(e) => setIsClassIncharge(e.target.checked)}
                                                    color="primary"
                                                    size="small"
                                                />
                                            }
                                            label={<Typography variant="body2">Assign as Class In-charge</Typography>}
                                        />
                                    </Box>

                                    <Box sx={{ mb: 3 }}>
                                        <Typography variant="subtitle2" gutterBottom color="textSecondary">Subject Selection</Typography>
                                        {subjects.length > 0 ? (
                                            <Paper variant="outlined" sx={{ maxHeight: 250, overflowY: 'auto', p: 1 }}>
                                                <FormGroup>
                                                    {subjects.map((sub) => (
                                                        <FormControlLabel
                                                            key={sub._id}
                                                            control={
                                                                <Checkbox
                                                                    checked={selectedSubjects.includes(sub._id)}
                                                                    onChange={() => handleSubjectChange(sub._id)}
                                                                    size="small"
                                                                />
                                                            }
                                                            label={
                                                                <Typography variant="body2">
                                                                    {sub.subName} <Typography component="span" variant="caption" color="textSecondary">({sub.subCode})</Typography>
                                                                </Typography>
                                                            }
                                                            sx={{ mb: 0.5 }}
                                                        />
                                                    ))}
                                                </FormGroup>
                                            </Paper>
                                        ) : (
                                            <Typography variant="body2" color="textSecondary">No subjects found for this class.</Typography>
                                        )}
                                    </Box>

                                    <Button
                                        type="submit"
                                        variant="contained"
                                        fullWidth
                                        disabled={loading || selectedSubjects.length === 0}
                                        sx={{
                                            bgcolor: 'var(--color-primary-600)',
                                            '&:hover': { bgcolor: 'var(--color-primary-700)' }
                                        }}
                                    >
                                        {loading ? <CircularProgress size={24} color="inherit" /> : 'Allocate Subjects'}
                                    </Button>
                                </>
                            )}
                        </form>
                    </Paper>
                </Grid>

                {/* Right Column: Information Tabs */}
                <Grid item xs={12} md={8}>
                    <Paper elevation={2} sx={{ borderRadius: 2, height: '100%', overflow: 'hidden' }}>
                        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                            <Tabs value={tabValue} onChange={handleTabChange} aria-label="allocation tabs">
                                <Tab label="Class Status" />
                                <Tab label="Teacher Workload" />
                            </Tabs>
                        </Box>

                        {/* Tab Panel 1: Class Allocations */}
                        <Box role="tabpanel" hidden={tabValue !== 0} sx={{ p: 2 }}>
                            {tabValue === 0 && (
                                <>
                                    {!sclass ? (
                                        <Typography color="textSecondary" align="center" sx={{ mt: 4 }}>
                                            Select a class to view its allocation status.
                                        </Typography>
                                    ) : classAllocations.length === 0 ? (
                                        <Typography color="textSecondary" align="center" sx={{ mt: 4 }}>
                                            No allocations found for this class.
                                        </Typography>
                                    ) : (
                                        <TableContainer sx={{ maxHeight: 400 }}>
                                            <Table stickyHeader size="small">
                                                <TableHead>
                                                    <TableRow>
                                                        <TableCell>Subject</TableCell>
                                                        <TableCell>Teacher</TableCell>
                                                        <TableCell>Type</TableCell>
                                                        <TableCell align="right">Status</TableCell>
                                                    </TableRow>
                                                </TableHead>
                                                <TableBody>
                                                    {classAllocations.map((alloc) => (
                                                        <TableRow key={alloc.subjectId} hover>
                                                            <TableCell>
                                                                <Typography variant="body2">{alloc.subjectName}</Typography>
                                                                <Typography variant="caption" color="textSecondary">{alloc.subjectCode}</Typography>
                                                            </TableCell>
                                                            <TableCell>
                                                                {alloc.isAllocated ? (
                                                                    <Typography variant="body2" sx={{ fontWeight: 500 }}>
                                                                        {alloc.teacherName}
                                                                    </Typography>
                                                                ) : (
                                                                    <Typography variant="caption" color="error">
                                                                        Unassigned
                                                                    </Typography>
                                                                )}
                                                            </TableCell>
                                                            <TableCell>
                                                                {alloc.isAllocated && (
                                                                    <Box sx={{ display: 'flex', gap: 0.5, flexWrap: 'wrap' }}>
                                                                        <Chip
                                                                            label={alloc.type}
                                                                            size="small"
                                                                            color={alloc.type === 'Primary' ? 'success' : 'warning'}
                                                                            variant="outlined"
                                                                            sx={{ height: 20, fontSize: '0.7rem' }}
                                                                        />
                                                                        {alloc.isClassIncharge && (
                                                                            <Chip label="In-charge" size="small" color="info" sx={{ height: 20, fontSize: '0.7rem' }} />
                                                                        )}
                                                                    </Box>
                                                                )}
                                                            </TableCell>
                                                            <TableCell align="right">
                                                                {alloc.isAllocated ? (
                                                                    <Chip label="Done" size="small" color="success" variant="soft" sx={{ height: 20, fontSize: '0.7rem' }} />
                                                                ) : (
                                                                    <Chip label="Pending" size="small" color="error" variant="soft" sx={{ height: 20, fontSize: '0.7rem' }} />
                                                                )}
                                                            </TableCell>
                                                        </TableRow>
                                                    ))}
                                                </TableBody>
                                            </Table>
                                        </TableContainer>
                                    )}
                                </>
                            )}
                        </Box>

                        {/* Tab Panel 2: Teacher Workload */}
                        <Box role="tabpanel" hidden={tabValue !== 1} sx={{ p: 2 }}>
                            {tabValue === 1 && (
                                <>
                                    {!teacher ? (
                                        <Typography color="textSecondary" align="center" sx={{ mt: 4 }}>
                                            Select a teacher to view their workload.
                                        </Typography>
                                    ) : workload.length === 0 ? (
                                        <Typography color="textSecondary" align="center" sx={{ mt: 4 }}>
                                            No active allocations for this teacher.
                                        </Typography>
                                    ) : (
                                        <TableContainer sx={{ maxHeight: 400 }}>
                                            <Table stickyHeader size="small">
                                                <TableHead>
                                                    <TableRow>
                                                        <TableCell>Class</TableCell>
                                                        <TableCell>Subject</TableCell>
                                                        <TableCell>Role</TableCell>
                                                    </TableRow>
                                                </TableHead>
                                                <TableBody>
                                                    {workload.map((alloc) => (
                                                        <TableRow key={alloc._id} hover>
                                                            <TableCell>{alloc.classId?.sclassName || 'N/A'}</TableCell>
                                                            <TableCell>
                                                                <Typography variant="body2">{alloc.subjectId?.subName}</Typography>
                                                                <Typography variant="caption" color="textSecondary">{alloc.subjectId?.subCode}</Typography>
                                                            </TableCell>
                                                            <TableCell>
                                                                <Box sx={{ display: 'flex', gap: 0.5, flexWrap: 'wrap' }}>
                                                                    <Chip
                                                                        label={alloc.type}
                                                                        size="small"
                                                                        color={alloc.type === 'Primary' ? 'success' : 'warning'}
                                                                        variant="outlined"
                                                                        sx={{ height: 20, fontSize: '0.7rem' }}
                                                                    />
                                                                    {alloc.isClassIncharge && (
                                                                        <Chip label="In-charge" size="small" color="info" sx={{ height: 20, fontSize: '0.7rem' }} />
                                                                    )}
                                                                </Box>
                                                            </TableCell>
                                                        </TableRow>
                                                    ))}
                                                </TableBody>
                                            </Table>
                                        </TableContainer>
                                    )}
                                </>
                            )}
                        </Box>
                    </Paper>
                </Grid>
            </Grid>
        </Container>
    );
};

export default SubjectAllocation;
