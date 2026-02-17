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
                    <Grid container spacing={3}>
                        {/* Header Section */}
                        <Grid item xs={12} sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                            <Avatar sx={{ width: 100, height: 100, fontSize: '2.5rem', bgcolor: 'var(--color-primary-600)', mr: 3 }}>
                                {teacherDetails?.name?.charAt(0)}
                            </Avatar>
                            <Box>
                                <Typography variant="h4" component="h1" sx={{ fontWeight: 'bold' }}>
                                    {teacherDetails?.name}
                                </Typography>
                                <Typography variant="h6" color="textSecondary">
                                    {teacherDetails?.employeeId || "No Employee ID"}
                                </Typography>
                                <Typography variant="subtitle1" color="primary">
                                    {teacherDetails?.designation || "No Designation"} - {teacherDetails?.department?.departmentName || teacherDetails?.department || "No Department"}
                                </Typography>
                            </Box>
                        </Grid>

                        {/* Personal Details Section */}
                        <Grid item xs={12}>
                            <Typography variant="h5" gutterBottom sx={{ borderBottom: '2px solid var(--border-color)', pb: 1, mb: 2 }}>
                                Personal & Professional Details
                            </Typography>
                            <Grid container spacing={2}>
                                <DetailItem label="Email" value={teacherDetails?.email} />
                                <DetailItem label="Phone" value={teacherDetails?.phone} />
                                <DetailItem label="CNIC" value={teacherDetails?.cnic} />
                                <DetailItem label="Qualification" value={teacherDetails?.qualification} />
                                <DetailItem label="Joining Date" value={teacherDetails?.joiningDate ? new Date(teacherDetails?.joiningDate).toLocaleDateString() : null} />
                                <DetailItem label="Salary" value={teacherDetails?.salary} />
                                <DetailItem label="Service Book No" value={teacherDetails?.serviceBookNumber} />
                                <DetailItem label="Police Verification" value={teacherDetails?.policeVerification} />
                            </Grid>
                        </Grid>

                        {/* Academic Section */}
                        <Grid item xs={12} sx={{ mt: 3 }}>
                            <Typography variant="h5" gutterBottom sx={{ borderBottom: '2px solid var(--border-color)', pb: 1, mb: 2 }}>
                                Academic Responsibilities
                            </Typography>
                            <Grid container spacing={2}>
                                <DetailItem label="Assigned Class" value={teacherDetails?.teachSclass?.sclassName} />
                                <DetailItem label="Assigned Subject" value={teacherDetails?.teachSubject?.subName} />
                                <DetailItem label="Sessions" value={teacherDetails?.teachSubject?.sessions} />
                            </Grid>
                            {!isSubjectNamePresent && (
                                <Button variant="contained" onClick={handleAddSubject} sx={{ mt: 2 }} className="styledButton">
                                    Add Subject
                                </Button>
                            )}
                        </Grid>

                        {/* Actions */}
                        <Grid item xs={12} sx={{ mt: 4, display: 'flex', justifyContent: 'flex-end', gap: 2 }}>
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

const DetailItem = ({ label, value }) => (
    <Grid item xs={12} sm={6} md={4}>
        <Box sx={{ p: 1.5, border: '1px solid var(--border-color)', borderRadius: 'var(--border-radius-md)' }}>
            <Typography variant="caption" color="textSecondary" display="block">
                {label}
            </Typography>
            <Typography variant="body1" fontWeight="500">
                {value || "N/A"}
            </Typography>
        </Box>
    </Grid>
);