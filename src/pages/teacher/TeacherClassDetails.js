import { useEffect } from "react";
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom'
import { getClassStudents } from "../../redux/sclassRelated/sclassHandle";
import { Box, Typography, Tooltip, Container } from '@mui/material';
import { ActionIconButtonPrimary, ActionIconButtonSuccess, ActionIconButtonInfo } from "../../components/buttonStyles";
import TableTemplate from "../../components/TableTemplate";
import VisibilityOutlinedIcon from '@mui/icons-material/VisibilityOutlined';
import EventAvailableOutlinedIcon from '@mui/icons-material/EventAvailableOutlined';
import GradeOutlinedIcon from '@mui/icons-material/GradeOutlined';

const TeacherClassDetails = () => {
    const navigate = useNavigate()
    const dispatch = useDispatch();
    const { sclassStudents, loading, error, getresponse } = useSelector((state) => state.sclass);

    const { currentUser } = useSelector((state) => state.user);
    const classID = currentUser.teachSclass?._id
    const subjectID = currentUser.teachSubject?._id

    useEffect(() => {
        dispatch(getClassStudents(classID));
    }, [dispatch, classID])

    if (error) {
        console.log(error)
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
                        onClick={() => navigate("/Teacher/class/student/" + row.id)}>
                        <VisibilityOutlinedIcon />
                    </ActionIconButtonPrimary>
                </Tooltip>
                <Tooltip title="Take Attendance" arrow>
                    <ActionIconButtonSuccess
                        onClick={() => navigate(`/Teacher/class/student/attendance/${row.id}/${subjectID}`)}>
                        <EventAvailableOutlinedIcon />
                    </ActionIconButtonSuccess>
                </Tooltip>
                <Tooltip title="Provide Marks" arrow>
                    <ActionIconButtonInfo
                        onClick={() => navigate(`/Teacher/class/student/marks/${row.id}/${subjectID}`)}>
                        <GradeOutlinedIcon />
                    </ActionIconButtonInfo>
                </Tooltip>
            </>
        );
    };

    return (
        <>
            {loading ? (
                <div>Loading...</div>
            ) : (
                <>
                    <Typography variant="h4" align="center" gutterBottom>
                        Class Details
                    </Typography>
                    {getresponse ? (
                        <>
                            <Box sx={{ display: 'flex', justifyContent: 'flex-end', marginTop: '16px' }}>
                                No Students Found
                            </Box>
                        </>
                    ) : (
                        <Container maxWidth={false} sx={{ mt: 2, mb: 2 }}>
                            <Typography variant="h5" gutterBottom>
                                Students List:
                            </Typography>

                            {Array.isArray(sclassStudents) && sclassStudents.length > 0 &&
                                <TableTemplate buttonHaver={StudentsButtonHaver} columns={studentColumns} rows={studentRows} />
                            }
                        </Container>
                    )}
                </>
            )}
        </>
    );
};

export default TeacherClassDetails;