import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from "react-router-dom";
import { getSubjectList } from '../../../redux/sclassRelated/sclassHandle';
import { deleteUser } from '../../../redux/userRelated/userHandle';
import PostAddIcon from '@mui/icons-material/PostAdd';
import {
    Paper, Box, Container, Typography, TextField, InputAdornment, Tooltip, Button
} from '@mui/material';
import DeleteIcon from "@mui/icons-material/Delete";
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import VisibilityOutlinedIcon from '@mui/icons-material/VisibilityOutlined';
import SearchIcon from '@mui/icons-material/Search';
import AddIcon from '@mui/icons-material/Add';
import TableTemplate from '../../../components/TableTemplate';
import { GreenButton, ActionIconButtonPrimary, ActionIconButtonError } from '../../../components/buttonStyles';
import Popup from '../../../components/Popup';

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

    const deleteHandler = (deleteID, address) => {
        console.log(deleteID);
        console.log(address);
        setMessage("Sorry the delete function has been disabled for now.")
        setShowPopup(true)

        // dispatch(deleteUser(deleteID, address))
        //     .then(() => {
        //         dispatch(getSubjectList(currentUser._id, "AllSubjects"));
        //     })
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
        <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
            {loading ?
                <div>Loading...</div>
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
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
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
                                    <Button
                                        variant="contained"
                                        startIcon={<AddIcon />}
                                        onClick={() => navigate("/Admin/subjects/chooseclass")}
                                        sx={{
                                            textTransform: 'none', fontWeight: 600, fontFamily: 'var(--font-family-sans)',
                                            borderRadius: 'var(--border-radius-md)', backgroundColor: 'var(--color-primary-600)',
                                            boxShadow: 'none', px: 2.5, whiteSpace: 'nowrap',
                                            '&:hover': { backgroundColor: 'var(--color-primary-700)', boxShadow: '0 2px 8px rgba(0,0,0,0.15)' }
                                        }}
                                    >
                                        Add Subject
                                    </Button>
                                </Box>
                            </Box>
                            <Paper sx={{ borderRadius: 'var(--border-radius-lg)', border: '1px solid var(--border-color)', boxShadow: 'var(--shadow-sm)' }}>
                                {Array.isArray(filteredRows) && filteredRows.length > 0 &&
                                    <TableTemplate buttonHaver={SubjectsButtonHaver} columns={subjectColumns} rows={filteredRows} />
                                }
                            </Paper>
                        </>
                    }
                </>
            }
            <Popup message={message} setShowPopup={setShowPopup} showPopup={showPopup} />

        </Container>
    );
};

export default ShowSubjects;