import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from "react-router-dom";
import axios from 'axios';
import { Box, Typography, Container, Paper, Grid, List, ListItem, ListItemText, ListItemButton, Divider, Tooltip, IconButton, Avatar, Tabs, Tab } from '@mui/material';
import { ArrowBack as ArrowBackIcon, Edit as EditIcon, Delete as DeleteIcon } from '@mui/icons-material';
import CustomLoader from '../../../components/CustomLoader';
import styled from 'styled-components';

const ViewFamily = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [family, setFamily] = useState(null);
    const [loading, setLoading] = useState(true);
    const [value, setValue] = useState(0);

    const handleChange = (event, newValue) => {
        setValue(newValue);
    };

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
    if (!family || family.message || !family.familyName) return <Typography>No Family Found</Typography>;

    return (
        <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
            <Paper sx={{ p: 3, mb: 3, borderRadius: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 2 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 3 }}>
                    <Avatar sx={{ width: 80, height: 80, fontSize: '2rem', bgcolor: 'var(--color-primary-600)' }}>
                        {family.familyName.charAt(0).toUpperCase()}
                    </Avatar>
                    <Box>
                        <Typography variant="h5" component="h1" sx={{ fontWeight: 'bold' }}>
                            {family.familyName} Family
                        </Typography>
                        <Typography variant="body1" color="textSecondary">
                            Total Students Enrolled: {family.students ? family.students.length : 0}
                        </Typography>
                    </Box>
                </Box>
                <Box sx={{ display: 'flex', gap: 1.5 }}>
                    <Tooltip title="Back">
                        <IconButton size="small" onClick={() => navigate("/Admin/families")} sx={{ border: '1px solid var(--border-color)', borderRadius: 'var(--border-radius-md)' }}>
                            <ArrowBackIcon fontSize="small" />
                        </IconButton>
                    </Tooltip>
                    <Tooltip title="Edit Profile">
                        <IconButton size="small" onClick={() => navigate("/Admin/families/family/edit/" + id)} sx={{ bgcolor: 'primary.main', color: 'white', '&:hover': { bgcolor: 'primary.dark' }, borderRadius: 'var(--border-radius-md)' }}>
                            <EditIcon fontSize="small" />
                        </IconButton>
                    </Tooltip>
                    <Tooltip title="Delete">
                        <IconButton size="small" color="error" sx={{ border: '1px solid', borderColor: 'error.main', borderRadius: 'var(--border-radius-md)' }}>
                            <DeleteIcon fontSize="small" />
                        </IconButton>
                    </Tooltip>
                </Box>
            </Paper>

            <Paper sx={{ width: '100%', borderRadius: 2, overflow: 'hidden' }}>
                <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                    <Tabs value={value} onChange={handleChange} aria-label="family details tabs">
                        <Tab label="Guardian Information" />
                        <Tab label="Associated Students" />
                    </Tabs>
                </Box>

                {/* Guardian Information Tab */}
                <CustomTabPanel value={value} index={0}>
                    <Typography variant="h6" gutterBottom sx={{ mb: 2 }}>
                        Father / Primary Guardian
                    </Typography>
                    <Grid container spacing={2}>
                        <DetailItem label="Name" value={family.fatherName} />
                        <DetailItem label="Phone" value={family.fatherPhone} />
                        <DetailItem label="CNIC" value={family.fatherCNIC} />
                        <DetailItem label="Occupation" value={family.fatherOccupation} />
                    </Grid>

                    <Typography variant="h6" gutterBottom sx={{ mb: 2, mt: 4 }}>
                        Mother's Information
                    </Typography>
                    <Grid container spacing={2}>
                        <DetailItem label="Name" value={family.motherName} />
                        <DetailItem label="Phone" value={family.motherPhone} />
                    </Grid>

                    <Typography variant="h6" gutterBottom sx={{ mb: 2, mt: 4 }}>
                        Contact Details
                    </Typography>
                    <Grid container spacing={2}>
                        <DetailItem label="Home Address" value={family.homeAddress} />
                        <DetailItem label="Guardian Email" value={family.guardianEmail} />
                    </Grid>
                </CustomTabPanel>

                {/* Associated Students Tab */}
                <CustomTabPanel value={value} index={1}>
                    <Typography variant="h6" gutterBottom sx={{ mb: 2 }}>
                        Enrolled Students
                    </Typography>
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
                        <Typography variant="body1" color="textSecondary">
                            No students currently associated with this family.
                        </Typography>
                    )}
                </CustomTabPanel>
            </Paper>
        </Container>
    );
};

export default ViewFamily;

function CustomTabPanel(props) {
    const { children, value, index, ...other } = props;

    return (
        <div
            role="tabpanel"
            hidden={value !== index}
            id={`simple-tabpanel-${index}`}
            aria-labelledby={`simple-tab-${index}`}
            {...other}
        >
            {value === index && (
                <Box sx={{ p: 3 }}>
                    {children}
                </Box>
            )}
        </div>
    );
}

const DetailItem = ({ label, value }) => (
    <Grid item xs={12} sm={6} md={3} lg={2.4}>
        <Box sx={{ p: 1, border: '1px solid var(--border-color)', borderRadius: 'var(--border-radius-sm)', minHeight: '60px', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
            <Typography variant="caption" color="textSecondary" display="block" sx={{ lineHeight: 1, mb: 0.5, fontSize: '0.75rem' }}>
                {label}
            </Typography>
            <Typography variant="body2" fontWeight="500" sx={{ lineHeight: 1.2, fontSize: '0.9rem' }}>
                {value || "-"}
            </Typography>
        </Box>
    </Grid>
);
