import { Container, Grid, Paper, Box, Typography, Button, LinearProgress } from '@mui/material'
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
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';

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
    <Container maxWidth="xl" sx={{ mt: 2, mb: 2, px: { xs: 2, md: 3 } }}>
      <Grid container spacing={2}>
        {/* Welcome Hero Section - More Compact */}
        <Grid item xs={12}>
          <WelcomeHero>
            <HeroContent>
              <Typography variant="h5" sx={{ fontWeight: 800, color: 'white', mb: 0.5, fontFamily: 'var(--font-family-heading)' }}>
                Welcome, {currentUser.name}! 👋
              </Typography>
              <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.8)', mb: 2, maxWidth: '500px' }}>
                Manage your school efficiently with real-time updates and insights.
              </Typography>
              <Box sx={{ display: 'flex', gap: 1.5 }}>
                <HeroButton variant="contained" size="small">
                  View Reports
                </HeroButton>
                <HeroButtonSecondary variant="outlined" size="small">
                  Manage Classes <ArrowForwardIcon sx={{ ml: 0.5, fontSize: '0.9rem' }} />
                </HeroButtonSecondary>
              </Box>
            </HeroContent>
            <HeroIllustration>
              <Box className="circle circle-1" />
              <Box className="circle circle-2" />
            </HeroIllustration>
          </WelcomeHero>
        </Grid>

        {/* Stats Section - Smaller Cards */}
        <Grid container item xs={12} spacing={2}>
          {[
            { label: 'Total Students', value: numberOfStudents, icon: <StudentsIcon />, class: 'icon-students', trend: '+5%', color: 'positive' },
            { label: 'Total Classes', value: numberOfClasses, icon: <ClassesIcon />, class: 'icon-classes', trend: 'Stable', color: '' },
            { label: 'Total Teachers', value: numberOfTeachers, icon: <TeachersIcon />, class: 'icon-teachers', trend: '+2 new', color: 'positive' },
            { label: 'Fees Collection', value: 23000, icon: <FeesIcon />, class: 'icon-fees', trend: '-3%', color: 'negative', prefix: 'Rs. ' },
          ].map((stat, index) => (
            <Grid item xs={12} sm={6} md={3} key={index}>
              <StatCard elevation={0}>
                <IconContainer className={stat.class}>
                  {stat.icon}
                </IconContainer>
                <StatInfo>
                  <div className="label">{stat.label}</div>
                  <div className="value">
                    <CountUp start={0} end={stat.value} duration={2} prefix={stat.prefix || ''} />
                  </div>
                  <div className={`trend ${stat.color}`}>{stat.trend}</div>
                </StatInfo>
              </StatCard>
            </Grid>
          ))}
        </Grid>

        {/* Main Content Areas - Better balanced */}
        <Grid item xs={12} lg={9}>
          <SectionPaper elevation={0}>
            <SectionHeader>
              <Typography variant="subtitle1" sx={{ fontWeight: 700, fontFamily: 'var(--font-family-heading)' }}>
                Recent Notices & Updates
              </Typography>
              <Button size="small" sx={{ textTransform: 'none', fontWeight: 600 }}>
                View All
              </Button>
            </SectionHeader>
            <Box sx={{ p: 1.5 }}>
              <SeeNotice />
            </Box>
          </SectionPaper>
        </Grid>

        <Grid item xs={12} lg={3}>
          <SectionPaper elevation={0}>
            <SectionHeader>
              <Typography variant="subtitle1" sx={{ fontWeight: 700, fontFamily: 'var(--font-family-heading)' }}>
                Key Performance
              </Typography>
            </SectionHeader>
            <Box sx={{ p: 2, display: 'flex', flexDirection: 'column', gap: 2 }}>
              <QuickStatItem>
                <div className="header">
                  <span className="label">Attendance</span>
                  <span className="percentage">85%</span>
                </div>
                <StyledLinearProgress variant="determinate" value={85} color="primary" />
              </QuickStatItem>
              <QuickStatItem>
                <div className="header">
                  <span className="label">Syllabus</span>
                  <span className="percentage">60%</span>
                </div>
                <StyledLinearProgress variant="determinate" value={60} sx={{ '& .MuiLinearProgress-bar': { backgroundColor: 'var(--color-secondary-500)' } }} />
              </QuickStatItem>
              <QuickStatItem>
                <div className="header">
                  <span className="label">Punctuality</span>
                  <span className="percentage">92%</span>
                </div>
                <StyledLinearProgress variant="determinate" value={92} sx={{ '& .MuiLinearProgress-bar': { backgroundColor: 'var(--color-success)' } }} />
              </QuickStatItem>
            </Box>
          </SectionPaper>
        </Grid>
      </Grid>
    </Container>
  );
};

