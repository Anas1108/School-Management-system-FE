import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { getAllTeachers } from '../../../redux/teacherRelated/teacherHandle';
import { removeTeacherFromList } from '../../../redux/teacherRelated/teacherSlice';
import axios from 'axios';
import {
    Paper, Box, TextField, InputAdornment, Typography, Container, Tooltip, Button,
    Dialog, DialogTitle, DialogContent, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Chip, IconButton
} from '@mui/material';
import { deleteUser } from '../../../redux/userRelated/userHandle';
import { ActionIconButtonPrimary, ActionIconButtonError, GreenButton } from '../../../components/buttonStyles';
import TableTemplate from '../../../components/TableTemplate';
import PersonAddAlt1Icon from '@mui/icons-material/PersonAddAlt1';
import SearchIcon from '@mui/icons-material/Search';
import AddIcon from '@mui/icons-material/Add';
import VisibilityOutlinedIcon from '@mui/icons-material/VisibilityOutlined';
import EditIcon from '@mui/icons-material/Edit';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import AssignmentIndIcon from '@mui/icons-material/AssignmentInd';
import Popup from '../../../components/Popup';
import ConfirmationModal from '../../../components/ConfirmationModal';

const ShowTeachers = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { teachersList, loading, error, response, totalTeachers } = useSelector((state) => state.teacher);
    const { currentUser } = useSelector((state) => state.user);

    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(5);
    const [searchTerm, setSearchTerm] = useState("");
    const [query, setQuery] = useState("");

    useEffect(() => {
        dispatch(getAllTeachers(currentUser._id, page + 1, rowsPerPage, query));
    }, [currentUser._id, dispatch, page, rowsPerPage, query]);

    const handleSearch = () => {
        setQuery(searchTerm);
        setPage(0); // Reset to first page on new search
    };

    const handleKeyDown = (e) => {
        if (e.key === 'Enter') {
            handleSearch();
        }
    };

    const [showPopup, setShowPopup] = useState(false);
    const [message, setMessage] = useState("");
    const [severity, setSeverity] = useState("success");

    // Confirmation Modal State
    const [confirmOpen, setConfirmOpen] = useState(false);
    const [deleteData, setDeleteData] = useState(null);

    // Workload Modal State
    const [workloadOpen, setWorkloadOpen] = useState(false);
    const [currentWorkload, setCurrentWorkload] = useState([]);
    const [currentTeacherName, setCurrentTeacherName] = useState("");
    const [workloadLoading, setWorkloadLoading] = useState(false);

    if (loading) {
        return <div>Loading...</div>;
    } else if (response) {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'flex-end', marginTop: '16px' }}>
                <GreenButton variant="contained" onClick={() => navigate("/Admin/teachers/add")}>
                    Add Teacher
                </GreenButton>
            </Box>
        );
    } else if (error) {
        console.log(error);
    }

    const deleteHandler = (deleteID, address) => {
        setDeleteData({ deleteID, address });
        setConfirmOpen(true);
    };

    const confirmDeleteHandler = () => {
        if (deleteData) {
            const { deleteID, address } = deleteData;
            dispatch(deleteUser(deleteID, address))
                .then(() => {
                    dispatch(removeTeacherFromList(deleteID));
                    setMessage("Teacher Deleted Successfully");
                    setSeverity("success");
                    setShowPopup(true);
                    setConfirmOpen(false);
                    // Refresh the list after deletion
                    dispatch(getAllTeachers(currentUser._id, page + 1, rowsPerPage, query));
                })
        }
    };

    const handleWorkloadOpen = (teacherId, teacherName) => {
        setCurrentTeacherName(teacherName);
        setWorkloadLoading(true);
        setWorkloadOpen(true);

        axios.get(`${process.env.REACT_APP_BASE_URL}/TeacherWorkload/${teacherId}`)
            .then(response => {
                setCurrentWorkload(response.data);
                setWorkloadLoading(false);
            })
            .catch(error => {
                console.error("Error fetching workload:", error);
                setWorkloadLoading(false);
                setCurrentWorkload([]);
            });
    };

    const handleWorkloadClose = () => {
        setWorkloadOpen(false);
        setCurrentWorkload([]);
        setCurrentTeacherName("");
    };

    const teacherColumns = [
        { id: 'name', label: 'Name', minWidth: 170 },
        { id: 'employeeId', label: 'Emp ID', minWidth: 100 },
        { id: 'teachSclass', label: 'Class', minWidth: 10 },
        { id: 'department', label: 'Department', minWidth: 120 },
        { id: 'designation', label: 'Designation', minWidth: 120 },
    ];

    const teacherRows = teachersList.map((teacher) => {
        return {
            name: teacher.name,
            employeeId: teacher.employeeId || "N/A",
            teachSclass: teacher.teachSclass?.sclassName || "N/A",
            department: teacher.department?.departmentName || "N/A",
            designation: teacher.designation || "N/A",
            teachSclassID: teacher.teachSclass?._id || null,
            id: teacher._id,
        };
    });

    const TeacherButtonHaver = ({ row }) => {
        return (
            <>
                <Tooltip title="Edit" arrow>
                    <ActionIconButtonPrimary
                        onClick={() => navigate("/Admin/teachers/teacher/edit/" + row.id)}>
                        <EditIcon />
                    </ActionIconButtonPrimary>
                </Tooltip>
                <Tooltip title="View" arrow>
                    <ActionIconButtonPrimary
                        onClick={() => navigate("/Admin/teachers/teacher/" + row.id)}>
                        <VisibilityOutlinedIcon />
                    </ActionIconButtonPrimary>
                </Tooltip>
                <Tooltip title="Workload" arrow>
                    <IconButton onClick={() => handleWorkloadOpen(row.id, row.name)} color="secondary">
                        <AssignmentIndIcon />
                    </IconButton>
                </Tooltip>
                <Tooltip title="Delete" arrow>
                    <ActionIconButtonError
                        onClick={() => deleteHandler(row.id, "Teacher")}>
                        <DeleteOutlineIcon />
                    </ActionIconButtonError>
                </Tooltip>
            </>
        );
    };

    return (
        <Container maxWidth={false} sx={{ mt: 2, mb: 2 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                <Typography variant="h4" component="h1" sx={{ fontWeight: 'bold', color: 'var(--text-primary)' }}>
                    Teachers
                </Typography>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    <TextField
                        placeholder="Search teachers..."
                        variant="outlined"
                        size="small"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        onKeyDown={handleKeyDown}
                        InputProps={{
                            endAdornment: (
                                <InputAdornment position="end">
                                    <IconButton onClick={handleSearch} edge="end">
                                        <SearchIcon />
                                    </IconButton>
                                </InputAdornment>
                            ),
                            style: {
                                borderRadius: 'var(--border-radius-md)',
                                backgroundColor: 'var(--bg-paper)',
                            }
                        }}
                        sx={{ width: '260px' }}
                    />
                    <Button
                        variant="contained"
                        startIcon={<AddIcon />}
                        onClick={() => navigate("/Admin/teachers/add")}
                        sx={{
                            textTransform: 'none', fontWeight: 600, fontFamily: 'var(--font-family-sans)',
                            borderRadius: 'var(--border-radius-md)', backgroundColor: 'var(--color-primary-600)',
                            boxShadow: 'none', px: 2.5, whiteSpace: 'nowrap',
                            '&:hover': { backgroundColor: 'var(--color-primary-700)', boxShadow: '0 2px 8px rgba(0,0,0,0.15)' }
                        }}
                    >
                        Add Teacher
                    </Button>
                </Box>
            </Box>
            <TableTemplate
                buttonHaver={TeacherButtonHaver}
                columns={teacherColumns}
                rows={teacherRows}
                count={totalTeachers}
                page={page}
                rowsPerPage={rowsPerPage}
                onPageChange={(event, newPage) => setPage(newPage)}
                onRowsPerPageChange={(event) => {
                    setRowsPerPage(parseInt(event.target.value, 10));
                    setPage(0);
                }}
            />
            <Popup message={message} setShowPopup={setShowPopup} showPopup={showPopup} severity={severity} />
            <ConfirmationModal
                open={confirmOpen}
                handleClose={() => setConfirmOpen(false)}
                handleConfirm={confirmDeleteHandler}
                title="Delete Teacher?"
                message="Are you sure you want to delete this teacher? This action cannot be undone."
                confirmLabel="Delete"
            />

            {/* Workload Dialog */}
            <Dialog open={workloadOpen} onClose={handleWorkloadClose} fullWidth maxWidth="md">
                <DialogTitle>
                    Workload: {currentTeacherName}
                </DialogTitle>
                <DialogContent dividers>
                    {workloadLoading ? (
                        <Typography>Loading...</Typography>
                    ) : currentWorkload.length > 0 ? (
                        <TableContainer component={Paper} variant="outlined">
                            <Table size="small">
                                <TableHead>
                                    <TableRow sx={{ backgroundColor: 'var(--bg-light)' }}>
                                        <TableCell sx={{ fontWeight: 'bold' }}>Class</TableCell>
                                        <TableCell sx={{ fontWeight: 'bold' }}>Subject</TableCell>
                                        <TableCell sx={{ fontWeight: 'bold' }}>Role</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {currentWorkload.map((alloc) => (
                                        <TableRow key={alloc._id} hover>
                                            <TableCell>{alloc.classId?.sclassName || 'N/A'}</TableCell>
                                            <TableCell>
                                                <Typography variant="body2">{alloc.subjectId?.subName}</Typography>
                                                <Typography variant="caption" color="textSecondary">{alloc.subjectId?.subCode}</Typography>
                                            </TableCell>
                                            <TableCell>
                                                <Box sx={{ display: 'flex', gap: 0.5 }}>
                                                    <Chip
                                                        label={alloc.type}
                                                        size="small"
                                                        color={alloc.type === 'Primary' ? 'success' : 'warning'}
                                                        variant="outlined"
                                                    />
                                                    {alloc.isClassIncharge && (
                                                        <Chip label="In-charge" size="small" color="info" />
                                                    )}
                                                </Box>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </TableContainer>
                    ) : (
                        <Typography align="center" color="textSecondary" sx={{ py: 3 }}>
                            No subjects assigned to this teacher.
                        </Typography>
                    )}
                </DialogContent>
                <Box sx={{ p: 2, display: 'flex', justifyContent: 'flex-end' }}>
                    <Button onClick={handleWorkloadClose}>Close</Button>
                </Box>
            </Dialog>
        </Container>
    );
};

export default ShowTeachers