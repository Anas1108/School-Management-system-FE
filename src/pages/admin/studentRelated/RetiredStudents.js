import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import {
    Box, Typography, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, CircularProgress,
    Checkbox, IconButton, Tooltip, Alert, Container
} from '@mui/material';
import { NoAccounts, Delete as DeleteIcon, VisibilityOutlined as VisibilityOutlinedIcon, ArrowBack as ArrowBackIcon } from '@mui/icons-material';
import { ActionIconButtonError, ActionIconButtonPrimary } from '../../../components/buttonStyles';
import ConfirmationModal from '../../../components/ConfirmationModal';
import Popup from '../../../components/Popup';
import { deleteUser } from '../../../redux/userRelated/userHandle';

const RetiredStudents = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { currentUser } = useSelector(state => state.user);
    const [students, setStudents] = useState([]);
    const [loading, setLoading] = useState(true);

    const [selectedIds, setSelectedIds] = useState([]);

    // Modal States
    const [confirmOpen, setConfirmOpen] = useState(false);
    const [deleteType, setDeleteType] = useState(null); // 'single' or 'multi'
    const [deleteTargetId, setDeleteTargetId] = useState(null);

    const [showPopup, setShowPopup] = useState(false);
    const [message, setMessage] = useState('');
    const [severity, setSeverity] = useState('success');

    const fetchRetiredStudents = async () => {
        setLoading(true);
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

    useEffect(() => {
        fetchRetiredStudents();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [currentUser._id]);

    const handleSelectAll = (event) => {
        if (event.target.checked) {
            setSelectedIds(students.map((student) => student._id));
        } else {
            setSelectedIds([]);
        }
    };

    const handleSelectOne = (event, id) => {
        const selectedIndex = selectedIds.indexOf(id);
        let newSelected = [];

        if (selectedIndex === -1) {
            newSelected = newSelected.concat(selectedIds, id);
        } else if (selectedIndex === 0) {
            newSelected = newSelected.concat(selectedIds.slice(1));
        } else if (selectedIndex === selectedIds.length - 1) {
            newSelected = newSelected.concat(selectedIds.slice(0, -1));
        } else if (selectedIndex > 0) {
            newSelected = newSelected.concat(
                selectedIds.slice(0, selectedIndex),
                selectedIds.slice(selectedIndex + 1),
            );
        }
        setSelectedIds(newSelected);
    };

    const isSelected = (id) => selectedIds.includes(id);

    const handleSingleDeleteClick = (id) => {
        setDeleteTargetId(id);
        setDeleteType('single');
        setConfirmOpen(true);
    };

    const handleMultiDeleteClick = () => {
        setDeleteType('multi');
        setConfirmOpen(true);
    };

    const handleCloseConfirm = () => {
        setConfirmOpen(false);
        setDeleteTargetId(null);
        setDeleteType(null);
    };

    const handleConfirmDelete = async () => {
        try {
            if (deleteType === 'single') {
                await dispatch(deleteUser(deleteTargetId, "Student"));
                setMessage("Student Deleted Successfully");
            } else if (deleteType === 'multi') {
                // Bulk delete simulated by multiple single dispatch calls, matching Complain mechanism
                for (const id of selectedIds) {
                    await dispatch(deleteUser(id, "Student"));
                }
                setMessage(`${selectedIds.length} Students Deleted Successfully`);
                setSelectedIds([]);
            }
            setSeverity('success');
            setShowPopup(true);
        } catch (err) {
            console.error(err);
            setMessage("Error occurred while deleting");
            setSeverity('error');
            setShowPopup(true);
        } finally {
            fetchRetiredStudents();
            handleCloseConfirm();
        }
    };

    return (
        <Container maxWidth={false} sx={{ mt: 0, mb: 2 }}>
            <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, justifyContent: 'space-between', alignItems: { xs: 'stretch', md: 'center' }, mb: 2, gap: 2 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    <NoAccounts sx={{ fontSize: 32, color: 'var(--color-primary-600)' }} />
                    <Typography variant="h4" component="h1" sx={{ fontWeight: 'bold', color: 'var(--text-primary)' }}>
                        Retired Students
                    </Typography>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: { xs: 1, sm: 2 }, flexWrap: 'wrap' }}>
                    <Tooltip title="Back to Students">
                        <IconButton
                            onClick={() => navigate("/Admin/students")}
                            sx={{
                                border: '1px solid var(--border-color)',
                                borderRadius: 'var(--border-radius-md)',
                                '&:hover': { bgcolor: 'var(--bg-hover)' }
                            }}
                        >
                            <ArrowBackIcon />
                        </IconButton>
                    </Tooltip>
                    <Tooltip title="Delete Selected">
                        <span>
                            <IconButton
                                onClick={handleMultiDeleteClick}
                                disabled={selectedIds.length === 0}
                                color="error"
                                sx={{ border: '1px solid', borderColor: selectedIds.length > 0 ? 'error.main' : 'grey.300', borderRadius: 'var(--border-radius-md)' }}
                            >
                                <DeleteIcon />
                            </IconButton>
                        </span>
                    </Tooltip>
                </Box>
            </Box>
            <Box sx={{
                borderRadius: 'var(--border-radius-lg)',
                overflow: 'hidden',
                border: '1px solid var(--border-color)',
                background: 'var(--bg-paper)',
            }}>
                {loading ? (
                    <Box display="flex" justifyContent="center" sx={{ p: 4 }}>
                        <CircularProgress />
                    </Box>
                ) : students.length > 0 ? (
                    <TableContainer sx={{ maxHeight: '75vh', overflowX: 'auto' }}>
                        <Table>
                            <TableHead>
                                <TableRow sx={{ backgroundColor: 'primary.light' }}>
                                    <TableCell padding="checkbox">
                                        <Checkbox
                                            color="primary"
                                            indeterminate={selectedIds.length > 0 && selectedIds.length < students.length}
                                            checked={students.length > 0 && selectedIds.length === students.length}
                                            onChange={handleSelectAll}
                                        />
                                    </TableCell>
                                    <TableCell sx={{ fontWeight: 'bold' }}>Name</TableCell>
                                    <TableCell sx={{ fontWeight: 'bold' }}>Roll Number</TableCell>
                                    <TableCell sx={{ fontWeight: 'bold' }}>Last Class</TableCell>
                                    <TableCell sx={{ fontWeight: 'bold' }}>Retirement Date</TableCell>
                                    <TableCell sx={{ fontWeight: 'bold' }} align="center">Actions</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {students.map((student) => {
                                    const isItemSelected = isSelected(student._id);
                                    return (
                                        <TableRow
                                            key={student._id}
                                            hover
                                            role="checkbox"
                                            aria-checked={isItemSelected}
                                            selected={isItemSelected}
                                        >
                                            <TableCell padding="checkbox">
                                                <Checkbox
                                                    color="primary"
                                                    checked={isItemSelected}
                                                    onChange={(e) => handleSelectOne(e, student._id)}
                                                />
                                            </TableCell>
                                            <TableCell>{student.name}</TableCell>
                                            <TableCell>{student.rollNum}</TableCell>
                                            <TableCell>{student.sclassName?.sclassName || 'N/A'}</TableCell>
                                            <TableCell>{student.retirementDate ? new Date(student.retirementDate).toLocaleDateString() : 'N/A'}</TableCell>
                                            <TableCell align="center">
                                                <Box sx={{ display: 'flex', justifyContent: 'center', gap: 1 }}>
                                                    <Tooltip title="View Details" arrow>
                                                        <ActionIconButtonPrimary onClick={() => navigate(`/Admin/students/student/${student._id}`)}>
                                                            <VisibilityOutlinedIcon />
                                                        </ActionIconButtonPrimary>
                                                    </Tooltip>
                                                    <Tooltip title="Delete Permanently" arrow>
                                                        <ActionIconButtonError onClick={() => handleSingleDeleteClick(student._id)}>
                                                            <DeleteIcon />
                                                        </ActionIconButtonError>
                                                    </Tooltip>
                                                </Box>
                                            </TableCell>
                                        </TableRow>
                                    );
                                })}
                            </TableBody>
                        </Table>
                    </TableContainer>
                ) : (
                    <Box sx={{ p: 4, textAlign: 'center' }}>
                        <Typography variant="h6" color="textSecondary">No retired students found.</Typography>
                    </Box>
                )}
            </Box>

            <ConfirmationModal
                open={confirmOpen}
                handleClose={handleCloseConfirm}
                handleConfirm={handleConfirmDelete}
                title="Confirm Deletion"
                message={deleteType === 'multi'
                    ? `Are you sure you want to permanently delete ${selectedIds.length} retired student(s)? This will also delete their invoices, family links, and exam records. This action cannot be undone.`
                    : "Are you sure you want to permanently delete this retired student? This will also delete their invoices, family links, and exam records. This action cannot be undone."
                }
                confirmLabel="Delete Permanently"
            />
            <Popup message={message} setShowPopup={setShowPopup} showPopup={showPopup} severity={severity} />
        </Container>
    );
};

export default RetiredStudents;
