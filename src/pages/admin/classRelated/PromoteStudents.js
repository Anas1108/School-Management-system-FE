import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
    Box,
    Paper,
    Typography,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    Button,
    Checkbox,
    FormControlLabel,
    CircularProgress,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Stack,
    Switch,
    Alert,
    Divider,
    TextField,
    Chip,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogContentText,
    DialogActions
} from '@mui/material';
import { getAllSclasses, getClassStudents } from '../../../redux/sclassRelated/sclassHandle';
import { promoteStudentsAPI } from '../../../redux/studentRelated/studentHandle';
import { underStudentControl } from '../../../redux/studentRelated/studentSlice';
import { underControl as sclassUnderControl } from '../../../redux/sclassRelated/sclassSlice';
import Popup from '../../../components/Popup';
import CustomLoader from '../../../components/CustomLoader';
import { TrendingUp, CompareArrows } from '@mui/icons-material';

const PromoteStudents = () => {
    const dispatch = useDispatch();

    const { currentUser } = useSelector(state => state.user);
    const adminID = currentUser._id;

    const { sclassesList, sclassStudents, loading: classLoading } = useSelector(state => state.sclass);
    const { loading: studentLoading, statestatus, response, error } = useSelector(state => state.student);

    const [fromClass, setFromClass] = useState('');
    const [toClass, setToClass] = useState('');
    const [clearRecords, setClearRecords] = useState(true);
    const [targetSessionYear, setTargetSessionYear] = useState(`${new Date().getFullYear()}-${new Date().getFullYear() + 1}`);
    const [selectedStudents, setSelectedStudents] = useState([]);
    const [openConfirm, setOpenConfirm] = useState(false);

    const [showPopup, setShowPopup] = useState(false);
    const [message, setMessage] = useState('');

    useEffect(() => {
        dispatch(getAllSclasses(adminID, "Sclass"));
        // eslint-disable-next-line
    }, [adminID, dispatch]);

    useEffect(() => {
        if (fromClass) {
            dispatch(getClassStudents(fromClass));
        }
    }, [fromClass, dispatch]);

    useEffect(() => {
        if (sclassStudents && sclassStudents.length > 0) {
            setSelectedStudents(
                sclassStudents
                    .filter(student => student.sessionYear !== targetSessionYear)
                    .map(student => student._id)
            );
        } else {
            setSelectedStudents([]);
        }
    }, [sclassStudents, targetSessionYear]);

    useEffect(() => {
        if (statestatus === "added") {
            setShowPopup(true);
            setMessage("Students promoted successfully!");
            dispatch(underStudentControl());
            // Reset state
            setFromClass('');
            setToClass('');
            setSelectedStudents([]);
        } else if (response) {
            setShowPopup(true);
            setMessage(response);
            dispatch(underStudentControl());
        } else if (error) {
            setShowPopup(true);
            setMessage(error.message || "An error occurred");
            dispatch(underStudentControl());
        }
    }, [statestatus, response, error, dispatch]);

    const handleFromClassChange = (event) => {
        setFromClass(event.target.value);
    };

    const handleToClassChange = (event) => {
        setToClass(event.target.value);
    };

    const handleSelectAll = (event) => {
        if (event.target.checked) {
            setSelectedStudents(sclassStudents.map(student => student._id));
        } else {
            setSelectedStudents([]);
        }
    };

    const handleSelectStudent = (id) => {
        setSelectedStudents(prev => {
            if (prev.includes(id)) {
                return prev.filter(studentId => studentId !== id);
            } else {
                return [...prev, id];
            }
        });
    };

    const submitHandler = (event) => {
        event.preventDefault();
        if (selectedStudents.length === 0) {
            setShowPopup(true);
            setMessage("Please select at least one student to promote.");
            return;
        }
        if (fromClass === toClass) {
            setShowPopup(true);
            setMessage("Source and Target class cannot be the same.");
            return;
        }
        setOpenConfirm(true);
    };

    const handleConfirmPromote = () => {
        setOpenConfirm(false);
        dispatch(promoteStudentsAPI(selectedStudents, toClass, clearRecords, targetSessionYear));
    };

    const handleCloseConfirm = () => {
        setOpenConfirm(false);
    };

    return (
        <Box sx={{ p: 4 }}>
            <Box sx={{ mb: 4, display: 'flex', alignItems: 'center', gap: 2 }}>
                <TrendingUp color="primary" sx={{ fontSize: 40 }} />
                <Typography variant="h4" fontWeight="600" color="primary.main">
                    Promote Students
                </Typography>
            </Box>
            <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
                Select a class to promote students from, choose the target class, and decide whether to reset their academic records (exams and attendance) for the new session.
            </Typography>

            <Paper elevation={3} sx={{ p: 4, borderRadius: 3, mb: 4 }}>
                <form onSubmit={submitHandler}>
                    <Stack direction={{ xs: 'column', md: 'row' }} spacing={4} alignItems="center" sx={{ mb: 4 }}>
                        <TextField
                            fullWidth
                            label="Target Academic Session"
                            value={targetSessionYear}
                            onChange={(e) => setTargetSessionYear(e.target.value)}
                            helperText="Year tag for promoted students (e.g. 2024-2025)"
                            required
                        />
                    </Stack>

                    <Stack direction={{ xs: 'column', md: 'row' }} spacing={4} alignItems="center" sx={{ mb: 4 }}>
                        <FormControl fullWidth>
                            <InputLabel id="from-class-label">From Class</InputLabel>
                            <Select
                                labelId="from-class-label"
                                value={fromClass}
                                label="From Class"
                                onChange={handleFromClassChange}
                                required
                            >
                                {sclassesList && sclassesList.map((sclass) => (
                                    <MenuItem key={sclass._id} value={sclass._id}>
                                        {sclass.sclassName}
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>

                        <CompareArrows color="action" sx={{ display: { xs: 'none', md: 'block' }, fontSize: 40 }} />

                        <FormControl fullWidth>
                            <InputLabel id="to-class-label">To Class</InputLabel>
                            <Select
                                labelId="to-class-label"
                                value={toClass}
                                label="To Class"
                                onChange={handleToClassChange}
                                required
                            >
                                {sclassesList && sclassesList.map((sclass) => (
                                    <MenuItem key={sclass._id} value={sclass._id}>
                                        {sclass.sclassName}
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                    </Stack>

                    <Divider sx={{ mb: 3 }} />

                    <Box sx={{ mb: 3 }}>
                        <FormControlLabel
                            control={
                                <Switch
                                    checked={clearRecords}
                                    onChange={(e) => setClearRecords(e.target.checked)}
                                    color="primary"
                                />
                            }
                            label={
                                <Box>
                                    <Typography variant="subtitle1" fontWeight="500">
                                        Clear Academic Records Next Session
                                    </Typography>
                                    <Typography variant="body2" color="text.secondary">
                                        Checking this will erase the students' previous Exam Results and Attendance. Fees will remain intact.
                                    </Typography>
                                </Box>
                            }
                        />
                    </Box>

                    {fromClass && (
                        <Box sx={{ mt: 4 }}>
                            <Typography variant="h6" sx={{ mb: 2 }}>
                                Select Students to Promote ({sclassStudents ? sclassStudents.length : 0})
                            </Typography>
                            {classLoading ? (
                                <CustomLoader />
                            ) : sclassStudents && sclassStudents.length > 0 ? (
                                <TableContainer component={Paper} elevation={1} sx={{ borderRadius: 2, border: '1px solid #e0e0e0', maxHeight: 400 }}>
                                    <Table stickyHeader size="small">
                                        <TableHead>
                                            <TableRow sx={{ backgroundColor: 'primary.light' }}>
                                                <TableCell padding="checkbox">
                                                    <Checkbox
                                                        color="primary"
                                                        indeterminate={selectedStudents.length > 0 && selectedStudents.length < sclassStudents.length}
                                                        checked={sclassStudents.length > 0 && selectedStudents.length === sclassStudents.length}
                                                        onChange={handleSelectAll}
                                                    />
                                                </TableCell>
                                                <TableCell sx={{ fontWeight: 'bold' }}>Name</TableCell>
                                                <TableCell sx={{ fontWeight: 'bold' }}>Roll Number</TableCell>
                                            </TableRow>
                                        </TableHead>
                                        <TableBody>
                                            {sclassStudents.map((student) => {
                                                const isAlreadyPromoted = student.sessionYear === targetSessionYear;
                                                const isItemSelected = selectedStudents.includes(student._id);
                                                return (
                                                    <TableRow
                                                        hover
                                                        onClick={() => !isAlreadyPromoted && handleSelectStudent(student._id)}
                                                        role="checkbox"
                                                        aria-checked={isItemSelected}
                                                        tabIndex={-1}
                                                        key={student._id}
                                                        selected={isItemSelected}
                                                        sx={{ cursor: isAlreadyPromoted ? 'not-allowed' : 'pointer', opacity: isAlreadyPromoted ? 0.6 : 1 }}
                                                    >
                                                        <TableCell padding="checkbox">
                                                            <Checkbox
                                                                color="primary"
                                                                checked={isItemSelected}
                                                                disabled={isAlreadyPromoted}
                                                            />
                                                        </TableCell>
                                                        <TableCell>
                                                            {student.name}
                                                            {isAlreadyPromoted && (
                                                                <Chip
                                                                    label={`Already in ${targetSessionYear}`}
                                                                    size="small"
                                                                    color="warning"
                                                                    sx={{ ml: 2, height: 20, fontSize: '0.7rem' }}
                                                                />
                                                            )}
                                                        </TableCell>
                                                        <TableCell>{student.rollNum}</TableCell>
                                                    </TableRow>
                                                );
                                            })}
                                        </TableBody>
                                    </Table>
                                </TableContainer>
                            ) : (
                                <Alert severity="info" sx={{ mt: 2 }}>
                                    No students found in this class.
                                </Alert>
                            )}
                        </Box>
                    )}

                    <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 4 }}>
                        <Button
                            variant="contained"
                            color="primary"
                            type="submit"
                            disabled={studentLoading || !fromClass || !toClass || (sclassStudents && sclassStudents.length === 0)}
                            sx={{ minWidth: 200, py: 1.5, borderRadius: 2, fontWeight: 'bold' }}
                            startIcon={<TrendingUp />}
                        >
                            {studentLoading ? <CircularProgress size={24} color="inherit" /> : 'Promote Selected Students'}
                        </Button>
                    </Box>
                </form>
            </Paper>

            <Popup message={message} setShowPopup={setShowPopup} showPopup={showPopup} />

            <Dialog
                open={openConfirm}
                onClose={handleCloseConfirm}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
            >
                <DialogTitle id="alert-dialog-title">
                    {"Confirm Promotion"}
                </DialogTitle>
                <DialogContent>
                    <DialogContentText id="alert-dialog-description">
                        Are you sure you want to promote {selectedStudents.length} student(s)?
                        {clearRecords && " Their previous session's exams and attendance records will be cleared."}
                        This action cannot be undone.
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseConfirm} color="primary">
                        Cancel
                    </Button>
                    <Button onClick={handleConfirmPromote} color="error" autoFocus variant="contained">
                        Confirm Promote
                    </Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
};

export default PromoteStudents;
