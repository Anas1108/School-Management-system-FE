import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import {
    Box, Typography, CircularProgress, Container, IconButton, Tooltip, TextField, InputAdornment
} from '@mui/material';
import { NoAccounts, Delete as DeleteIcon, VisibilityOutlined as VisibilityOutlinedIcon, ArrowBack as ArrowBackIcon, Search as SearchIcon } from '@mui/icons-material';
import { ActionIconButtonError, ActionIconButtonPrimary } from '../../../components/buttonStyles';
import ConfirmationModal from '../../../components/ConfirmationModal';
import Popup from '../../../components/Popup';
import { deleteUser } from '../../../redux/userRelated/userHandle';
import TableTemplate from '../../../components/TableTemplate';

const RetiredStudents = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { currentUser } = useSelector(state => state.user);

    const [students, setStudents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(5);
    const [totalStudents, setTotalStudents] = useState(0);
    const [searchTerm, setSearchTerm] = useState("");
    const [submittedSearchTerm, setSubmittedSearchTerm] = useState("");

    // Modal States
    const [confirmOpen, setConfirmOpen] = useState(false);
    const [deleteTargetId, setDeleteTargetId] = useState(null);
    const [pendingDues, setPendingDues] = useState(0);
    const [isCheckingDues, setIsCheckingDues] = useState(false);

    const [showPopup, setShowPopup] = useState(false);
    const [message, setMessage] = useState('');
    const [severity, setSeverity] = useState('success');

    const fetchRetiredStudents = async () => {
        setLoading(true);
        try {
            const url = `${process.env.REACT_APP_BASE_URL}/Students/${currentUser._id}?status=Retired&page=${page + 1}&limit=${rowsPerPage}&search=${submittedSearchTerm}`;
            const res = await axios.get(url);

            if (res.data && res.data.students) {
                setStudents(res.data.students);
                setTotalStudents(res.data.total || 0);
            } else if (Array.isArray(res.data)) {
                // Fallback for non-paginated response, though should not happen if backend is correct
                setStudents(res.data);
                setTotalStudents(res.data.length);
            } else {
                setStudents([]);
                setTotalStudents(0);
            }
        } catch (err) {
            console.error(err);
            setStudents([]);
            setTotalStudents(0);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchRetiredStudents();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [currentUser._id, page, rowsPerPage, submittedSearchTerm]);

    const handleSingleDeleteClick = async (id) => {
        setDeleteTargetId(id);
        setIsCheckingDues(true);
        setPendingDues(0);

        try {
            const url = `${process.env.REACT_APP_BASE_URL}/FeeHistory/${id}`;
            const res = await axios.get(url);
            if (res.data && res.data.totalDue > 0) {
                setPendingDues(res.data.totalDue);
            }
        } catch (error) {
            console.error("Error checking dues:", error);
            // Non-blocking error, allow deletion but maybe show a generic warning
            // or we just default to 0 dues (which we did).
        } finally {
            setIsCheckingDues(false);
            setConfirmOpen(true);
        }
    };

    const handleCloseConfirm = () => {
        setConfirmOpen(false);
        setDeleteTargetId(null);
        setPendingDues(0);
    };

    const handleConfirmDelete = async () => {
        try {
            await dispatch(deleteUser(deleteTargetId, "Student"));
            setMessage("Retired Student Deleted Successfully");
            setSeverity('success');
            setShowPopup(true);

            // If deleting last item on page, go to previous page if it exists
            if (students.length === 1 && page > 0) {
                setPage(page - 1);
            } else {
                fetchRetiredStudents();
            }
        } catch (err) {
            console.error(err);
            setMessage("Error occurred while deleting");
            setSeverity('error');
            setShowPopup(true);
        } finally {
            handleCloseConfirm();
        }
    };

    const studentColumns = [
        { id: 'name', label: 'Name', minWidth: 170 },
        { id: 'rollNum', label: 'Roll Number', minWidth: 100 },
        { id: 'sclassName', label: 'Last Class', minWidth: 170 },
        { id: 'retirementDate', label: 'Retirement Date', minWidth: 170 },
    ];

    const studentRows = students.map((student) => {
        return {
            name: student.name,
            rollNum: student.rollNum,
            sclassName: student.sclassName?.sclassName || 'N/A',
            retirementDate: student.retirementDate ? new Date(student.retirementDate).toLocaleDateString() : 'N/A',
            id: student._id,
        };
    });

    const StudentButtonHaver = ({ row }) => {
        return (
            <>
                <Tooltip title="View Details" arrow>
                    <ActionIconButtonPrimary onClick={() => navigate(`/Admin/students/student/${row.id}`)}>
                        <VisibilityOutlinedIcon />
                    </ActionIconButtonPrimary>
                </Tooltip>
                <Tooltip title="Delete Permanently" arrow>
                    <Box component="span">
                        <ActionIconButtonError onClick={() => handleSingleDeleteClick(row.id)} disabled={isCheckingDues && deleteTargetId === row.id}>
                            {isCheckingDues && deleteTargetId === row.id ? <CircularProgress size={24} color="inherit" /> : <DeleteIcon />}
                        </ActionIconButtonError>
                    </Box>
                </Tooltip>
            </>
        );
    };

    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };

    const handleSearchSubmit = () => {
        setPage(0);
        setSubmittedSearchTerm(searchTerm);
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
                    <TextField
                        placeholder="Search retired students..."
                        variant="outlined"
                        size="small"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        onKeyDown={(e) => {
                            if (e.key === 'Enter') {
                                handleSearchSubmit();
                            }
                        }}
                        InputProps={{
                            endAdornment: (
                                <InputAdornment position="end">
                                    <IconButton onClick={handleSearchSubmit}>
                                        <SearchIcon />
                                    </IconButton>
                                </InputAdornment>
                            ),
                            style: {
                                borderRadius: 'var(--border-radius-md)',
                                backgroundColor: 'var(--bg-paper)',
                            }
                        }}
                        sx={{ width: { xs: '100%', sm: '260px' } }}
                    />
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
                </Box>
            </Box>

            {loading ? (
                <Box display="flex" justifyContent="center" sx={{ p: 4 }}>
                    <CircularProgress />
                </Box>
            ) : submittedSearchTerm && students.length === 0 ? (
                <Box sx={{ p: 4, textAlign: 'center', borderRadius: 'var(--border-radius-lg)', border: '1px solid var(--border-color)', background: 'var(--bg-paper)' }}>
                    <Typography variant="h6" color="text.secondary">
                        No retired students found matching "{submittedSearchTerm}"
                    </Typography>
                </Box>
            ) : (
                <Box sx={{
                    borderRadius: 'var(--border-radius-lg)',
                    overflow: 'hidden',
                    background: 'transparent',
                }}>
                    <TableTemplate
                        buttonHaver={StudentButtonHaver}
                        columns={studentColumns}
                        rows={studentRows}
                        count={totalStudents}
                        page={page}
                        rowsPerPage={rowsPerPage}
                        onPageChange={handleChangePage}
                        onRowsPerPageChange={handleChangeRowsPerPage}
                    />
                </Box>
            )}

            <ConfirmationModal
                open={confirmOpen}
                handleClose={handleCloseConfirm}
                handleConfirm={handleConfirmDelete}
                title={pendingDues > 0 ? "Warning: Pending Dues" : "Confirm Deletion"}
                message={
                    pendingDues > 0
                        ? `WARNING: This student has pending dues of PKR ${pendingDues}. Are you sure you want to permanently delete this retired student? This will also delete their invoices, family links, and exam records. This action cannot be undone.`
                        : "Are you sure you want to permanently delete this retired student? This will also delete their invoices, family links, and exam records. This action cannot be undone."
                }
                confirmLabel="Delete Permanently"
            />
            <Popup message={message} setShowPopup={setShowPopup} showPopup={showPopup} severity={severity} />
        </Container>
    );
};

export default RetiredStudents;

