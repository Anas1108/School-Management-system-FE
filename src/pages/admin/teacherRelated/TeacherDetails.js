import React, { useEffect, useState } from 'react';
import { getTeacherDetails } from '../../../redux/teacherRelated/teacherHandle';
import { deleteUser } from '../../../redux/userRelated/userHandle';
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { Button, Container, Typography, Box, Paper, Avatar, Grid } from '@mui/material';
import styled from 'styled-components';
import ConfirmationModal from '../../../components/ConfirmationModal';
import Popup from '../../../components/Popup';

const TeacherDetails = () => {
    const navigate = useNavigate();
    const params = useParams();
    const dispatch = useDispatch();
    const { loading, teacherDetails } = useSelector((state) => state.teacher);
    const { error } = useSelector((state) => state.user);

    const teacherID = params.id;

    useEffect(() => {
        dispatch(getTeacherDetails(teacherID));
    }, [dispatch, teacherID]);

    const [showPopup, setShowPopup] = useState(false);
    const [message, setMessage] = useState("");
    const [severity, setSeverity] = useState("success");

    // Confirmation Modal State
    const [confirmOpen, setConfirmOpen] = useState(false);

    const isSubjectNamePresent = teacherDetails?.teachSubject?.subName;

    const handleAddSubject = () => {
        navigate(`/Admin/teachers/choosesubject/${teacherDetails?.teachSclass?._id}/${teacherDetails?._id}`);
    };

    const deleteHandler = () => {
        setConfirmOpen(true);
    }

    const confirmDeleteHandler = () => {
        dispatch(deleteUser(teacherID, "Teacher"))
            .then(() => {
                setMessage("Teacher Deleted Successfully");
                setSeverity("success");
                setShowPopup(true);
                setConfirmOpen(false);
                setTimeout(() => {
                    navigate("/Admin/teachers");
                }, 1500);
            })
    }

    return (
        <Container maxWidth="md" sx={{ mt: 4, mb: 4 }}>
            {loading ? (
                <div>Loading...</div>
            ) : (
                <ProfileCard elevation={3}>
                    <Grid container spacing={3} alignItems="center" justifyContent="center">
                        <Grid item xs={12} sm={4} sx={{ display: 'flex', justifyContent: 'center' }}>
                            <Avatar sx={{ width: 140, height: 140, fontSize: '3.5rem', bgcolor: 'var(--color-primary-600)' }}>
                                {teacherDetails?.name?.charAt(0)}
                            </Avatar>
                        </Grid>
                        <Grid item xs={12} sm={8}>
                            <Typography variant="h4" component="h1" gutterBottom sx={{ fontWeight: 'bold' }}>
                                {teacherDetails?.name}
                            </Typography>
                            <Typography variant="h6" color="textSecondary" gutterBottom>
                                Class: {teacherDetails?.teachSclass?.sclassName}
                            </Typography>

                            {isSubjectNamePresent ? (
                                <Box sx={{ mt: 2, p: 2, bgcolor: 'var(--bg-default)', borderRadius: 'var(--border-radius-md)' }}>
                                    <Typography variant="subtitle1" sx={{ color: 'var(--text-secondary)' }}>
                                        Assigned Subject:
                                    </Typography>
                                    <Typography variant="h6" sx={{ color: 'var(--color-primary-700)', fontWeight: 'bold' }}>
                                        {teacherDetails?.teachSubject?.subName}
                                    </Typography>
                                    <Typography variant="body2" sx={{ color: 'var(--text-tertiary)' }}>
                                        Sessions: {teacherDetails?.teachSubject?.sessions}
                                    </Typography>
                                </Box>
                            ) : (
                                <Button variant="contained" onClick={handleAddSubject} sx={{ mt: 2 }} className="styledButton">
                                    Add Subject
                                </Button>
                            )}
                        </Grid>
                        <Grid item xs={12} sx={{ mt: 2, display: 'flex', justifyContent: 'flex-end', gap: 2 }}>
                            <Button variant="outlined" color="primary" onClick={() => navigate("/Admin/teachers/teacher/edit/" + teacherID)}>
                                Edit Profile
                            </Button>
                            <Button variant="outlined" color="error" onClick={deleteHandler}>
                                Delete Teacher
                            </Button>
                        </Grid>
                    </Grid>
                </ProfileCard>
            )}
            <ConfirmationModal
                open={confirmOpen}
                handleClose={() => setConfirmOpen(false)}
                handleConfirm={confirmDeleteHandler}
                title="Delete Teacher?"
                message="Are you sure you want to delete this teacher? This action cannot be undone."
                confirmLabel="Delete"
            />
            <Popup message={message} setShowPopup={setShowPopup} showPopup={showPopup} severity={severity} />
        </Container>
    );
};

export default TeacherDetails;

const ProfileCard = styled(Paper)`
    padding: 3rem;
    border-radius: var(--border-radius-xl);
    background: var(--bg-paper);
    border: 1px solid var(--border-color);
    
    .styledButton {
        background-color: var(--color-primary-600);
        &:hover {
            background-color: var(--color-primary-700);
        }
    }
`;