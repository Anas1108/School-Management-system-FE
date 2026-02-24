import { useState } from 'react';
import {
    CssBaseline,
    Box,
    Toolbar,
    Typography,
} from '@mui/material';
import { Navigate, Route, Routes, useNavigate } from 'react-router-dom';
import LogoutModal from '../../components/LogoutModal';
import TopNavBar from '../../components/TopNavBar';
import AccountMenu from '../../components/AccountMenu';
import { AppBar } from '../../components/styles';
import StudentAttendance from '../admin/studentRelated/StudentAttendance';
import { useDispatch, useSelector } from 'react-redux';
import { authLogout } from '../../redux/userRelated/userSlice';

// Icons for TopNavBar
import HomeIcon from '@mui/icons-material/Home';
import ClassOutlinedIcon from '@mui/icons-material/ClassOutlined';
import AnnouncementOutlinedIcon from '@mui/icons-material/AnnouncementOutlined';

import TeacherClassDetails from './TeacherClassDetails';
import TeacherComplain from './TeacherComplain';
import TeacherHomePage from './TeacherHomePage';
import TeacherProfile from './TeacherProfile';
import TeacherViewStudent from './TeacherViewStudent';
import StudentExamMarks from '../admin/studentRelated/StudentExamMarks';
import BreadcrumbsNav from '../../components/BreadcrumbsNav';

const TeacherDashboard = () => {
    const [logoutOpen, setLogoutOpen] = useState(false);
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { currentUser } = useSelector((state) => state.user);
    const sclassName = currentUser.teachSclass;

    const handleLogoutOpen = () => {
        setLogoutOpen(true);
    };

    const handleLogoutClose = () => {
        setLogoutOpen(false);
    };

    const handleLogoutConfirm = () => {
        dispatch(authLogout());
        setLogoutOpen(false);
        navigate('/');
    };

    const teacherLinks = [
        { title: 'Home', icon: <HomeIcon />, path: '/' },
        { title: `Class ${sclassName?.sclassName || ''}`, icon: <ClassOutlinedIcon />, path: '/Teacher/class' },
        { title: 'Complain', icon: <AnnouncementOutlinedIcon />, path: '/Teacher/complain' },
    ];



    return (
        <>
            <Box sx={{ display: 'flex', height: '100vh', overflow: 'hidden' }}>
                <CssBaseline />
                <AppBar position='absolute' open={false}>
                    <Toolbar sx={{ pr: '24px', display: 'flex', alignItems: 'center' }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', flexGrow: 1 }}>
                            <img
                                src="/favicon.png"
                                alt="TKS Logo"
                                style={{ height: '32px', marginRight: '12px' }}
                            />
                            <Box>
                                <Typography
                                    component="h1"
                                    variant="h6"
                                    color="var(--text-primary)"
                                    noWrap
                                    sx={{
                                        fontWeight: 700,
                                        letterSpacing: '-0.5px',
                                        lineHeight: 1.2,
                                        fontSize: { xs: '0.9rem', sm: '1.25rem' }
                                    }}
                                >
                                    The Knowledge School
                                </Typography>
                                <Typography
                                    variant="caption"
                                    sx={{
                                        color: 'var(--color-primary-600)',
                                        fontWeight: 600,
                                        display: { xs: 'none', sm: 'block' }
                                    }}
                                >
                                    Kulluwal Campus | Teacher
                                </Typography>
                            </Box>
                        </Box>
                        <AccountMenu onLogout={handleLogoutOpen} />
                    </Toolbar>
                </AppBar>

                <Box component="main" sx={styles.boxStyled}>
                    <Box sx={{ minHeight: '64px' }} />
                    <TopNavBar links={teacherLinks} title="Teacher Dashboard" />
                    <Box sx={{
                        flex: 1,
                        overflow: 'auto',
                        background: 'var(--bg-body)',
                        px: { xs: 2, sm: 3, md: 4 },
                        pb: { xs: 2, sm: 3, md: 4 },
                    }}>
                        <BreadcrumbsNav />
                        <Box sx={{ pt: 0 }}>
                            <Routes>
                                <Route path="/" element={<TeacherHomePage />} />
                                <Route path='*' element={<Navigate to="/" />} />
                                <Route path="/Teacher/dashboard" element={<TeacherHomePage />} />
                                <Route path="/Teacher/profile" element={<TeacherProfile />} />

                                <Route path="/Teacher/complain" element={<TeacherComplain />} />

                                <Route path="/Teacher/class" element={<TeacherClassDetails />} />
                                <Route path="/Teacher/class/student/:id" element={<TeacherViewStudent />} />

                                <Route path="/Teacher/class/student/attendance/:studentID/:subjectID" element={<StudentAttendance situation="Subject" />} />
                                <Route path="/Teacher/class/student/marks/:studentID/:subjectID" element={<StudentExamMarks situation="Subject" />} />

                                <Route path="/Teacher/class/student/marks/:studentID/:subjectID" element={<StudentExamMarks situation="Subject" />} />
                            </Routes>
                        </Box>
                        <LogoutModal
                            open={logoutOpen}
                            handleClose={handleLogoutClose}
                            handleLogout={handleLogoutConfirm}
                        />
                    </Box>
                </Box>
            </Box>
        </>
    );
}

export default TeacherDashboard

const styles = {
    boxStyled: {
        backgroundColor: (theme) =>
            theme.palette.mode === 'light'
                ? theme.palette.grey[100]
                : theme.palette.grey[900],
        flexGrow: 1,
        height: '100vh',
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column',
    },
    toolBarStyled: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'flex-end',
        px: [1],
    }
}