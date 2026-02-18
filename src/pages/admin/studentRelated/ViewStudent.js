import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getUserDetails, updateUser } from '../../../redux/userRelated/userHandle';
import { deleteUser } from '../../../redux/userRelated/userHandle';
import { useNavigate, useParams } from 'react-router-dom'
import { getSubjectList } from '../../../redux/sclassRelated/sclassHandle';
import { Box, Button, Collapse, IconButton, Table, TableBody, TableHead, Typography, Tab, Paper, BottomNavigation, BottomNavigationAction, Container, Grid, Avatar } from '@mui/material';
import TabContext from '@mui/lab/TabContext';
import TabList from '@mui/lab/TabList';
import TabPanel from '@mui/lab/TabPanel';
import { KeyboardArrowUp, KeyboardArrowDown, Delete as DeleteIcon } from '@mui/icons-material';
import { removeStuff, updateStudentFields } from '../../../redux/studentRelated/studentHandle';
import { calculateOverallAttendancePercentage, calculateSubjectAttendancePercentage, groupAttendanceBySubject } from '../../../components/attendanceCalculator';
import CustomBarChart from '../../../components/CustomBarChart'
import CustomPieChart from '../../../components/CustomPieChart'
import { StyledTableCell, StyledTableRow } from '../../../components/styles';

import InsertChartIcon from '@mui/icons-material/InsertChart';
import InsertChartOutlinedIcon from '@mui/icons-material/InsertChartOutlined';
import TableChartIcon from '@mui/icons-material/TableChart';
import TableChartOutlinedIcon from '@mui/icons-material/TableChartOutlined';
import Popup from '../../../components/Popup';
import styled from 'styled-components';
import ConfirmationModal from '../../../components/ConfirmationModal';
import CustomLoader from '../../../components/CustomLoader';

