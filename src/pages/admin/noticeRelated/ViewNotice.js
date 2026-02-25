import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams, useNavigate } from 'react-router-dom';
import { getNoticeDetails } from '../../../redux/noticeRelated/noticeHandle';
import {
    Box, Typography, Paper, Container, Grid, Divider, Button, CircularProgress
} from '@mui/material';
import styled from 'styled-components';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

const ViewNotice = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { id } = useParams();

    const { noticeDetails, loading, error } = useSelector((state) => state.notice);

    useEffect(() => {
        dispatch(getNoticeDetails(id, "Notice"));
    }, [dispatch, id]);

    if (error) {
        console.error(error);
    }

    if (loading) {
        return (
            <Box display="flex" justifyContent="center" alignItems="center" height="50vh">
                <CircularProgress />
            </Box>
        );
    }

    return (
        <Container maxWidth="md" sx={{ mt: 4, mb: 4 }}>
            <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
                <Typography variant="h4" sx={{ fontWeight: 'bold', color: 'var(--text-primary)' }}>
                    Notice Details
                </Typography>
                <Button
                    variant="outlined"
                    startIcon={<ArrowBackIcon />}
                    onClick={() => navigate(-1)}
                    sx={{ borderRadius: 'var(--border-radius-md)' }}
                >
                    Back
                </Button>
            </Box>

            {noticeDetails ? (
                <StyledPaper elevation={3}>
                    <Box mb={4}>
                        <Typography variant="h3" component="h1" gutterBottom sx={{ fontWeight: 700, color: 'var(--color-primary-700)' }}>
                            {noticeDetails.title}
                        </Typography>
                        <Box display="flex" alignItems="center" color="text.secondary" mb={2}>
                            <CalendarMonthIcon fontSize="small" sx={{ mr: 1, color: 'var(--color-primary-500)' }} />
                            <Typography variant="subtitle1">
                                {new Date(noticeDetails.date).toLocaleDateString('en-US', {
                                    year: 'numeric',
                                    month: 'long',
                                    day: 'numeric'
                                })}
                            </Typography>
                        </Box>
                    </Box>

                    <Divider sx={{ mb: 4 }} />

                    <Grid container spacing={3}>
                        <Grid item xs={12}>
                            <Typography variant="h6" gutterBottom sx={{ fontWeight: 600, color: 'var(--text-secondary)' }}>
                                Details
                            </Typography>
                            <ContentBox>
                                <Typography variant="body1" sx={{ whiteSpace: 'pre-wrap', lineHeight: 1.8 }}>
                                    {noticeDetails.details}
                                </Typography>
                            </ContentBox>
                        </Grid>
                    </Grid>
                </StyledPaper>
            ) : (
                <Typography variant="h6" align="center" color="textSecondary">
                    Notice details not found.
                </Typography>
            )}
        </Container>
    );
};

export default ViewNotice;

const StyledPaper = styled(Paper)`
    padding: 3rem;
    border-radius: var(--border-radius-xl);
    background: var(--bg-paper);
    border: 1px solid var(--border-color);
    position: relative;
    overflow: hidden;

    &::before {
        content: '';
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        height: 6px;
        background: var(--gradient-primary);
    }
`;

const ContentBox = styled(Box)`
    background-color: var(--bg-body);
    padding: 2rem;
    border-radius: var(--border-radius-lg);
    border: 1px solid var(--border-color);
`;
