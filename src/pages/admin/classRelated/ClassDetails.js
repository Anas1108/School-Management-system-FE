import { useEffect, useState } from "react";
import axios from 'axios';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom'
import { getClassDetails, getClassStudents, getSubjectList } from "../../../redux/sclassRelated/sclassHandle";

import {
    Box, Container, Typography, Tab, Paper, Grid, Tooltip, IconButton,
    Dialog, DialogTitle, DialogContent, DialogActions, Button
} from '@mui/material';
import TabContext from '@mui/lab/TabContext';
import TabList from '@mui/lab/TabList';
import TabPanel from '@mui/lab/TabPanel';

import { GreenButton, ActionIconButtonPrimary, ActionIconButtonError, ActionIconButtonSuccess } from "../../../components/buttonStyles";
import TableTemplate from "../../../components/TableTemplate";
import AddIcon from '@mui/icons-material/Add';
import VisibilityOutlinedIcon from '@mui/icons-material/VisibilityOutlined';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import PersonSearchIcon from '@mui/icons-material/PersonSearch';
import ChangeCircleIcon from '@mui/icons-material/ChangeCircle';
import Popup from "../../../components/Popup";
import styled from 'styled-components';
import CustomLoader from '../../../components/CustomLoader';
import { deleteUser } from '../../../redux/userRelated/userHandle';
import { resetSubjects } from '../../../redux/sclassRelated/sclassSlice';

