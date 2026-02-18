import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from "react-router-dom";
import { getAllStudents } from '../../../redux/studentRelated/studentHandle';
import { removeStudent } from '../../../redux/studentRelated/studentSlice';
import { deleteUser } from '../../../redux/userRelated/userHandle';
import {
    Paper, Box, TextField, InputAdornment, Typography, Container, Tooltip, Button, IconButton
} from '@mui/material';

import { ActionIconButtonPrimary, ActionIconButtonError, ActionIconButtonSuccess, ActionIconButtonInfo } from '../../../components/buttonStyles';
import { GreenButton } from '../../../components/buttonStyles';
import TableTemplate from '../../../components/TableTemplate';
import SearchIcon from '@mui/icons-material/Search';
import VisibilityOutlinedIcon from '@mui/icons-material/VisibilityOutlined';
import EventAvailableOutlinedIcon from '@mui/icons-material/EventAvailableOutlined';
import GradeOutlinedIcon from '@mui/icons-material/GradeOutlined';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import EditIcon from '@mui/icons-material/Edit';
import AddIcon from '@mui/icons-material/Add';
import HistoryIcon from '@mui/icons-material/History';
import Popup from '../../../components/Popup';
import StudentFeeHistoryModal from '../../../components/StudentFeeHistoryModal';
import ConfirmationModal from '../../../components/ConfirmationModal';
import CustomLoader from '../../../components/CustomLoader';

