import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getUserDetails } from '../../../redux/userRelated/userHandle';
import { deleteUser } from '../../../redux/userRelated/userHandle';
import { useNavigate, useParams } from 'react-router-dom'
import { getSubjectList } from '../../../redux/sclassRelated/sclassHandle';
import { Box, Button, IconButton, Table, TableBody, TableHead, Typography, Tab, Paper, BottomNavigation, BottomNavigationAction, Container, Grid, Avatar, Dialog, DialogTitle, DialogContent, TextField, MenuItem, DialogActions, ToggleButton, ToggleButtonGroup, Tooltip, Chip } from '@mui/material';
import TabContext from '@mui/lab/TabContext';
import TabList from '@mui/lab/TabList';
import TabPanel from '@mui/lab/TabPanel';
import { Delete as DeleteIcon, ArrowBack as ArrowBackIcon, Edit as EditIcon } from '@mui/icons-material';
import AccountBalanceIcon from '@mui/icons-material/AccountBalance';

import CustomBarChart from '../../../components/CustomBarChart'
import { StyledTableCell, StyledTableRow } from '../../../components/styles';

import InsertChartIcon from '@mui/icons-material/InsertChart';
import InsertChartOutlinedIcon from '@mui/icons-material/InsertChartOutlined';
import TableChartIcon from '@mui/icons-material/TableChart';
import TableChartOutlinedIcon from '@mui/icons-material/TableChartOutlined';
import Popup from '../../../components/Popup';
import styled from 'styled-components';
import ConfirmationModal from '../../../components/ConfirmationModal';
import CustomLoader from '../../../components/CustomLoader';
import axios from 'axios';