const ClassDetails = () => {
    const params = useParams()
    const navigate = useNavigate()
    const dispatch = useDispatch();
    const { subjectsList, sclassStudents, sclassDetails, loading, error, response, getresponse } = useSelector((state) => state.sclass);
    const { currentUser } = useSelector(state => state.user);

    const classID = params.id

    const [classTeachers, setClassTeachers] = useState([]);
    const [teachersLoading, setTeachersLoading] = useState(false);

    useEffect(() => {
        dispatch(getClassDetails(classID, "Sclass"));
        dispatch(getSubjectList(classID, "ClassSubjects"))
        dispatch(getClassStudents(classID));
    }, [dispatch, classID])

    useEffect(() => {
        const fetchTeachers = async () => {
            setTeachersLoading(true);
            try {
                // Fetching allocations for the class. 
                // Currently defaults academic year to 2024-2025. Could be dynamic based on requirements.
                const res = await axios.get(`${process.env.REACT_APP_BASE_URL}/ClassAllocations/${classID}?schoolId=${currentUser._id}&academicYear=2024-2025`);
                if (Array.isArray(res.data)) {
                    setClassTeachers(res.data);
                } else {
                    setClassTeachers([]);
                }
            } catch (err) {
                console.error("Error fetching class teachers:", err);
                setClassTeachers([]);
            } finally {
                setTeachersLoading(false);
            }
        };

        if (currentUser && currentUser._id && classID) {
            fetchTeachers();
        }
    }, [classID, currentUser]);

    if (error) {
        console.log(error)
    }

    const [value, setValue] = useState('1');

    const handleChange = (event, newValue) => {
        setValue(newValue);
    };

    const [showPopup, setShowPopup] = useState(false);
    const [message, setMessage] = useState("");

    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [itemToDelete, setItemToDelete] = useState(null);
    const [actionLoading, setActionLoading] = useState(false);

    const deleteHandler = (deleteID, address) => {
        setItemToDelete({ id: deleteID, address });
        setDeleteDialogOpen(true);
    };

    const confirmDelete = () => {
        if (!itemToDelete) return;
        setActionLoading(true);
        dispatch(deleteUser(itemToDelete.id, itemToDelete.address))
            .then(() => {
                if (itemToDelete.address === "Subject") {
                    dispatch(resetSubjects());
                    dispatch(getSubjectList(classID, "ClassSubjects"));
                } else if (itemToDelete.address === "Student") {
                    dispatch(getClassStudents(classID));
                }
                setActionLoading(false);
                setDeleteDialogOpen(false);
                setItemToDelete(null);
            })
            .catch(() => {
                setActionLoading(false);
                setDeleteDialogOpen(false);
            });
    };

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
                            <Tooltip title="Add Subject">
                                <IconButton
                                    onClick={() => navigate("/Admin/addsubject/" + classID)}
                                    sx={{
                                        bgcolor: 'var(--color-primary-600)', color: 'white',
                                        '&:hover': { bgcolor: 'var(--color-primary-700)' },
                                        borderRadius: 'var(--border-radius-md)'
                                    }}
                                >
                                    <AddIcon />
                                </IconButton>
                            </Tooltip>
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
                            <Tooltip title="Add Student">
                                <IconButton
                                    onClick={() => navigate("/Admin/class/addstudents/" + classID)}
                                    sx={{
                                        bgcolor: 'var(--color-primary-600)', color: 'white',
                                        '&:hover': { bgcolor: 'var(--color-primary-700)' },
                                        borderRadius: 'var(--border-radius-md)'
                                    }}
                                >
                                    <AddIcon />
                                </IconButton>
                            </Tooltip>
                        </Box>
                        <TableTemplate buttonHaver={StudentsButtonHaver} columns={studentColumns} rows={studentRows} />
                    </>
                )}
            </>
        )
    }

    const teacherColumns = [
        { id: 'subjectName', label: 'Subject', minWidth: 170 },
        { id: 'teacherName', label: 'Teacher', minWidth: 170 },
    ];

    const teacherRows = classTeachers.map((item) => {
        return {
            subjectName: item.subjectName,
            teacherName: item.teacherName,
            teacherId: item.teacherId,
            id: item.subjectId, // using subjectId as unique row key since it's 1-to-1 map here
        };
    });

    const TeachersButtonHaver = ({ row }) => {
        const navigate = useNavigate();

        return (
            <>
                {row.teacherId && (
                    <Tooltip title="View Teacher Profile" arrow>
                        <ActionIconButtonPrimary
                            onClick={() => navigate(`/Admin/teachers/teacher/${row.teacherId}`)}>
                            <PersonSearchIcon />
                        </ActionIconButtonPrimary>
                    </Tooltip>
                )}
                <Tooltip title="Manage Allocation" arrow>
                    <ActionIconButtonSuccess
                        onClick={() => navigate(`/Admin/subject-allocation`, { state: { classId: classID, subjectId: row.id } })}>
                        <ChangeCircleIcon />
                    </ActionIconButtonSuccess>
                </Tooltip>
            </>
        );
    };

    const ClassTeachersSection = () => {
        return (
            <Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                    <Typography variant="h5" gutterBottom sx={{ mb: 0 }}>
                        Teachers List:
                    </Typography>
                    <Box>
                        <Tooltip title="Manage Allocations">
                            <GreenButton
                                variant="contained"
                                onClick={() => navigate("/Admin/subject-allocation", { state: { classId: classID } })}
                            >
                                Manage Allocations
                            </GreenButton>
                        </Tooltip>
                    </Box>
                </Box>
                {teachersLoading ? (
                    <CustomLoader />
                ) : (
                    <TableTemplate buttonHaver={TeachersButtonHaver} columns={teacherColumns} rows={teacherRows} />
                )}
            </Box>
        );
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
                <CustomLoader />
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
            <Dialog open={deleteDialogOpen} onClose={() => setDeleteDialogOpen(false)}>
                <DialogTitle>Confirm Deletion</DialogTitle>
                <DialogContent>
                    <Typography>
                        Are you sure you want to delete this {itemToDelete?.address?.toLowerCase() || 'item'}? This action cannot be undone.
                    </Typography>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setDeleteDialogOpen(false)} disabled={actionLoading}>Cancel</Button>
                    <Button onClick={confirmDelete} color="error" variant="contained" disabled={actionLoading}>
                        {actionLoading ? "Deleting..." : "Delete"}
                    </Button>
                </DialogActions>
            </Dialog>
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