import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from "react-router-dom";
import {
    Box, Tooltip, IconButton, Container, Typography, TextField, InputAdornment,
    Dialog, DialogTitle, DialogContent, DialogActions, Button
} from '@mui/material';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import VisibilityOutlinedIcon from '@mui/icons-material/VisibilityOutlined';
import EditIcon from '@mui/icons-material/Edit';
import SearchIcon from '@mui/icons-material/Search';
import AddIcon from '@mui/icons-material/Add';
import { getAllNotices } from '../../../redux/noticeRelated/noticeHandle';
import { deleteUser } from '../../../redux/userRelated/userHandle';
import TableTemplate from '../../../components/TableTemplate';
import { ActionIconButtonError, ActionIconButtonPrimary, ActionIconButtonSuccess } from '../../../components/buttonStyles';
import CustomLoader from '../../../components/CustomLoader';

const ShowNotices = () => {

    const navigate = useNavigate()
    const dispatch = useDispatch();
    const { noticesList, loading, error, response } = useSelector((state) => state.notice);
    const { currentUser } = useSelector(state => state.user)

    const [searchTerm, setSearchTerm] = useState("");

    useEffect(() => {
        dispatch(getAllNotices(currentUser._id, "Notice"));
    }, [currentUser._id, dispatch]);

    if (error) {
        console.log(error);
    }

    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [noticeToDelete, setNoticeToDelete] = useState(null);
    const [actionLoading, setActionLoading] = useState(false);

    const deleteHandler = (deleteID, address) => {
        setNoticeToDelete({ id: deleteID, address });
        setDeleteDialogOpen(true);
    };

    const confirmDelete = () => {
        if (!noticeToDelete) return;
        setActionLoading(true);
        dispatch(deleteUser(noticeToDelete.id, noticeToDelete.address))
            .then(() => {
                dispatch(getAllNotices(currentUser._id, "Notice"));
                setActionLoading(false);
                setDeleteDialogOpen(false);
                setNoticeToDelete(null);
            })
            .catch(() => {
                setActionLoading(false);
                setDeleteDialogOpen(false);
            });
    }

    const noticeColumns = [
        { id: 'title', label: 'Title', minWidth: 170 },
        { id: 'details', label: 'Details', minWidth: 100 },
        { id: 'date', label: 'Date', minWidth: 170 },
    ];

    const noticeRows = noticesList && noticesList.length > 0 ? noticesList.map((notice) => {
        const date = new Date(notice.date);
        const dateString = date.toString() !== "Invalid Date" ? date.toISOString().substring(0, 10) : "N/A";
        return {
            title: notice.title,
            details: notice.details,
            date: dateString,
            id: notice._id,
        };
    }) : [];

    const filteredRows = noticeRows.filter((row) => {
        return row.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
            row.details.toLowerCase().includes(searchTerm.toLowerCase());
    });

    const NoticeButtonHaver = ({ row }) => {
        return (
            <>
                <Tooltip title="View" arrow>
                    <ActionIconButtonPrimary
                        onClick={() => navigate(`/Admin/notices/notice/${row.id}`)}>
                        <VisibilityOutlinedIcon />
                    </ActionIconButtonPrimary>
                </Tooltip>
                <Tooltip title="Edit" arrow>
                    <ActionIconButtonSuccess
                        onClick={() => navigate(`/Admin/notices/edit/${row.id}`)}>
                        <EditIcon />
                    </ActionIconButtonSuccess>
                </Tooltip>
                <Tooltip title="Delete" arrow>
                    <ActionIconButtonError
                        onClick={() => deleteHandler(row.id, "Notice")}>
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
                    Notices
                </Typography>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    <TextField
                        placeholder="Search notices..."
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
                    <Tooltip title="Add Notice">
                        <IconButton
                            onClick={() => navigate("/Admin/addnotice")}
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
                            {/* Empty state component could go here */}
                        </Box>
                        :
                        <>
                            {Array.isArray(filteredRows) && filteredRows.length > 0 &&
                                <TableTemplate buttonHaver={NoticeButtonHaver} columns={noticeColumns} rows={filteredRows} />
                            }
                        </>
                    }
                </>
            }
            <Dialog open={deleteDialogOpen} onClose={() => setDeleteDialogOpen(false)}>
                <DialogTitle>Confirm Deletion</DialogTitle>
                <DialogContent>
                    <Typography>
                        Are you sure you want to delete this notice? This action cannot be undone.
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

export default ShowNotices;