const ViewStudent = () => {
    const navigate = useNavigate()
    const params = useParams()
    const dispatch = useDispatch()
    const { currentUser, userDetails, response, loading, error } = useSelector((state) => state.user);

    const studentID = params.id
    const address = "Student"

    useEffect(() => {
        dispatch(getUserDetails(studentID, address));
    }, [dispatch, studentID])

    useEffect(() => {
        if (userDetails && userDetails.sclassName && userDetails.sclassName._id !== undefined) {
            dispatch(getSubjectList(userDetails.sclassName._id, "ClassSubjects"));
        }
    }, [dispatch, userDetails]);

    if (response) { console.log(response) }
    else if (error) { console.log(error) }

    const [name, setName] = useState('');
    const [rollNum, setRollNum] = useState('');
    const [sclassName, setSclassName] = useState('');

    const [subjectMarks, setSubjectMarks] = useState('');


    const [showPopup, setShowPopup] = useState(false);
    const [message, setMessage] = useState("");
    const [severity, setSeverity] = useState("success");

    // Confirmation Modal State
    const [confirmOpen, setConfirmOpen] = useState(false);



    const [studentDiscounts, setStudentDiscounts] = useState([]);
    const [fetchDiscountsTrigger, setFetchDiscountsTrigger] = useState(0);

    const fetchDiscounts = React.useCallback(async () => {
        try {
            const result = await axios.get(`${process.env.REACT_APP_BASE_URL}/StudentDiscounts/${studentID}`);
            if (result.data) {
                setStudentDiscounts(result.data);
            }
        } catch (err) {
            console.error(err);
        }
    }, [studentID]);

    useEffect(() => {
        fetchDiscounts();
    }, [fetchDiscounts, fetchDiscountsTrigger]);

    const [value, setValue] = useState('1');

    const handleChange = (event, newValue) => {
        setValue(newValue);
    };

    const [selectedSection, setSelectedSection] = useState('table');
    const handleSectionChange = (event, newSection) => {
        setSelectedSection(newSection);
    };

    useEffect(() => {
        if (userDetails) {
            setName(userDetails.name || '');
            setRollNum(userDetails.rollNum || '');
            setSclassName(userDetails.sclassName || '');

            setSubjectMarks(userDetails.examResult || '');
        }
    }, [userDetails]);

    const deleteHandler = () => {
        setConfirmOpen(true);
    }

    const confirmDeleteHandler = () => {
        dispatch(deleteUser(studentID, address))
            .then(() => {
                setMessage("Student Deleted Successfully");
                setSeverity("success");
                setShowPopup(true);
                setConfirmOpen(false);
                setTimeout(() => {
                    navigate(-1);
                }, 1500);
            })
    }



    const StudentMarksSection = () => {
        const renderTableSection = () => {
            return (
                <>
                    <Typography variant="h5" gutterBottom>Subject Marks</Typography>
                    <Table>
                        <TableHead>
                            <StyledTableRow>
                                <StyledTableCell>Subject</StyledTableCell>
                                <StyledTableCell>Marks</StyledTableCell>
                            </StyledTableRow>
                        </TableHead>
                        <TableBody>
                            {subjectMarks.map((result, index) => {
                                if (!result.subName || !result.marksObtained) {
                                    return null;
                                }
                                return (
                                    <StyledTableRow key={index}>
                                        <StyledTableCell>{result.subName.subName}</StyledTableCell>
                                        <StyledTableCell>{result.marksObtained}</StyledTableCell>
                                    </StyledTableRow>
                                );
                            })}
                        </TableBody>
                    </Table>
                    <Button variant="contained" sx={{ mt: 2, ...styles.styledButton }} onClick={() => navigate("/Admin/students/student/marks/" + studentID)}>
                        Add Marks
                    </Button>
                </>
            )
        }
        const renderChartSection = () => {
            return (
                <>
                    <CustomBarChart chartData={subjectMarks} dataKey="marksObtained" />
                </>
            )
        }
        return (
            <>
                {subjectMarks && Array.isArray(subjectMarks) && subjectMarks.length > 0
                    ?
                    <>
                        {selectedSection === 'table' && renderTableSection()}
                        {selectedSection === 'chart' && renderChartSection()}

                        <Paper sx={{ position: 'fixed', bottom: 0, left: 0, right: 0 }} elevation={3}>
                            <BottomNavigation value={selectedSection} onChange={handleSectionChange} showLabels>
                                <BottomNavigationAction
                                    label="Table"
                                    value="table"
                                    icon={selectedSection === 'table' ? <TableChartIcon /> : <TableChartOutlinedIcon />}
                                />
                                <BottomNavigationAction
                                    label="Chart"
                                    value="chart"
                                    icon={selectedSection === 'chart' ? <InsertChartIcon /> : <InsertChartOutlinedIcon />}
                                />
                            </BottomNavigation>
                        </Paper>
                    </>
                    :
                    <Button variant="contained" sx={styles.styledButton} onClick={() => navigate("/Admin/students/student/marks/" + studentID)}>
                        Add Marks
                    </Button>
                }
            </>
        )
    }

    const StudentDetailsSection = () => {
        const family = userDetails?.familyId || {};

        const InfoRow = ({ label, value }) => (
            <Box sx={{ mb: 1.5, display: 'flex', borderBottom: '1px solid #f0f0f0', pb: 1 }}>
                <Typography variant="body1" sx={{ fontWeight: 600, width: '150px', color: 'text.secondary' }}>
                    {label}:
                </Typography>
                <Typography variant="body1" sx={{ flex: 1, fontWeight: 500 }}>
                    {value || "N/A"}
                </Typography>
            </Box>
        );

        return (
            <ProfileCard>
                <Grid container spacing={3}>
                    {/* Personal Information */}
                    <Grid item xs={12} md={6}>
                        <Typography variant="h6" gutterBottom sx={{ color: 'var(--color-primary-700)', borderBottom: '2px solid var(--color-primary-200)', pb: 1, mb: 2 }}>
                            Personal Information
                        </Typography>
                        <InfoRow label="Date of Birth" value={userDetails?.dateOfBirth ? new Date(userDetails.dateOfBirth).toLocaleDateString() : ''} />
                        <InfoRow label="Gender" value={userDetails?.gender} />
                        <InfoRow label="Blood Group" value={userDetails?.bloodGroup} />
                        <InfoRow label="Religion" value={userDetails?.religion} />
                        <InfoRow label="Student B-Form" value={userDetails?.studentBForm} />
                        <InfoRow label="Admission Date" value={userDetails?.admissionDate ? new Date(userDetails.admissionDate).toLocaleDateString() : ''} />
                    </Grid>

                    {/* Family Information */}
                    <Grid item xs={12} md={6}>
                        <Typography variant="h6" gutterBottom sx={{ color: 'var(--color-primary-700)', borderBottom: '2px solid var(--color-primary-200)', pb: 1, mb: 2 }}>
                            Family Information
                        </Typography>
                        <InfoRow label="Father Name" value={family.fatherName} />
                        <InfoRow label="Father CNIC" value={family.fatherCNIC} />
                        <InfoRow label="Father Phone" value={family.fatherPhone} />
                        <InfoRow label="Father Occupation" value={family.fatherOccupation} />
                        <InfoRow label="Mother Name" value={family.motherName} />
                        <InfoRow label="Mother Phone" value={family.motherPhone} />
                        <InfoRow label="Home Address" value={family.homeAddress} />
                    </Grid>
                </Grid>
            </ProfileCard>
        )
    }

    const StudentDiscountsSection = () => {
        const [discountGroups, setDiscountGroups] = useState([]);
        const [openAssignModal, setOpenAssignModal] = useState(false);
        const [discountMode, setDiscountMode] = useState('preset'); // 'preset' or 'custom'
        const [newDiscount, setNewDiscount] = useState({ discountGroup: '', customName: '', type: 'Percentage', value: 0 });
        const [confirmDiscountOpen, setConfirmDiscountOpen] = useState(false);
        const [discountToDelete, setDiscountToDelete] = useState(null);

        useEffect(() => {
            const fetchGroups = async () => {
                if (currentUser?._id) {
                    try {
                        const res = await axios.get(`${process.env.REACT_APP_BASE_URL}/DiscountGroups/${currentUser._id}`);
                        setDiscountGroups(res.data);
                    } catch (e) { console.error(e); }
                }
            };
            fetchGroups();
        }, []);

        const handleAssignDiscount = async () => {
            try {
                await axios.post(`${process.env.REACT_APP_BASE_URL}/StudentDiscountAssign`, {
                    studentId: studentID,
                    adminID: currentUser._id,
                    ...newDiscount
                });
                setOpenAssignModal(false);
                setFetchDiscountsTrigger(prev => prev + 1);
                setMessage("Discount Assigned Successfully");
                setSeverity("success");
                setShowPopup(true);
            } catch (err) {
                console.error(err);
                setMessage(err.response?.data?.message || "Failed to assign discount");
                setSeverity("error");
                setShowPopup(true);
            }
        };

        const handleRemoveDiscount = (id) => {
            setDiscountToDelete(id);
            setConfirmDiscountOpen(true);
        };

        const confirmRemoveDiscountHandler = async () => {
            if (!discountToDelete) return;
            try {
                await axios.delete(`${process.env.REACT_APP_BASE_URL}/StudentDiscountRemove/${discountToDelete}`);
                setFetchDiscountsTrigger(prev => prev + 1);
                setMessage("Discount Removed");
                setSeverity("success");
                setShowPopup(true);
                setConfirmDiscountOpen(false);
                setDiscountToDelete(null);
            } catch (err) {
                console.error(err);
                setMessage("Failed to remove discount");
                setSeverity("error");
                setShowPopup(true);
                setConfirmDiscountOpen(false);
                setDiscountToDelete(null);
            }
        };

        return (
            <>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                    <Typography variant="h6" fontWeight="bold">Active Discounts</Typography>
                    <Button variant="contained" onClick={() => setOpenAssignModal(true)} sx={{ borderRadius: 2, textTransform: 'none', boxShadow: 'none' }}>Assign Discount</Button>
                </Box>

                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                    {studentDiscounts.length > 0 ? studentDiscounts.map(d => (
                        <Box key={d._id} sx={{ p: 2, border: '1px solid var(--border-color)', borderRadius: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <Box>
                                <Typography variant="subtitle1" fontWeight="bold">
                                    {d.discountGroup ? d.discountGroup.name : d.customName}
                                </Typography>
                                <Typography variant="body2" color="text.secondary">
                                    {d.type}: {d.value}{d.type === 'Percentage' ? '%' : ' PKR'}
                                </Typography>
                            </Box>
                            <IconButton color="error" onClick={() => handleRemoveDiscount(d._id)}>
                                <DeleteIcon />
                            </IconButton>
                        </Box>
                    )) : (
                        <Typography color="text.secondary">No active discounts.</Typography>
                    )}
                </Box>

                <Dialog open={openAssignModal} onClose={() => setOpenAssignModal(false)} maxWidth="sm" fullWidth>
                    <DialogTitle sx={{ fontWeight: 'bold' }}>Assign Discount to Student</DialogTitle>
                    <DialogContent>
                        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 1 }}>
                            <Box sx={{ display: 'flex', justifyContent: 'center', mb: 2 }}>
                                <ToggleButtonGroup
                                    color="primary"
                                    value={discountMode}
                                    exclusive
                                    onChange={(e, newMode) => {
                                        if (newMode !== null) {
                                            setDiscountMode(newMode);
                                            // Reset fields when switching modes
                                            setNewDiscount({ discountGroup: '', customName: '', type: 'Percentage', value: 0 });
                                        }
                                    }}
                                    aria-label="Discount Mode"
                                >
                                    <ToggleButton value="preset">Preset Discount</ToggleButton>
                                    <ToggleButton value="custom">Custom Discount</ToggleButton>
                                </ToggleButtonGroup>
                            </Box>

                            {discountMode === 'preset' ? (
                                <TextField
                                    select
                                    label="Discount Preset"
                                    value={newDiscount.discountGroup}
                                    onChange={(e) => {
                                        const selectedId = e.target.value;
                                        if (selectedId === '') {
                                            setNewDiscount({ discountGroup: '', customName: '', type: 'Percentage', value: 0 });
                                        } else {
                                            const group = discountGroups.find(g => g._id === selectedId);
                                            setNewDiscount({
                                                discountGroup: selectedId,
                                                customName: '',
                                                type: group.type,
                                                value: group.value
                                            });
                                        }
                                    }}
                                    fullWidth
                                    helperText={newDiscount.discountGroup ? "Values are auto-populated from the preset and locked securely." : "Select a predefined preset."}
                                >
                                    <MenuItem value=""><em>-- Select a Preset --</em></MenuItem>
                                    {discountGroups.map(g => (
                                        <MenuItem key={g._id} value={g._id}>{g.name} ({g.type === 'Percentage' ? g.value + '%' : 'PKR ' + g.value})</MenuItem>
                                    ))}
                                </TextField>
                            ) : (
                                <TextField
                                    label="Custom Discount Name"
                                    value={newDiscount.customName}
                                    onChange={(e) => setNewDiscount({ ...newDiscount, customName: e.target.value })}
                                    fullWidth
                                    required
                                />
                            )}

                            <TextField
                                select
                                label="Discount Type"
                                value={newDiscount.type}
                                onChange={(e) => setNewDiscount({ ...newDiscount, type: e.target.value })}
                                fullWidth
                                disabled={discountMode === 'preset'}
                            >
                                <MenuItem value="Percentage">Percentage (%)</MenuItem>
                                <MenuItem value="FixedAmount">Fixed Amount (PKR)</MenuItem>
                            </TextField>

                            <TextField
                                label="Value"
                                type="number"
                                value={newDiscount.value}
                                onChange={(e) => {
                                    let val = Number(e.target.value);
                                    if (newDiscount.type === 'Percentage') {
                                        if (val < 0) val = 0;
                                        if (val > 100) val = 100;
                                    } else {
                                        if (val < 0) val = 0;
                                    }
                                    setNewDiscount({ ...newDiscount, value: val });
                                }}
                                fullWidth
                                inputProps={newDiscount.type === 'Percentage' ? { min: 0, max: 100 } : { min: 0 }}
                                disabled={discountMode === 'preset'}
                            />
                        </Box>
                    </DialogContent>
                    <DialogActions sx={{ p: 3 }}>
                        <Button onClick={() => setOpenAssignModal(false)} color="inherit">Cancel</Button>
                        <Button variant="contained" onClick={handleAssignDiscount}>Assign</Button>
                    </DialogActions>
                </Dialog>

                <ConfirmationModal
                    open={confirmDiscountOpen}
                    handleClose={() => { setConfirmDiscountOpen(false); setDiscountToDelete(null); }}
                    handleConfirm={confirmRemoveDiscountHandler}
                    title="Remove Discount?"
                    message="Are you sure you want to remove this discount from the student?"
                    confirmLabel="Remove"
                />
            </>
        )
    }

    return (
        <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
            {loading
                ?
                <CustomLoader />
                :
                <>
                    <Paper sx={{ p: 3, mb: 3, borderRadius: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 2 }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 3 }}>
                            <Avatar sx={{ width: 80, height: 80, fontSize: '2rem', bgcolor: 'var(--color-primary-600)' }}>
                                {name.charAt(0)}
                            </Avatar>
                            <Box>
                                <Typography variant="h5" component="h1" sx={{ fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: 1 }}>
                                    {name}
                                    {userDetails?.status === 'Retired' && (
                                        <Chip label="Retired" color="error" size="small" sx={{ ml: 1, fontWeight: 'bold' }} />
                                    )}
                                </Typography>
                                <Typography variant="body1" color="textSecondary">
                                    Roll: {rollNum}
                                </Typography>
                                <Typography variant="body2" color="primary">
                                    {userDetails?.status === 'Retired' ? 'Last Class:' : 'Class:'} {sclassName?.sclassName}
                                </Typography>
                            </Box>
                        </Box>
                        <Box sx={{ display: 'flex', gap: 1.5 }}>
                            <Tooltip title="Back">
                                <IconButton size="small" onClick={() => navigate("/Admin/students")} sx={{ border: '1px solid var(--border-color)', borderRadius: 'var(--border-radius-md)' }}>
                                    <ArrowBackIcon fontSize="small" />
                                </IconButton>
                            </Tooltip>
                            <Tooltip title="Edit Profile">
                                <IconButton size="small" onClick={() => navigate("/Admin/students/student/edit/" + studentID)} sx={{ bgcolor: 'primary.main', color: 'white', '&:hover': { bgcolor: 'primary.dark' }, borderRadius: 'var(--border-radius-md)' }}>
                                    <EditIcon fontSize="small" />
                                </IconButton>
                            </Tooltip>
                            <Tooltip title="Last Balance">
                                <IconButton size="small" onClick={() => navigate("/Admin/students/student/lastbalance/" + studentID)} sx={{ bgcolor: 'success.main', color: 'white', '&:hover': { bgcolor: 'success.dark' }, borderRadius: 'var(--border-radius-md)' }}>
                                    <AccountBalanceIcon fontSize="small" />
                                </IconButton>
                            </Tooltip>
                            <Tooltip title="Delete">
                                <IconButton size="small" color="error" onClick={deleteHandler} sx={{ border: '1px solid', borderColor: 'error.main', borderRadius: 'var(--border-radius-md)' }}>
                                    <DeleteIcon fontSize="small" />
                                </IconButton>
                            </Tooltip>
                        </Box>
                    </Paper>

                    <TabContext value={value}>
                        <Paper sx={{ borderRadius: 'var(--border-radius-xl)', overflow: 'hidden' }}>
                            <Box sx={{ borderBottom: 1, borderColor: 'divider', bgcolor: 'var(--bg-paper)' }}>
                                <TabList onChange={handleChange} centered textColor="primary" indicatorColor="primary">
                                    <Tab label="Details" value="1" />
                                    <Tab label="Marks" value="3" />
                                    <Tab label="Discounts" value="4" />
                                </TabList>
                            </Box>

                            <TabPanel value="1" sx={{ p: 4 }}>
                                <StudentDetailsSection />
                            </TabPanel>
                            <TabPanel value="3" sx={{ p: 4 }}>
                                <StudentMarksSection />
                            </TabPanel>
                            <TabPanel value="4" sx={{ p: 4 }}>
                                <StudentDiscountsSection />
                            </TabPanel>
                        </Paper>
                    </TabContext>
                </>
            }
            <Popup message={message} setShowPopup={setShowPopup} showPopup={showPopup} severity={severity} />
            <ConfirmationModal
                open={confirmOpen}
                handleClose={() => setConfirmOpen(false)}
                handleConfirm={confirmDeleteHandler}
                title="Delete Student?"
                message="Are you sure you want to delete this student? This action cannot be undone."
                confirmLabel="Delete"
            />
        </Container>
    )
}

export default ViewStudent

const styles = {
    attendanceButton: {
        marginLeft: "10px",
        backgroundColor: "var(--color-primary-600)",
        "&:hover": {
            backgroundColor: "var(--color-primary-700)",
        }
    },
    styledButton: {
        backgroundColor: "var(--color-success-600)",
        "&:hover": {
            backgroundColor: "var(--color-success-700)",
        }
    }
}

const ProfileCard = styled(Box)`
                background: var(--bg-paper);
                border-radius: var(--border-radius-lg);
                padding: 2rem;
                border: 1px solid var(--border-color);
                `;