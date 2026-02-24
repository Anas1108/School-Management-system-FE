import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from "react-router-dom";
import axios from 'axios';
import { Box, Typography, Container, Paper, Grid, List, ListItem, ListItemText, ListItemButton, Divider, Tooltip, IconButton, Avatar, Tabs, Tab, Dialog, DialogTitle, DialogContent, DialogActions, Button } from '@mui/material';
import { ArrowBack as ArrowBackIcon, Edit as EditIcon, Delete as DeleteIcon } from '@mui/icons-material';
import CustomLoader from '../../../components/CustomLoader';
import Popup from '../../../components/Popup';

const ViewFamily = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [family, setFamily] = useState(null);
    const [loading, setLoading] = useState(true);
    const [value, setValue] = useState(0);

    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [actionLoading, setActionLoading] = useState(false);
    const [showPopup, setShowPopup] = useState(false);
    const [message, setMessage] = useState("");
    const [severity, setSeverity] = useState("error");

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

    const handleDeleteClick = () => {
        setDeleteDialogOpen(true);
    };

    const handleDeleteConfirm = async () => {
        setActionLoading(true);
        try {
            const response = await axios.delete(`${process.env.REACT_APP_BASE_URL}/Family/${id}`);
            if (response.data.message && typeof response.data.message === 'string' && response.data.message.toLowerCase().includes("cannot delete")) {
                setMessage(response.data.message);
                setSeverity("error");
                setShowPopup(true);
            } else {
                setMessage("Family Deleted Successfully");
                setSeverity("success");
                setShowPopup(true);
                setTimeout(() => {
                    navigate('/Admin/families');
                }, 1500);
            }
        } catch (error) {
            console.error(error);
            setMessage("Error deleting family");
            setSeverity("error");
            setShowPopup(true);
        } finally {
            setActionLoading(false);
            setDeleteDialogOpen(false);
        }
    };

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
                        <IconButton size="small" color="error" onClick={handleDeleteClick} sx={{ border: '1px solid', borderColor: 'error.main', borderRadius: 'var(--border-radius-md)' }}>
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

            <Dialog open={deleteDialogOpen} onClose={() => setDeleteDialogOpen(false)}>
                <DialogTitle>Confirm Deletion</DialogTitle>
                <DialogContent>
                    <Typography>
                        Are you sure you want to delete the {family.familyName} family? This action cannot be undone.
                        Note: You cannot delete a family if there are students still associated with it.
                    </Typography>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setDeleteDialogOpen(false)} disabled={actionLoading}>Cancel</Button>
                    <Button onClick={handleDeleteConfirm} color="error" variant="contained" disabled={actionLoading}>
                        {actionLoading ? "Deleting..." : "Delete"}
                    </Button>
                </DialogActions>
            </Dialog>

            <Popup message={message} setShowPopup={setShowPopup} showPopup={showPopup} severity={severity} />
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
