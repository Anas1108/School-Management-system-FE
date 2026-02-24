import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from "react-router-dom";
import axios from 'axios';
import { Box, Typography, Container, Paper, Grid, List, ListItem, ListItemText, ListItemButton, Divider, Tooltip, IconButton } from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import CustomLoader from '../../../components/CustomLoader';
import styled from 'styled-components';

const ViewFamily = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [family, setFamily] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchFamily = async () => {
            try {
                const response = await axios.get(`${process.env.REACT_APP_BASE_URL}/Family/${id}`);
                setFamily(response.data);
                setLoading(false);
            } catch (err) {
                console.error(err);
                setLoading(false);
            }
        };
        fetchFamily();
    }, [id]);

    if (loading) return <CustomLoader />;
    if (!family || family.message) return <Typography>No Family Found</Typography>;

    return (
        <Container maxWidth="md" sx={{ mt: 4, mb: 4 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <Tooltip title="Back to Families" arrow>
                    <IconButton
                        onClick={() => navigate(-1)}
                        sx={{
                            bgcolor: 'var(--bg-paper)',
                            border: '1px solid var(--border-color)',
                            borderRadius: 'var(--border-radius-md)',
                            mr: 2,
                            '&:hover': { bgcolor: 'var(--color-primary-50)' }
                        }}
                    >
                        <ArrowBackIcon sx={{ color: 'var(--text-primary)' }} />
                    </IconButton>
                </Tooltip>
            </Box>
            <StyledPaper elevation={3}>
                <Typography variant="h4" sx={{ mb: 3, fontWeight: 'bold', color: 'var(--text-primary)', textAlign: 'center' }}>
                    Family Details: {family.familyName}
                </Typography>
                <Box sx={{ mb: 4 }}>
                    <Grid container spacing={2}>
                        <Grid item xs={12} sm={6}>
                            <Typography variant="subtitle1" color="textSecondary">Father's Name</Typography>
                            <Typography variant="body1">{family.fatherName}</Typography>
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <Typography variant="subtitle1" color="textSecondary">Father's Phone</Typography>
                            <Typography variant="body1">{family.fatherPhone}</Typography>
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <Typography variant="subtitle1" color="textSecondary">Father's CNIC</Typography>
                            <Typography variant="body1">{family.fatherCNIC || 'N/A'}</Typography>
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <Typography variant="subtitle1" color="textSecondary">Mother's Name</Typography>
                            <Typography variant="body1">{family.motherName || 'N/A'}</Typography>
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <Typography variant="subtitle1" color="textSecondary">Mother's Phone</Typography>
                            <Typography variant="body1">{family.motherPhone || 'N/A'}</Typography>
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <Typography variant="subtitle1" color="textSecondary">Home Address</Typography>
                            <Typography variant="body1">{family.homeAddress}</Typography>
                        </Grid>
                    </Grid>
                </Box>
                <Divider />
                <Box sx={{ mt: 3 }}>
                    <Typography variant="h5" sx={{ mb: 2, fontWeight: 'bold', color: 'var(--text-primary)' }}>Associated Students</Typography>
                    {family.students && family.students.length > 0 ? (
                        <List>
                            {family.students.map((student, index) => (
                                <React.Fragment key={student._id}>
                                    <ListItem disablePadding>
                                        <Tooltip title="View Student" arrow>
                                            <ListItemButton onClick={() => navigate("/Admin/students/student/" + student._id)}>
                                                <ListItemText
                                                    primary={student.name}
                                                    secondary={`Roll No: ${student.rollNum} | Class: ${student.sclassName?.sclassName || 'N/A'}`}
                                                />
                                            </ListItemButton>
                                        </Tooltip>
                                    </ListItem>
                                    {index < family.students.length - 1 && <Divider />}
                                </React.Fragment>
                            ))}
                        </List>
                    ) : (
                        <Typography>No students associated yet.</Typography>
                    )}
                </Box>
            </StyledPaper>
        </Container>
    );
};

export default ViewFamily;

const StyledPaper = styled(Paper)`
    padding: 2rem;
    border-radius: var(--border-radius-xl);
    background: var(--bg-paper);
    border: 1px solid var(--border-color);
`;
