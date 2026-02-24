import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from "react-router-dom";
import { getSubjectList } from '../../../redux/sclassRelated/sclassHandle';
import { deleteUser } from '../../../redux/userRelated/userHandle';

import {
    Box, Container, Typography, TextField, InputAdornment, Tooltip, IconButton,
    Dialog, DialogTitle, DialogContent, DialogActions, Button
} from '@mui/material';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import VisibilityOutlinedIcon from '@mui/icons-material/VisibilityOutlined';
import SearchIcon from '@mui/icons-material/Search';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import TableTemplate from '../../../components/TableTemplate';
import { GreenButton, ActionIconButtonPrimary, ActionIconButtonError, ActionIconButtonSuccess } from '../../../components/buttonStyles';
import Popup from '../../../components/Popup';
import CustomLoader from '../../../components/CustomLoader';

const ShowSubjects = () => {
    const navigate = useNavigate()
    const dispatch = useDispatch();
    const { subjectsList, loading, error, response } = useSelector((state) => state.sclass);
    const { currentUser } = useSelector(state => state.user)

    const [searchTerm, setSearchTerm] = useState("");

    useEffect(() => {
        dispatch(getSubjectList(currentUser._id, "AllSubjects"));
    }, [currentUser._id, dispatch]);

    if (error) {
        console.log(error);
    }

    const [showPopup, setShowPopup] = useState(false);
    const [message, setMessage] = useState("");
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [subjectToDelete, setSubjectToDelete] = useState(null);
    const [actionLoading, setActionLoading] = useState(false);

    const deleteHandler = (deleteID, address) => {
        setSubjectToDelete({ id: deleteID, address });
        setDeleteDialogOpen(true);
    };

    const confirmDelete = () => {
        if (!subjectToDelete) return;
        setActionLoading(true);
        dispatch(deleteUser(subjectToDelete.id, subjectToDelete.address))
            .then(() => {
                dispatch(getSubjectList(currentUser._id, "AllSubjects"));
                setActionLoading(false);
                setDeleteDialogOpen(false);
                setSubjectToDelete(null);
            })
            .catch(() => {
                setActionLoading(false);
                setDeleteDialogOpen(false);
            });
    }

    const subjectColumns = [
        { id: 'subName', label: 'Sub Name', minWidth: 170 },
        { id: 'sessions', label: 'Sessions', minWidth: 170 },
        { id: 'sclassName', label: 'Class', minWidth: 170 },
    ]

    const subjectRows = subjectsList.map((subject) => {
        return {
            subName: subject.subName,
            sessions: subject.sessions,
            sclassName: subject.sclassName.sclassName,
            sclassID: subject.sclassName._id,
            id: subject._id,
        };
    })

    const filteredRows = subjectRows.filter((row) => {
        return row.subName.toLowerCase().includes(searchTerm.toLowerCase()) ||
            row.sclassName.toLowerCase().includes(searchTerm.toLowerCase());
    });

    const SubjectsButtonHaver = ({ row }) => {
        return (
            <>
                <Tooltip title="View" arrow>
                    <ActionIconButtonPrimary
                        onClick={() => navigate(`/Admin/subjects/subject/${row.sclassID}/${row.id}`)}>
                        <VisibilityOutlinedIcon />
                    </ActionIconButtonPrimary>
                </Tooltip>
                <Tooltip title="Edit" arrow>
                    <ActionIconButtonSuccess
                        onClick={() => navigate(`/Admin/subjects/edit/${row.id}`)}>
                        <EditIcon />
                    </ActionIconButtonSuccess>
                </Tooltip>
                <Tooltip title="Delete" arrow>
                    <ActionIconButtonError
                        onClick={() => deleteHandler(row.id, "Subject")}>
                        <DeleteOutlineIcon />
                    </ActionIconButtonError>
                </Tooltip>
            </>
        );
    };


    return (
        <Container maxWidth={false} sx={{ mt: 0, mb: 2 }}>
            <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, justifyContent: 'space-between', alignItems: { xs: 'stretch', md: 'center' }, mb: 1, gap: 2 }}>
                <Typography variant="h4" component="h1" sx={{ fontWeight: 'bold', color: 'var(--text-primary)' }}>
                    Subjects
                </Typography>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    <TextField
                        placeholder="Search subjects..."
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
                    <Tooltip title="Add Subject">
                        <IconButton
                            onClick={() => navigate("/Admin/subjects/chooseclass")}
                            sx={{
                                bgcolor: 'var(--color-primary-600)', color: 'white',
                                '&:hover': { bgcolor: 'var(--color-primary-700)' },
                                borderRadius: 'var(--border-radius-md)'
                            }}
                        >
                            <AddIcon />
                        </IconButton>
                    </Tooltip>
                </Box>
            </Box>
            {loading ?
                <CustomLoader />
                :
                <>
                    {response ?
                        <Box sx={{ display: 'flex', justifyContent: 'flex-end', marginTop: '16px' }}>
                            <GreenButton variant="contained"
                                onClick={() => navigate("/Admin/subjects/chooseclass")}>
                                Add Subjects
                            </GreenButton>
                        </Box>
                        :
                        <>
                            {Array.isArray(filteredRows) && filteredRows.length > 0 &&
                                <TableTemplate buttonHaver={SubjectsButtonHaver} columns={subjectColumns} rows={filteredRows} />
                            }
                        </>
                    }
                </>
            }
            <Popup message={message} setShowPopup={setShowPopup} showPopup={showPopup} />

            <Dialog open={deleteDialogOpen} onClose={() => setDeleteDialogOpen(false)}>
                <DialogTitle>Confirm Deletion</DialogTitle>
                <DialogContent>
                    <Typography>
                        Are you sure you want to delete this subject? This action cannot be undone.
                    </Typography>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setDeleteDialogOpen(false)} disabled={actionLoading}>Cancel</Button>
                    <Button onClick={confirmDelete} color="error" variant="contained" disabled={actionLoading}>
                        {actionLoading ? "Deleting..." : "Delete"}
                    </Button>
                </DialogActions>
            </Dialog>
        </Container>
    );
};

export default ShowSubjects;