const ViewStudent = () => {
    const navigate = useNavigate()
    const params = useParams()
    const dispatch = useDispatch()
    const { userDetails, response, loading, error } = useSelector((state) => state.user);

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
    const [studentSchool, setStudentSchool] = useState('');
    const [subjectMarks, setSubjectMarks] = useState('');
    const [subjectAttendance, setSubjectAttendance] = useState([]);

    const [openStates, setOpenStates] = useState({});

    const [showPopup, setShowPopup] = useState(false);
    const [message, setMessage] = useState("");
    const [severity, setSeverity] = useState("success");

    // Confirmation Modal State
    const [confirmOpen, setConfirmOpen] = useState(false);

    const handleOpen = (subId) => {
        setOpenStates((prevState) => ({
            ...prevState,
            [subId]: !prevState[subId],
        }));
    };

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
            setStudentSchool(userDetails.school || '');
            setSubjectMarks(userDetails.examResult || '');
            setSubjectAttendance(userDetails.attendance || []);
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

    const removeHandler = (id, deladdress) => {
        dispatch(removeStuff(id, deladdress))
            .then(() => {
                dispatch(getUserDetails(studentID, address));
            })
    }

    const removeSubAttendance = (subId) => {
        dispatch(updateStudentFields(studentID, { subId }, "RemoveStudentSubAtten"))
            .then(() => {
                dispatch(getUserDetails(studentID, address));
            })
    }

    const overallAttendancePercentage = calculateOverallAttendancePercentage(subjectAttendance);
    const overallAbsentPercentage = 100 - overallAttendancePercentage;

    const chartData = [
        { name: 'Present', value: overallAttendancePercentage },
        { name: 'Absent', value: overallAbsentPercentage }
    ];

    const subjectData = Object.entries(groupAttendanceBySubject(subjectAttendance)).map(([subName, { subCode, present, sessions }]) => {
        const subjectAttendancePercentage = calculateSubjectAttendancePercentage(present, sessions);
        return {
            subject: subName,
            attendancePercentage: subjectAttendancePercentage,
            totalClasses: sessions,
            attendedClasses: present
        };
    });

    const StudentAttendanceSection = () => {
        const renderTableSection = () => {
            return (
                <>
                    <Typography variant="h5" gutterBottom>Attendance</Typography>
                    <Table>
                        <TableHead>
                            <StyledTableRow>
                                <StyledTableCell>Subject</StyledTableCell>
                                <StyledTableCell>Present</StyledTableCell>
                                <StyledTableCell>Total Sessions</StyledTableCell>
                                <StyledTableCell>Attendance Percentage</StyledTableCell>
                                <StyledTableCell align="center">Actions</StyledTableCell>
                            </StyledTableRow>
                        </TableHead>
                        {Object.entries(groupAttendanceBySubject(subjectAttendance)).map(([subName, { present, allData, subId, sessions }], index) => {
                            const subjectAttendancePercentage = calculateSubjectAttendancePercentage(present, sessions);
                            return (
                                <TableBody key={index}>
                                    <StyledTableRow>
                                        <StyledTableCell>{subName}</StyledTableCell>
                                        <StyledTableCell>{present}</StyledTableCell>
                                        <StyledTableCell>{sessions}</StyledTableCell>
                                        <StyledTableCell>{subjectAttendancePercentage}%</StyledTableCell>
                                        <StyledTableCell align="center">
                                            <Button variant="contained"
                                                onClick={() => handleOpen(subId)}>
                                                {openStates[subId] ? <KeyboardArrowUp /> : <KeyboardArrowDown />}Details
                                            </Button>
                                            <IconButton onClick={() => removeSubAttendance(subId)}>
                                                <DeleteIcon color="error" />
                                            </IconButton>
                                            <Button variant="contained" sx={styles.attendanceButton}
                                                onClick={() => navigate(`/Admin/subject/student/attendance/${studentID}/${subId}`)}>
                                                Change
                                            </Button>
                                        </StyledTableCell>
                                    </StyledTableRow>
                                    <StyledTableRow>
                                        <StyledTableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={6}>
                                            <Collapse in={openStates[subId]} timeout="auto" unmountOnExit>
                                                <Box sx={{ margin: 1 }}>
                                                    <Typography variant="h6" gutterBottom component="div">
                                                        Attendance Details
                                                    </Typography>
                                                    <Table size="small" aria-label="purchases">
                                                        <TableHead>
                                                            <StyledTableRow>
                                                                <StyledTableCell>Date</StyledTableCell>
                                                                <StyledTableCell align="right">Status</StyledTableCell>
                                                            </StyledTableRow>
                                                        </TableHead>
                                                        <TableBody>
                                                            {allData.map((data, index) => {
                                                                const date = new Date(data.date);
                                                                const dateString = date.toString() !== "Invalid Date" ? date.toISOString().substring(0, 10) : "Invalid Date";
                                                                return (
                                                                    <StyledTableRow key={index}>
                                                                        <StyledTableCell component="th" scope="row">
                                                                            {dateString}
                                                                        </StyledTableCell>
                                                                        <StyledTableCell align="right">{data.status}</StyledTableCell>
                                                                    </StyledTableRow>
                                                                )
                                                            })}
                                                        </TableBody>
                                                    </Table>
                                                </Box>
                                            </Collapse>
                                        </StyledTableCell>
                                    </StyledTableRow>
                                </TableBody>
                            )
                        }
                        )}
                    </Table>
                    <Box sx={{ mt: 2 }}>
                        <Typography variant="subtitle1">Overall Attendance Percentage: {overallAttendancePercentage.toFixed(2)}%</Typography>
                    </Box>
                    <Box sx={{ mt: 2, display: 'flex', gap: 2 }}>
                        <Button variant="outlined" color="error" startIcon={<DeleteIcon />} onClick={() => removeHandler(studentID, "RemoveStudentAtten")}>Delete All</Button>
                        <Button variant="contained" sx={styles.styledButton} onClick={() => navigate("/Admin/students/student/attendance/" + studentID)}>
                            Add Attendance
                        </Button>
                    </Box>
                </>
            )
        }
        const renderChartSection = () => {
            return (
                <>
                    <CustomBarChart chartData={subjectData} dataKey="attendancePercentage" />
                </>
            )
        }
        return (
            <>
                {subjectAttendance && Array.isArray(subjectAttendance) && subjectAttendance.length > 0
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
                    <Button variant="contained" sx={styles.styledButton} onClick={() => navigate("/Admin/students/student/attendance/" + studentID)}>
                        Add Attendance
                    </Button>
                }
            </>
        )
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
                                <Typography variant="h5" component="h1" sx={{ fontWeight: 'bold' }}>
                                    {name}
                                </Typography>
                                <Typography variant="body1" color="textSecondary">
                                    Roll: {rollNum}
                                </Typography>
                                <Typography variant="body2" color="primary">
                                    Class: {sclassName?.sclassName}
                                </Typography>
                            </Box>
                        </Box>
                        <Box sx={{ display: 'flex', gap: 2 }}>
                            <Button variant="outlined" onClick={() => navigate("/Admin/students")}>
                                Back
                            </Button>
                            <Button variant="contained" color="primary" onClick={() => navigate("/Admin/students/student/edit/" + studentID)}>
                                Edit Profile
                            </Button>
                            <Button variant="outlined" color="error" onClick={deleteHandler}>
                                Delete
                            </Button>
                        </Box>
                    </Paper>

                    <TabContext value={value}>
                        <Paper sx={{ borderRadius: 'var(--border-radius-xl)', overflow: 'hidden' }}>
                            <Box sx={{ borderBottom: 1, borderColor: 'divider', bgcolor: 'var(--bg-paper)' }}>
                                <TabList onChange={handleChange} centered textColor="primary" indicatorColor="primary">
                                    <Tab label="Details" value="1" />
                                    <Tab label="Attendance" value="2" />
                                    <Tab label="Marks" value="3" />
                                </TabList>
                            </Box>

                            <TabPanel value="1" sx={{ p: 4 }}>
                                <StudentDetailsSection />
                            </TabPanel>
                            <TabPanel value="2" sx={{ p: 4 }}>
                                <StudentAttendanceSection />
                            </TabPanel>
                            <TabPanel value="3" sx={{ p: 4 }}>
                                <StudentMarksSection />
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