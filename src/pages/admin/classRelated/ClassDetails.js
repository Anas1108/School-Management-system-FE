import { useEffect, useState } from "react";
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom'
import { getClassDetails, getClassStudents, getSubjectList } from "../../../redux/sclassRelated/sclassHandle";

import {
    Box, Container, Typography, Tab, Paper, Grid, Tooltip, Button
} from '@mui/material';
import TabContext from '@mui/lab/TabContext';
import TabList from '@mui/lab/TabList';
import TabPanel from '@mui/lab/TabPanel';

import { GreenButton, ActionIconButtonPrimary, ActionIconButtonError, ActionIconButtonSuccess } from "../../../components/buttonStyles";
import TableTemplate from "../../../components/TableTemplate";
import AddIcon from '@mui/icons-material/Add';
import VisibilityOutlinedIcon from '@mui/icons-material/VisibilityOutlined';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import EventAvailableOutlinedIcon from '@mui/icons-material/EventAvailableOutlined';
import Popup from "../../../components/Popup";
import styled from 'styled-components';

const ClassDetails = () => {
    const params = useParams()
    const navigate = useNavigate()
    const dispatch = useDispatch();
    const { subjectsList, sclassStudents, sclassDetails, loading, error, response, getresponse } = useSelector((state) => state.sclass);

    const classID = params.id

    useEffect(() => {
        dispatch(getClassDetails(classID, "Sclass"));
        dispatch(getSubjectList(classID, "ClassSubjects"))
        dispatch(getClassStudents(classID));
    }, [dispatch, classID])

    if (error) {
        console.log(error)
    }

    const [value, setValue] = useState('1');

    const handleChange = (event, newValue) => {
        setValue(newValue);
    };

    const [showPopup, setShowPopup] = useState(false);
    const [message, setMessage] = useState("");

    const deleteHandler = (deleteID, address) => {
        console.log(deleteID);
        console.log(address);
        setMessage("Sorry the delete function has been disabled for now.")
        setShowPopup(true)
        // dispatch(deleteUser(deleteID, address))
        //     .then(() => {
        //         dispatch(getClassStudents(classID));
        //         dispatch(resetSubjects())
        //         dispatch(getSubjectList(classID, "ClassSubjects"))
        //     })
    }

    const subjectColumns = [
        { id: 'name', label: 'Subject Name', minWidth: 170 },
        { id: 'code', label: 'Subject Code', minWidth: 100 },
    ]

    const subjectRows = subjectsList && subjectsList.length > 0 && subjectsList.map((subject) => {
        return {
            name: subject.subName,
            code: subject.subCode,
            id: subject._id,
        };
    })

    const SubjectsButtonHaver = ({ row }) => {
        return (
            <>
                <Tooltip title="View" arrow>
                    <ActionIconButtonPrimary
                        onClick={() => navigate(`/Admin/class/subject/${classID}/${row.id}`)}>
                        <VisibilityOutlinedIcon />
                    </ActionIconButtonPrimary>
                </Tooltip>
                <Tooltip title="Delete" arrow>
                    <ActionIconButtonError
                        onClick={() => deleteHandler(row.id, "Subject")}>
                        <DeleteOutlineIcon />
                    </ActionIconButtonError>
                </Tooltip>
            </>
        );
    };


    const ClassSubjectsSection = () => {
        return (
            <>
                {response ?
                    <Box sx={{ display: 'flex', justifyContent: 'flex-end', marginTop: '16px' }}>
                        <GreenButton
                            variant="contained"
                            onClick={() => navigate("/Admin/addsubject/" + classID)}
                        >
                            Add Subjects
                        </GreenButton>
                    </Box>
                    :
                    <>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                            <Typography variant="h5" gutterBottom sx={{ mb: 0 }}>
                                Subjects List:
                            </Typography>
                            <Button
                                variant="contained"
                                startIcon={<AddIcon />}
                                onClick={() => navigate("/Admin/addsubject/" + classID)}
                                sx={{
                                    textTransform: 'none', fontWeight: 600, fontFamily: 'var(--font-family-sans)',
                                    borderRadius: 'var(--border-radius-md)', backgroundColor: 'var(--color-primary-600)',
                                    boxShadow: 'none', px: 2.5, whiteSpace: 'nowrap',
                                    '&:hover': { backgroundColor: 'var(--color-primary-700)', boxShadow: '0 2px 8px rgba(0,0,0,0.15)' }
                                }}
                            >
                                Add Subject
                            </Button>
                        </Box>
                        <TableTemplate buttonHaver={SubjectsButtonHaver} columns={subjectColumns} rows={subjectRows} />
                    </>
                }
            </>
        )
    }

    const studentColumns = [
        { id: 'name', label: 'Name', minWidth: 170 },
        { id: 'rollNum', label: 'Roll Number', minWidth: 100 },
    ]

    const studentRows = sclassStudents.map((student) => {
        return {
            name: student.name,
            rollNum: student.rollNum,
            id: student._id,
        };
    })

    const StudentsButtonHaver = ({ row }) => {
        return (
            <>
                <Tooltip title="View" arrow>
                    <ActionIconButtonPrimary
                        onClick={() => navigate("/Admin/students/student/" + row.id)}>
                        <VisibilityOutlinedIcon />
                    </ActionIconButtonPrimary>
                </Tooltip>
                <Tooltip title="Attendance" arrow>
                    <ActionIconButtonSuccess
                        onClick={() => navigate("/Admin/students/student/attendance/" + row.id)}>
                        <EventAvailableOutlinedIcon />
                    </ActionIconButtonSuccess>
                </Tooltip>
                <Tooltip title="Delete" arrow>
                    <ActionIconButtonError
                        onClick={() => deleteHandler(row.id, "Student")}>
                        <DeleteOutlineIcon />
                    </ActionIconButtonError>
                </Tooltip>
            </>
        );
    };


    const ClassStudentsSection = () => {
        return (
            <>
                {getresponse ? (
                    <>
                        <Box sx={{ display: 'flex', justifyContent: 'flex-end', marginTop: '16px' }}>
                            <GreenButton
                                variant="contained"
                                onClick={() => navigate("/Admin/class/addstudents/" + classID)}
                            >
                                Add Students
                            </GreenButton>
                        </Box>
                    </>
                ) : (
                    <>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                            <Typography variant="h5" gutterBottom sx={{ mb: 0 }}>
                                Students List:
                            </Typography>
                            <Button
                                variant="contained"
                                startIcon={<AddIcon />}
                                onClick={() => navigate("/Admin/class/addstudents/" + classID)}
                                sx={{
                                    textTransform: 'none', fontWeight: 600, fontFamily: 'var(--font-family-sans)',
                                    borderRadius: 'var(--border-radius-md)', backgroundColor: 'var(--color-primary-600)',
                                    boxShadow: 'none', px: 2.5, whiteSpace: 'nowrap',
                                    '&:hover': { backgroundColor: 'var(--color-primary-700)', boxShadow: '0 2px 8px rgba(0,0,0,0.15)' }
                                }}
                            >
                                Add Student
                            </Button>
                        </Box>
                        <TableTemplate buttonHaver={StudentsButtonHaver} columns={studentColumns} rows={studentRows} />
                    </>
                )}
            </>
        )
    }

    const ClassTeachersSection = () => {
        return (
            <Box sx={{ textAlign: 'center', py: 4 }}>
                <Typography variant="h6" color="textSecondary">
                    Teachers section coming soon
                </Typography>
            </Box>
        )
    }

    const ClassDetailsSection = () => {
        const numberOfSubjects = subjectsList.length;
        const numberOfStudents = sclassStudents.length;

        return (
            <DetailsCard>
                <Typography variant="h4" component="h2" gutterBottom sx={{ fontWeight: 'bold', textAlign: 'center' }}>
                    {sclassDetails && sclassDetails.sclassName}
                </Typography>
                <Grid container spacing={3} sx={{ mt: 2 }}>
                    <Grid item xs={12} sm={6}>
                        <StatBox>
                            <Typography variant="h3" sx={{ fontWeight: 'bold', color: 'var(--color-primary-600)' }}>
                                {numberOfSubjects}
                            </Typography>
                            <Typography variant="subtitle1" color="textSecondary">
                                Subjects
                            </Typography>
                        </StatBox>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <StatBox>
                            <Typography variant="h3" sx={{ fontWeight: 'bold', color: 'var(--color-success-600)' }}>
                                {numberOfStudents}
                            </Typography>
                            <Typography variant="subtitle1" color="textSecondary">
                                Students
                            </Typography>
                        </StatBox>
                    </Grid>
                </Grid>
                <Box sx={{ mt: 4, display: 'flex', gap: 2, justifyContent: 'center' }}>
                    {getresponse &&
                        <GreenButton
                            variant="contained"
                            onClick={() => navigate("/Admin/class/addstudents/" + classID)}
                        >
                            Add Students
                        </GreenButton>
                    }
                    {response &&
                        <GreenButton
                            variant="contained"
                            onClick={() => navigate("/Admin/addsubject/" + classID)}
                        >
                            Add Subjects
                        </GreenButton>
                    }
                </Box>
            </DetailsCard>
        );
    }

    return (
        <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
            {loading ? (
                <div>Loading...</div>
            ) : (
                <>
                    <TabContext value={value}>
                        <Paper sx={{ borderRadius: 'var(--border-radius-xl)', overflow: 'hidden' }}>
                            <Box sx={{ borderBottom: 1, borderColor: 'divider', bgcolor: 'var(--bg-paper)' }}>
                                <TabList onChange={handleChange} centered textColor="primary" indicatorColor="primary">
                                    <Tab label="Details" value="1" />
                                    <Tab label="Subjects" value="2" />
                                    <Tab label="Students" value="3" />
                                    <Tab label="Teachers" value="4" />
                                </TabList>
                            </Box>
                            <TabPanel value="1" sx={{ p: { xs: 2, md: 4 } }}>
                                <ClassDetailsSection />
                            </TabPanel>
                            <TabPanel value="2" sx={{ p: { xs: 2, md: 4 } }}>
                                <ClassSubjectsSection />
                            </TabPanel>
                            <TabPanel value="3" sx={{ p: { xs: 2, md: 4 } }}>
                                <ClassStudentsSection />
                            </TabPanel>
                            <TabPanel value="4" sx={{ p: { xs: 2, md: 4 } }}>
                                <ClassTeachersSection />
                            </TabPanel>
                        </Paper>
                    </TabContext>
                </>
            )}
            <Popup message={message} setShowPopup={setShowPopup} showPopup={showPopup} />
        </Container>
    );
};

export default ClassDetails;

const DetailsCard = styled(Box)`
    background: var(--bg-paper);
    border-radius: var(--border-radius-lg);
    padding: 2rem;
`;

const StatBox = styled(Box)`
    text-align: center;
    padding: 2rem;
    background: var(--bg-default);
    border-radius: var(--border-radius-md);
    border: 1px solid var(--border-color);
`;