const ShowStudents = () => {
    const navigate = useNavigate()
    const dispatch = useDispatch();
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(5);
    const { studentsList, loading, error, response, totalStudents } = useSelector((state) => state.student);
    const { currentUser } = useSelector(state => state.user)

    const [showPopup, setShowPopup] = useState(false);
    const [message, setMessage] = useState("");
    const [severity, setSeverity] = useState("success");
    const [searchTerm, setSearchTerm] = useState("");

    useEffect(() => {
        dispatch(getAllStudents(currentUser._id, page + 1, rowsPerPage, searchTerm));
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [currentUser._id, dispatch, page, rowsPerPage]); // Trigger fetch on pagination only. Search is manual.

    if (error) {
        console.log(error);
    }

    // Debounce search (optional optimization - for now simple state update)
    // Ideally use lodash debounce or setTimeout

    // Fee History Modal State
    const [historyOpen, setHistoryOpen] = useState(false);
    const [historyStudentId, setHistoryStudentId] = useState(null);

    // Confirmation Modal State
    const [confirmOpen, setConfirmOpen] = useState(false);
    const [deleteData, setDeleteData] = useState(null);

    const deleteHandler = (deleteID, address) => {
        setDeleteData({ deleteID, address });
        setConfirmOpen(true);
    }

    const confirmDeleteHandler = () => {
        if (deleteData) {
            const { deleteID, address } = deleteData;
            dispatch(deleteUser(deleteID, address))
                .then(() => {
                    dispatch(removeStudent(deleteID));
                    setMessage("Student Deleted Successfully");
                    setSeverity("success");
                    setShowPopup(true);
                    setConfirmOpen(false);
                    // Refresh data
                    dispatch(getAllStudents(currentUser._id, page + 1, rowsPerPage, searchTerm));
                })
        }
    }

    const studentColumns = [
        { id: 'name', label: 'Name', minWidth: 170 },
        { id: 'rollNum', label: 'Roll Number', minWidth: 100 },
        { id: 'sclassName', label: 'Class', minWidth: 170 },
    ]

    const studentRows = studentsList && studentsList.length > 0 && studentsList.map((student) => {
        return {
            name: student.name,
            rollNum: student.rollNum,
            sclassName: student.sclassName ? student.sclassName.sclassName : 'N/A', // Check if sclassName exists
            id: student._id,
        };
    })

    const StudentButtonHaver = ({ row }) => {
        return (
            <>
                <Tooltip title="Edit Student" arrow>
                    <ActionIconButtonPrimary
                        onClick={() => navigate("/Admin/students/student/edit/" + row.id)}>
                        <EditIcon />
                    </ActionIconButtonPrimary>
                </Tooltip>

                <Tooltip title="View" arrow>
                    <ActionIconButtonPrimary
                        onClick={() => navigate("/Admin/students/student/" + row.id)}>
                        <VisibilityOutlinedIcon />
                    </ActionIconButtonPrimary>
                </Tooltip>
                <Tooltip title="Take Attendance" arrow>
                    <ActionIconButtonSuccess
                        onClick={() => navigate("/Admin/students/student/attendance/" + row.id)}>
                        <EventAvailableOutlinedIcon />
                    </ActionIconButtonSuccess>
                </Tooltip>
                <Tooltip title="Provide Marks" arrow>
                    <ActionIconButtonInfo
                        onClick={() => navigate("/Admin/students/student/marks/" + row.id)}>
                        <GradeOutlinedIcon />
                    </ActionIconButtonInfo>
                </Tooltip>
                <Tooltip title="Fee History" arrow>
                    <ActionIconButtonPrimary
                        onClick={() => { setHistoryStudentId(row.id); setHistoryOpen(true); }}>
                        <HistoryIcon />
                    </ActionIconButtonPrimary>
                </Tooltip>
                <Tooltip title="Delete" arrow>
                    <ActionIconButtonError
                        onClick={() => deleteHandler(row.id, "Student")}>
                        <DeleteOutlineIcon />
                    </ActionIconButtonError>
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

    return (
        <Container maxWidth={false} sx={{ mt: 2, mb: 2 }}>
            {loading ?
                <CustomLoader />
                :
                <>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                        <Typography variant="h4" component="h1" sx={{ fontWeight: 'bold', color: 'var(--text-primary)' }}>
                            Students
                        </Typography>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                            <TextField
                                placeholder="Search students..."
                                variant="outlined"
                                size="small"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                onKeyDown={(e) => {
                                    if (e.key === 'Enter') {
                                        setPage(0);
                                        dispatch(getAllStudents(currentUser._id, 1, rowsPerPage, searchTerm));
                                    }
                                }}
                                InputProps={{
                                    endAdornment: (
                                        <InputAdornment position="end">
                                            <IconButton onClick={() => {
                                                setPage(0);
                                                dispatch(getAllStudents(currentUser._id, 1, rowsPerPage, searchTerm));
                                            }}>
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
                                onClick={() => navigate("/Admin/addstudents")}
                                sx={{
                                    textTransform: 'none', fontWeight: 600, fontFamily: 'var(--font-family-sans)',
                                    borderRadius: 'var(--border-radius-md)', backgroundColor: 'var(--color-primary-600)',
                                    boxShadow: 'none', px: 2.5, whiteSpace: 'nowrap',
                                    '&:hover': { backgroundColor: 'var(--color-primary-700)', boxShadow: '0 2px 8px rgba(0,0,0,0.15)' }
                                }}
                            >
                                Add Student
                            </Button>
                        </Box>
                    </Box>

                    {response ?
                        <Box sx={{ display: 'flex', justifyContent: 'center', marginTop: '16px' }}>
                            <GreenButton variant="contained" onClick={() => navigate("/Admin/addstudents")}>
                                Add Students
                            </GreenButton>
                        </Box>
                        :
                        <>
                            {Array.isArray(studentsList) && studentsList.length > 0 &&
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
                            }
                        </>
                    }
                </>
            }

            <Popup message={message} setShowPopup={setShowPopup} showPopup={showPopup} severity={severity} />
            <StudentFeeHistoryModal
                open={historyOpen}
                handleClose={() => setHistoryOpen(false)}
                studentId={historyStudentId}
            />
            <ConfirmationModal
                open={confirmOpen}
                handleClose={() => setConfirmOpen(false)}
                handleConfirm={confirmDeleteHandler}
                title="Delete Student?"
                message="Are you sure you want to delete this student? This action cannot be undone."
                confirmLabel="Delete"
            />
        </Container>
    );
};

export default ShowStudents;