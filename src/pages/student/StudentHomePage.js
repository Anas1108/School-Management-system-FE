import React, { useEffect, useState } from 'react'
import { Container, Grid, Paper, Typography, Box } from '@mui/material'
import { useDispatch, useSelector } from 'react-redux';
import { calculateOverallAttendancePercentage } from '../../components/attendanceCalculator';
import CustomPieChart from '../../components/CustomPieChart';
import { getUserDetails } from '../../redux/userRelated/userHandle';
import styled from 'styled-components';
import SeeNotice from '../../components/SeeNotice';
import CountUp from 'react-countup';
import SubjectIcon from '@mui/icons-material/MenuBook';
import AssignmentIcon from '@mui/icons-material/Assignment';
import { getSubjectList } from '../../redux/sclassRelated/sclassHandle';

const StudentHomePage = () => {
    const dispatch = useDispatch();

    const { userDetails, currentUser, loading, response } = useSelector((state) => state.user);
    const { subjectsList } = useSelector((state) => state.sclass);

    const [subjectAttendance, setSubjectAttendance] = useState([]);

    const classID = currentUser.sclassName._id

    useEffect(() => {
        dispatch(getUserDetails(currentUser._id, "Student"));
        dispatch(getSubjectList(classID, "ClassSubjects"));
    }, [dispatch, currentUser._id, classID]);

    const numberOfSubjects = subjectsList && subjectsList.length;

    useEffect(() => {
        if (userDetails) {
            setSubjectAttendance(userDetails.attendance || []);
        }
    }, [userDetails])

    const overallAttendancePercentage = calculateOverallAttendancePercentage(subjectAttendance);
    const overallAbsentPercentage = 100 - overallAttendancePercentage;

    const chartData = [
        { name: 'Present', value: overallAttendancePercentage },
        { name: 'Absent', value: overallAbsentPercentage }
    ];

    return (
        <>
            <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
                <Typography variant="h4" sx={{ mb: 3, fontWeight: 'bold', color: 'var(--text-primary)' }}>
                    Welcome back, {currentUser.name}!
                </Typography>
                <Grid container spacing={3}>
                    <Grid item xs={12} sm={6} md={3} lg={3}>
                        <GradientCard elevation={3} $gradient="linear-gradient(135deg, #667eea 0%, #764ba2 100%)">
                            <IconWrapper>
                                <SubjectIcon sx={{ fontSize: 40, color: 'white' }} />
                            </IconWrapper>
                            <StatTitle>Total Subjects</StatTitle>
                            <StatValue start={0} end={numberOfSubjects} duration={2.5} />
                        </GradientCard>
                    </Grid>
                    <Grid item xs={12} sm={6} md={3} lg={3}>
                        <GradientCard elevation={3} $gradient="linear-gradient(135deg, #f093fb 0%, #f5576c 100%)">
                            <IconWrapper>
                                <AssignmentIcon sx={{ fontSize: 40, color: 'white' }} />
                            </IconWrapper>
                            <StatTitle>Total Assignments</StatTitle>
                            <StatValue start={0} end={15} duration={4} />
                        </GradientCard>
                    </Grid>
                    <Grid item xs={12} md={6} lg={6}>
                        <ChartCard elevation={3}>
                            <Typography variant="h6" sx={{ mb: 2, fontWeight: 'bold', color: 'var(--text-primary)' }}>
                                Attendance Overview
                            </Typography>
                            {
                                response ?
                                    <EmptyState>
                                        <Typography variant="body1" color="textSecondary">No Attendance Found</Typography>
                                    </EmptyState>
                                    :
                                    <>
                                        {loading
                                            ? (
                                                <EmptyState>
                                                    <Typography variant="body1" color="textSecondary">Loading...</Typography>
                                                </EmptyState>
                                            )
                                            :
                                            <>
                                                {
                                                    subjectAttendance && Array.isArray(subjectAttendance) && subjectAttendance.length > 0 ? (
                                                        <ChartWrapper>
                                                            <CustomPieChart data={chartData} />
                                                        </ChartWrapper>
                                                    )
                                                        :
                                                        <EmptyState>
                                                            <Typography variant="body1" color="textSecondary">No Attendance Found</Typography>
                                                        </EmptyState>
                                                }
                                            </>
                                        }
                                    </>
                            }
                        </ChartCard>
                    </Grid>
                    <Grid item xs={12}>
                        <Paper sx={{
                            p: 3,
                            borderRadius: 'var(--border-radius-lg)',
                            border: '1px solid var(--border-color)',
                            boxShadow: 'var(--shadow-sm)'
                        }}>
                            <SeeNotice />
                        </Paper>
                    </Grid>
                </Grid>
            </Container>
        </>
    )
}

export default StudentHomePage

const GradientCard = styled(Paper)`
    padding: 2rem;
    display: flex;
    flex-direction: column;
    height: 200px;
    justify-content: center;
    align-items: center;
    text-align: center;
    background: ${props => props.$gradient};
    color: white;
    border-radius: var(--border-radius-xl);
    transition: all 0.3s ease;
    
    &:hover {
        transform: translateY(-8px);
        box-shadow: var(--shadow-lg);
    }
`;

const IconWrapper = styled(Box)`
    margin-bottom: 1rem;
    opacity: 0.9;
`;

const StatTitle = styled(Typography)`
    && {
        font-size: 1rem;
        font-weight: 500;
        margin-bottom: 0.5rem;
        opacity: 0.95;
    }
`;

const StatValue = styled(CountUp)`
    font-size: 2.5rem;
    font-weight: bold;
    color: white;
`;

const ChartCard = styled(Paper)`
    padding: 2rem;
    height: 200px;
    border-radius: var(--border-radius-xl);
    border: 1px solid var(--border-color);
    background: var(--bg-paper);
`;

const ChartWrapper = styled.div`
    display: flex;
    justify-content: center;
    align-items: center;
    height: 140px;
`;

const EmptyState = styled.div`
    display: flex;
    justify-content: center;
    align-items: center;
    height: 140px;
`;