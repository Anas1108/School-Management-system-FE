import { Container, Grid, Paper, Box, Typography } from '@mui/material'
import SeeNotice from '../../components/SeeNotice';
import styled from 'styled-components';
import CountUp from 'react-countup';
import { useDispatch, useSelector } from 'react-redux';
import { useEffect } from 'react';
import { getAllSclasses } from '../../redux/sclassRelated/sclassHandle';
import { getAllStudents } from '../../redux/studentRelated/studentHandle';
import { getAllTeachers } from '../../redux/teacherRelated/teacherHandle';
import StudentsIcon from "@mui/icons-material/Group";
import ClassesIcon from "@mui/icons-material/Class";
import TeachersIcon from "@mui/icons-material/SupervisorAccount";
import FeesIcon from "@mui/icons-material/MonetizationOn";

const AdminHomePage = () => {
    const dispatch = useDispatch();
    const { studentsList } = useSelector((state) => state.student);
    const { sclassesList } = useSelector((state) => state.sclass);
    const { teachersList } = useSelector((state) => state.teacher);

    const { currentUser } = useSelector(state => state.user)

    const adminID = currentUser._id

    useEffect(() => {
        dispatch(getAllStudents(adminID));
        dispatch(getAllSclasses(adminID, "Sclass"));
        dispatch(getAllTeachers(adminID));
    }, [adminID, dispatch]);

    const numberOfStudents = studentsList && studentsList.length;
    const numberOfClasses = sclassesList && sclassesList.length;
    const numberOfTeachers = teachersList && teachersList.length;

    return (
        <Container maxWidth="lg" sx={{ mt: 2, mb: 4 }}>
            <Grid container spacing={3}>
                <Grid item xs={12} md={3} lg={3}>
                    <StatCard elevation={3}>
                        <IconWrapper bgcolor="var(--color-primary-100)" color="var(--color-primary-600)">
                            <StudentsIcon fontSize="inherit" />
                        </IconWrapper>
                        <ContentWrapper>
                            <StyledCountUp start={0} end={numberOfStudents} duration={2.5} />
                            <Title>Total Students</Title>
                        </ContentWrapper>
                    </StatCard>
                </Grid>
                <Grid item xs={12} md={3} lg={3}>
                    <StatCard elevation={3}>
                        <IconWrapper bgcolor="var(--color-secondary-100)" color="var(--color-secondary-600)">
                            <ClassesIcon fontSize="inherit" />
                        </IconWrapper>
                        <ContentWrapper>
                            <StyledCountUp start={0} end={numberOfClasses} duration={4} />
                            <Title>Total Classes</Title>
                        </ContentWrapper>
                    </StatCard>
                </Grid>
                <Grid item xs={12} md={3} lg={3}>
                    <StatCard elevation={3}>
                        <IconWrapper bgcolor="#fee2e2" color="#dc2626">
                            <TeachersIcon fontSize="inherit" />
                        </IconWrapper>
                        <ContentWrapper>
                            <StyledCountUp start={0} end={numberOfTeachers} duration={2.5} />
                            <Title>Total Teachers</Title>
                        </ContentWrapper>
                    </StatCard>
                </Grid>
                <Grid item xs={12} md={3} lg={3}>
                    <StatCard elevation={3}>
                        <IconWrapper bgcolor="#dbeafe" color="#2563eb">
                            <FeesIcon fontSize="inherit" />
                        </IconWrapper>
                        <ContentWrapper>
                            <StyledCountUp start={0} end={23000} duration={2.5} prefix="$" />
                            <Title>Fees Collection</Title>
                        </ContentWrapper>
                    </StatCard>
                </Grid>
                <Grid item xs={12} md={12} lg={12}>
                    <Paper sx={{
                        p: 3,
                        display: 'flex',
                        flexDirection: 'column',
                        borderRadius: 'var(--border-radius-xl)',
                        boxShadow: 'var(--shadow-sm)',
                        border: '1px solid var(--border-color)',
                        background: 'var(--bg-paper)'
                    }}>
                        <SeeNotice />
                    </Paper>
                </Grid>
            </Grid>
        </Container>
    );
};

const StatCard = styled(Paper)`
  && {
    padding: 24px;
    display: flex;
    align-items: center;
    height: 140px;
    border-radius: var(--border-radius-xl);
    background: var(--bg-paper);
    box-shadow: var(--shadow-sm);
    border: 1px solid var(--border-color);
    transition: all 0.3s ease;
    
    &:hover {
      transform: translateY(-5px);
      box-shadow: var(--shadow-lg);
    }
  }
`;

const IconWrapper = styled.div`
  width: 60px;
  height: 60px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 2rem;
  background-color: ${props => props.bgcolor};
  color: ${props => props.color};
  margin-right: 20px;
`;

const ContentWrapper = styled.div`
  display: flex;
  flex-direction: column;
`;

const Title = styled.p`
  font-size: 0.95rem;
  color: var(--text-secondary);
  margin: 0;
  font-weight: 500;
`;

const StyledCountUp = styled(CountUp)`
  font-size: 2rem;
  color: var(--text-primary);
  font-weight: 700;
  font-family: var(--font-family-heading);
`;

export default AdminHomePage