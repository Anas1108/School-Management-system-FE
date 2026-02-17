import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { getAllTeachers } from '../../../redux/teacherRelated/teacherHandle';
import {
    Paper, Box, TextField, InputAdornment, Typography, Container, Tooltip, Button
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
import Popup from '../../../components/Popup';
import ConfirmationModal from '../../../components/ConfirmationModal';

const ShowTeachers = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { teachersList, loading, error, response } = useSelector((state) => state.teacher);
    const { currentUser } = useSelector((state) => state.user);

    useEffect(() => {
        dispatch(getAllTeachers(currentUser._id));
    }, [currentUser._id, dispatch]);

    const [showPopup, setShowPopup] = useState(false);
    const [message, setMessage] = useState("");
    const [searchTerm, setSearchTerm] = useState("");
    const [severity, setSeverity] = useState("success");

    // Confirmation Modal State
    const [confirmOpen, setConfirmOpen] = useState(false);
    const [deleteData, setDeleteData] = useState(null);

    if (loading) {
        return <div>Loading...</div>;
    } else if (response) {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'flex-end', marginTop: '16px' }}>
                <GreenButton variant="contained" onClick={() => navigate("/Admin/teachers/chooseclass")}>
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
                    dispatch(getAllTeachers(currentUser._id));
                    setMessage("Teacher Deleted Successfully");
                    setSeverity("success");
                    setShowPopup(true);
                    setConfirmOpen(false);
                })
        }
    };

    const teacherColumns = [
        { id: 'name', label: 'Name', minWidth: 170 },
        { id: 'teachSubject', label: 'Subject', minWidth: 100 },
        { id: 'teachSclass', label: 'Class', minWidth: 170 },
    ];

    const teacherRows = teachersList.map((teacher) => {
        return {
            name: teacher.name,
            teachSubject: teacher.teachSubject?.subName || null,
            teachSclass: teacher.teachSclass.sclassName,
            teachSclassID: teacher.teachSclass._id,
            id: teacher._id,
        };
    });

    const filteredRows = teacherRows.filter((row) => {
        return row.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            (row.teachSubject && row.teachSubject.toLowerCase().includes(searchTerm.toLowerCase()));
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
                        onChange={(e) => setSearchTerm(e.target.value)}
                        InputProps={{
                            startAdornment: (
                                <InputAdornment position="start">
                                    <SearchIcon />
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
                        onClick={() => navigate("/Admin/teachers/chooseclass")}
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
            <TableTemplate buttonHaver={TeacherButtonHaver} columns={teacherColumns} rows={filteredRows} />
            <Popup message={message} setShowPopup={setShowPopup} showPopup={showPopup} severity={severity} />
            <ConfirmationModal
                open={confirmOpen}
                handleClose={() => setConfirmOpen(false)}
                handleConfirm={confirmDeleteHandler}
                title="Delete Teacher?"
                message="Are you sure you want to delete this teacher? This action cannot be undone."
                confirmLabel="Delete"
            />
        </Container>
    );
};

export default ShowTeachers