/* Styled Components - Compact Versions */

const WelcomeHero = styled.div`
  background: var(--gradient-primary);
  border-radius: var(--border-radius-lg);
  padding: 24px 32px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  position: relative;
  overflow: hidden;
  box-shadow: var(--shadow-md);
  min-height: 140px;

  @media (max-width: 900px) {
    flex-direction: column;
    text-align: center;
    padding: 24px 20px;
    align-items: center;
    gap: 16px;
  }
`;

const HeroContent = styled.div`
  position: relative;
  z-index: 2;
`;

const HeroIllustration = styled.div`
  position: absolute;
  right: 0;
  top: 0;
  width: 30%;
  height: 100%;
  z-index: 1;

  .circle {
    position: absolute;
    border-radius: 50%;
    background: rgba(255, 255, 255, 0.08);
  }

  .circle-1 {
    width: 200px;
    height: 200px;
    top: -60px;
    right: -40px;
  }

  .circle-2 {
    width: 120px;
    height: 120px;
    bottom: -30px;
    right: 80px;
  }

  @media (max-width: 900px) {
    display: none;
  }
`;

const HeroButton = styled(Button)`
  && {
    background: white;
    color: var(--color-primary-700);
    padding: 6px 18px;
    border-radius: var(--border-radius-md);
    font-weight: 700;
    text-transform: none;
    
    &:hover {
      background: var(--color-primary-50);
      transform: translateY(-1px);
    }
  }
`;

const HeroButtonSecondary = styled(Button)`
  && {
    border-color: rgba(255, 255, 255, 0.4);
    color: white;
    padding: 6px 18px;
    border-radius: var(--border-radius-md);
    font-weight: 600;
    text-transform: none;
    
    &:hover {
      border-color: white;
      background: rgba(255, 255, 255, 0.1);
      transform: translateY(-1px);
    }
  }
`;

const StatCard = styled(Paper)`
  && {
    padding: 16px;
    display: flex;
    align-items: center;
    gap: 16px;
    border-radius: var(--border-radius-lg);
    background: var(--bg-paper);
    border: 1px solid var(--border-color);
    transition: all 0.2s ease;
    height: 100%;
    
    &:hover {
      transform: translateY(-4px);
      box-shadow: var(--shadow-lg);
      border-color: var(--color-primary-200);
    }
  }
`;

const IconContainer = styled.div`
  width: 40px;
  height: 40px;
  min-width: 40px;
  border-radius: var(--border-radius-md);
  display: flex;
  align-items: center;
  justify-content: center;
  
  svg {
    font-size: 1.5rem;
  }
  
  &.icon-students { background: #eef2ff; color: #4f46e5; }
  &.icon-classes { background: #ecfdf5; color: #10b981; }
  &.icon-teachers { background: #fff7ed; color: #f59e0b; }
  &.icon-fees { background: #fdf2f8; color: #db2777; }
`;

const StatInfo = styled.div`
  display: flex;
  flex-direction: column;

  .label {
    font-size: 0.75rem;
    font-weight: 600;
    color: var(--text-secondary);
    text-transform: uppercase;
    letter-spacing: 0.5px;
  }
  
  .value {
    font-size: 1.4rem;
    font-weight: 800;
    color: var(--text-primary);
    font-family: var(--font-family-heading);
    line-height: 1.1;
  }
  
  .trend {
    font-size: 0.7rem;
    font-weight: 600;
    color: var(--text-tertiary);
    
    &.positive { color: var(--color-success); }
    &.negative { color: var(--color-error); }
  }
`;

const SectionPaper = styled(Paper)`
  && {
    border-radius: var(--border-radius-lg);
    background: var(--bg-paper);
    border: 1px solid var(--border-color);
    overflow: hidden;
    height: 100%;
  }
`;

const SectionHeader = styled(Box)`
  padding: 12px 20px;
  border-bottom: 1px solid var(--border-color);
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: var(--color-gray-50);
`;

const QuickStatItem = styled.div`
  display: flex;
  flex-direction: column;
  gap: 6px;

  .header {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  .label {
    font-size: 0.8rem;
    font-weight: 600;
    color: var(--text-secondary);
  }

  .percentage {
    font-size: 0.8rem;
    font-weight: 700;
    color: var(--text-primary);
  }
`;

const StyledLinearProgress = styled(LinearProgress)`
  && {
    height: 6px;
    border-radius: 3px;
    background-color: var(--color-gray-100);
  }
`;

export default AdminHomePage;
