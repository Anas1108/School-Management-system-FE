import React, { useEffect, useState } from 'react';
import { getTeacherDetails } from '../../../redux/teacherRelated/teacherHandle';
import { deleteUser } from '../../../redux/userRelated/userHandle';
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { Button, Container, Typography, Box, Paper, Avatar, Grid, Chip, Tabs, Tab } from '@mui/material';
import styled from 'styled-components';
import ConfirmationModal from '../../../components/ConfirmationModal';
import Popup from '../../../components/Popup';
import axios from 'axios';

const TeacherDetails = () => {
    const navigate = useNavigate();
    const params = useParams();
    const dispatch = useDispatch();
    const { loading, teacherDetails } = useSelector((state) => state.teacher);
    const { error } = useSelector((state) => state.user);
    const [workload, setWorkload] = useState([]);
    const [workloadLoading, setWorkloadLoading] = useState(false);

    const teacherID = params.id;

    useEffect(() => {
        dispatch(getTeacherDetails(teacherID));
        fetchWorkload(teacherID);
    }, [dispatch, teacherID]);

    const fetchWorkload = (id) => {
        setWorkloadLoading(true);
        axios.get(`${process.env.REACT_APP_BASE_URL}/TeacherWorkload/${id}`)
            .then(response => {
                setWorkload(response.data);
                setWorkloadLoading(false);
            })
            .catch(error => {
                console.error("Error fetching workload:", error);
                setWorkloadLoading(false);
            });
    };

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

    const [value, setValue] = useState(0);

    const handleChange = (event, newValue) => {
        setValue(newValue);
    };

    return (
        <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
            {loading ? (
                <div>Loading...</div>
            ) : (
                <>
                    <Paper sx={{ p: 3, mb: 3, borderRadius: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 2 }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 3 }}>
                            <Avatar sx={{ width: 80, height: 80, fontSize: '2rem', bgcolor: 'var(--color-primary-600)' }}>
                                {teacherDetails?.name?.charAt(0)}
                            </Avatar>
                            <Box>
                                <Typography variant="h5" component="h1" sx={{ fontWeight: 'bold' }}>
                                    {teacherDetails?.name}
                                </Typography>
                                <Typography variant="body1" color="textSecondary">
                                    ID: {teacherDetails?.employeeId || "N/A"}
                                </Typography>
                                <Typography variant="body2" color="primary">
                                    {teacherDetails?.designation || "No Designation"} • {teacherDetails?.department?.departmentName || teacherDetails?.department || "No Department"}
                                </Typography>
                            </Box>
                        </Box>
                        <Box sx={{ display: 'flex', gap: 2 }}>
                            <Button variant="outlined" onClick={() => navigate("/Admin/teachers")}>
                                Back
                            </Button>
                            <Button variant="contained" color="primary" onClick={() => navigate("/Admin/teachers/teacher/edit/" + teacherID)}>
                                Edit Profile
                            </Button>
                            <Button variant="outlined" color="error" onClick={deleteHandler}>
                                Delete
                            </Button>
                        </Box>
                    </Paper>

                    <Paper sx={{ width: '100%', borderRadius: 2, overflow: 'hidden' }}>
                        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                            <Tabs value={value} onChange={handleChange} aria-label="teacher details tabs">
                                <Tab label="Personal Details" />
                                <Tab label="Academic & Workload" />
                            </Tabs>
                        </Box>

                        {/* Personal Details Tab */}
                        <CustomTabPanel value={value} index={0}>
                            <Typography variant="h6" gutterBottom sx={{ mb: 2 }}>
                                Personal Information
                            </Typography>
                            <Grid container spacing={2}>
                                <DetailItem label="Email" value={teacherDetails?.email} />
                                <DetailItem label="Phone" value={teacherDetails?.phone} />
                                <DetailItem label="CNIC" value={teacherDetails?.cnic} />
                                <DetailItem label="DoB" value={teacherDetails?.dob ? new Date(teacherDetails?.dob).toLocaleDateString() : null} />
                                <DetailItem label="Gender" value={teacherDetails?.gender} />
                                <DetailItem label="Blood Group" value={teacherDetails?.bloodGroup} />
                                <DetailItem label="Address" value={teacherDetails?.address} />
                            </Grid>

                            <Typography variant="h6" gutterBottom sx={{ mb: 2, mt: 4 }}>
                                Professional Information
                            </Typography>
                            <Grid container spacing={2}>
                                <DetailItem label="Qualification" value={teacherDetails?.qualification} />
                                <DetailItem label="Joining Date" value={teacherDetails?.joiningDate ? new Date(teacherDetails?.joiningDate).toLocaleDateString() : null} />
                                <DetailItem label="Salary" value={teacherDetails?.salary} />
                                <DetailItem label="Service Book No" value={teacherDetails?.serviceBookNumber} />
                                <DetailItem label="Police Verification" value={teacherDetails?.policeVerification} />
                            </Grid>
                        </CustomTabPanel>

                        {/* Academic & Workload Tab */}
                        <CustomTabPanel value={value} index={1}>
                            <Typography variant="h6" gutterBottom sx={{ mb: 2 }}>
                                Subject Workload
                            </Typography>
                            {workloadLoading ? (
                                <Typography variant="body1">Loading workload...</Typography>
                            ) : workload.length > 0 ? (
                                <Paper variant="outlined" sx={{ overflow: 'hidden', mt: 2 }}>
                                    <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                                        <thead>
                                            <tr style={{ borderBottom: '1px solid var(--border-color)', backgroundColor: 'var(--bg-light)' }}>
                                                <th style={{ padding: '12px', textAlign: 'left', fontWeight: 600 }}>Class</th>
                                                <th style={{ padding: '12px', textAlign: 'left', fontWeight: 600 }}>Subject</th>
                                                <th style={{ padding: '12px', textAlign: 'left', fontWeight: 600 }}>Role</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {workload.map((alloc) => (
                                                <tr key={alloc._id} style={{ borderBottom: '1px solid var(--border-color)' }}>
                                                    <td style={{ padding: '12px' }}>{alloc.classId?.sclassName || 'N/A'}</td>
                                                    <td style={{ padding: '12px' }}>
                                                        <Typography variant="body2" sx={{ fontWeight: 500 }}>
                                                            {alloc.subjectId?.subName}
                                                        </Typography>
                                                        <Typography variant="caption" color="textSecondary">
                                                            {alloc.subjectId?.subCode}
                                                        </Typography>
                                                    </td>
                                                    <td style={{ padding: '12px' }}>
                                                        <Box sx={{ display: 'flex', gap: 1 }}>
                                                            <Chip
                                                                label={alloc.type}
                                                                size="small"
                                                                color={alloc.type === 'Primary' ? 'success' : 'warning'}
                                                                variant="outlined"
                                                            />
                                                            {alloc.isClassIncharge && (
                                                                <Chip label="In-charge" size="small" color="info" />
                                                            )}
                                                        </Box>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </Paper>
                            ) : (
                                <Typography variant="body1" color="textSecondary">
                                    No subjects currently assigned.
                                </Typography>
                            )}
                        </CustomTabPanel>
                    </Paper>
                </>
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