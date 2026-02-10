import React, { useEffect } from 'react';
import { getTeacherDetails } from '../../../redux/teacherRelated/teacherHandle';
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { Button, Container, Typography, Box, Paper, Avatar, Grid } from '@mui/material';
import styled from 'styled-components';

const TeacherDetails = () => {
    const navigate = useNavigate();
    const params = useParams();
    const dispatch = useDispatch();
    const { loading, teacherDetails, error } = useSelector((state) => state.teacher);

    const teacherID = params.id;

    useEffect(() => {
        dispatch(getTeacherDetails(teacherID));
    }, [dispatch, teacherID]);

    if (error) {
        console.log(error);
    }

    const isSubjectNamePresent = teacherDetails?.teachSubject?.subName;

    const handleAddSubject = () => {
        navigate(`/Admin/teachers/choosesubject/${teacherDetails?.teachSclass?._id}/${teacherDetails?._id}`);
    };

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
                    </Grid>
                </ProfileCard>
            )}
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