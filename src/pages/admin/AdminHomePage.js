import React, { useEffect } from 'react'
import { Container, Grid, Paper, Box, Typography, Button, LinearProgress, List, ListItem, ListItemText, Divider } from '@mui/material'
import { useDispatch, useSelector } from 'react-redux';
import { getAllSclasses } from '../../redux/sclassRelated/sclassHandle';
import { getAllStudents } from '../../redux/studentRelated/studentHandle';
import { getAllTeachers } from '../../redux/teacherRelated/teacherHandle';
import { getAllNotices } from '../../redux/noticeRelated/noticeHandle';
import styled from 'styled-components';
import CountUp from 'react-countup';
import { useNavigate } from 'react-router-dom';
import StudentsIcon from "@mui/icons-material/Group";
import ClassesIcon from "@mui/icons-material/Class";
import TeachersIcon from "@mui/icons-material/SupervisorAccount";
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import NotificationsActiveIcon from '@mui/icons-material/NotificationsActive';
import EventIcon from '@mui/icons-material/Event';

const NoticeList = () => {
  const dispatch = useDispatch();
  const { currentUser } = useSelector(state => state.user);
  const { noticesList, loading } = useSelector((state) => state.notice);

  useEffect(() => {
    dispatch(getAllNotices(currentUser._id, "Notice"));
  }, [dispatch, currentUser._id]);

  if (loading) return <Box sx={{ p: 3 }}><LinearProgress /></Box>;

  return (
    <List sx={{ p: 0 }}>
      {noticesList && noticesList.length > 0 ? (
        noticesList.map((notice, index) => (
          <React.Fragment key={notice._id}>
            <ListItem alignItems="flex-start" sx={{ py: 2, px: 2.5, '&:hover': { background: 'var(--color-gray-50)' } }}>
              <Box sx={{
                mr: 2,
                mt: 0.5,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: 32,
                height: 32,
                borderRadius: '50%',
                background: 'var(--color-primary-50)',
                color: 'var(--color-primary-600)'
              }}>
                <NotificationsActiveIcon sx={{ fontSize: '1.2rem' }} />
              </Box>
              <ListItemText
                primary={
                  <Typography variant="subtitle2" sx={{ fontWeight: 700, color: 'var(--text-primary)' }}>
                    {notice.title}
                  </Typography>
                }
                secondary={
                  <Box sx={{ mt: 0.5 }}>
                    <Typography variant="body2" sx={{ color: 'var(--text-secondary)', mb: 1, lineBreak: 'anywhere' }}>
                      {notice.details}
                    </Typography>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                      <EventIcon sx={{ fontSize: '0.8rem', color: 'var(--text-tertiary)' }} />
                      <Typography variant="caption" sx={{ color: 'var(--text-tertiary)', fontWeight: 600 }}>
                        {new Date(notice.date).toLocaleDateString(undefined, { day: 'numeric', month: 'short', year: 'numeric' })}
                      </Typography>
                    </Box>
                  </Box>
                }
              />
            </ListItem>
            {index < noticesList.length - 1 && <Divider component="li" sx={{ opacity: 0.6 }} />}
          </React.Fragment>
        ))
      ) : (
        <Box sx={{ p: 4, textAlign: 'center' }}>
          <Typography variant="body2" color="textSecondary">No recent notices available.</Typography>
        </Box>
      )}
    </List>
  );
};

const AdminHomePage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
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
    <Container maxWidth="xl" sx={{ mt: 0, mb: 2, px: { xs: 2, md: 3 } }}>
      <Grid container spacing={2}>
        {/* Welcome Hero Section - More Compact */}
        <Grid item xs={12}>
          <WelcomeHero>
            <HeroContent>
              <Typography variant="h5" sx={{ fontWeight: 800, color: 'white', mb: 0.5, fontFamily: 'var(--font-family-heading)' }}>
                Welcome, {currentUser.name}!
              </Typography>
              <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.8)', mb: 2, maxWidth: '500px' }}>
                Manage your school efficiently with real-time updates and insights.
              </Typography>
              <Box sx={{ display: 'flex', gap: 1.5 }}>
                <HeroButton
                  variant="contained"
                  size="small"
                  onClick={() => navigate('/Admin/reports')}
                >
                  View Reports
                </HeroButton>
                <HeroButtonSecondary
                  variant="outlined"
                  size="small"
                  onClick={() => navigate('/Admin/classes')}
                >
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

        {/* Stats Section - Clickable & Clean */}
        <Grid container item xs={12} spacing={2}>
          {[
            { label: 'Total Students', value: numberOfStudents, icon: <StudentsIcon />, class: 'icon-students', color: 'primary', link: '/Admin/students' },
            { label: 'Total Classes', value: numberOfClasses, icon: <ClassesIcon />, class: 'icon-classes', color: 'success', link: '/Admin/classes' },
            { label: 'Total Teachers', value: numberOfTeachers, icon: <TeachersIcon />, class: 'icon-teachers', color: 'warning', link: '/Admin/teachers' },
          ].map((stat, index) => (
            <Grid item xs={12} sm={4} key={index}>
              <StatCard
                elevation={0}
                onClick={() => navigate(stat.link)}
                sx={{ cursor: 'pointer' }}
              >
                <IconContainer className={stat.class}>
                  {stat.icon}
                </IconContainer>
                <StatInfo>
                  <div className="label">{stat.label}</div>
                  <div className="value">
                    <CountUp start={0} end={stat.value} duration={2} />
                  </div>
                  <Box sx={{ display: 'flex', alignItems: 'center', mt: 0.5 }}>
                    <Typography variant="caption" sx={{ color: 'var(--text-tertiary)', fontWeight: 600 }}>
                      View Details
                    </Typography>
                    <ArrowForwardIcon sx={{ ml: 0.5, fontSize: '0.8rem', color: 'var(--text-tertiary)' }} />
                  </Box>
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
                School Announcements
              </Typography>
              <Button
                size="small"
                sx={{ textTransform: 'none', fontWeight: 600 }}
                onClick={() => navigate('/Admin/addnotice')}
              >
                Create Notice
              </Button>
            </SectionHeader>
            <Box sx={{ p: 0 }}>
              <NoticeList />
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
    padding: 20px;
    display: flex;
    align-items: center;
    gap: 20px;
    border-radius: var(--border-radius-xl);
    background: var(--bg-paper);
    border: 1px solid var(--border-color);
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    height: 100%;
    position: relative;
    overflow: hidden;
    
    &::after {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: linear-gradient(135deg, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0) 100%);
      opacity: 0;
      transition: opacity 0.3s ease;
    }
    
    &:hover {
      transform: translateY(-6px);
      box-shadow: var(--shadow-xl);
      border-color: var(--color-primary-400);
      
      &::after {
        opacity: 1;
      }

      .icon-box {
        transform: scale(1.1);
      }
    }
  }
`;

const IconContainer = styled.div.attrs({ className: 'icon-box' })`
  width: 52px;
  height: 52px;
  min-width: 52px;
  border-radius: var(--border-radius-lg);
  display: flex;
  align-items: center;
  justify-content: center;
  transition: transform 0.3s ease;
  
  svg {
    font-size: 1.8rem;
  }
  
  &.icon-students { background: #eff6ff; color: #2563eb; }
  &.icon-classes { background: #ecfdf5; color: #059669; }
  &.icon-teachers { background: #fff7ed; color: #d97706; }
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
