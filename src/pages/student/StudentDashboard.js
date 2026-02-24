import { useState } from 'react';
import {
    CssBaseline,
    Box,
    Toolbar,
    Typography,
    IconButton,
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import { Navigate, Route, Routes, useNavigate } from 'react-router-dom';
import StudentHomePage from './StudentHomePage';
import StudentProfile from './StudentProfile';
import StudentSubjects from './StudentSubjects';
import ViewStdAttendance from './ViewStdAttendance';
import StudentComplain from './StudentComplain';
import LogoutModal from '../../components/LogoutModal';
import TopNavBar from '../../components/TopNavBar';
import AccountMenu from '../../components/AccountMenu';
import { AppBar } from '../../components/styles';
import { useDispatch } from 'react-redux';
import { authLogout } from '../../redux/userRelated/userSlice';

// Icons for TopNavBar
import HomeIcon from '@mui/icons-material/Home';
import AnnouncementOutlinedIcon from '@mui/icons-material/AnnouncementOutlined';
import ClassOutlinedIcon from '@mui/icons-material/ClassOutlined';
import AssignmentIcon from '@mui/icons-material/Assignment';
import BreadcrumbsNav from '../../components/BreadcrumbsNav';

const StudentDashboard = () => {
    const [logoutOpen, setLogoutOpen] = useState(false);
    const navigate = useNavigate();
    const dispatch = useDispatch();

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

    const studentLinks = [
        { title: 'Home', icon: <HomeIcon />, path: '/' },
        { title: 'Subjects', icon: <AssignmentIcon />, path: '/Student/subjects' },
        { title: 'Attendance', icon: <ClassOutlinedIcon />, path: '/Student/attendance' },
        { title: 'Complain', icon: <AnnouncementOutlinedIcon />, path: '/Student/complain' },
    ];

    const [mobileOpen, setMobileOpen] = useState(false);

    const handleDrawerToggle = () => {
        setMobileOpen(!mobileOpen);
    };

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
                                    Kulluwal Campus | Student
                                </Typography>
                            </Box>
                        </Box>
                        <AccountMenu onLogout={handleLogoutOpen} />
                    </Toolbar>
                </AppBar>

                <Box component="main" sx={styles.boxStyled}>
                    <Toolbar />
                    <TopNavBar links={studentLinks} title="Student Dashboard" />
                    <Box sx={{
                        flex: 1,
                        overflow: 'auto',
                        background: 'var(--bg-body)',
                        px: { xs: 2, sm: 3, md: 4 }, // Horizontal padding
                        pb: { xs: 2, sm: 3, md: 4 }, // Bottom padding
                    }}>
                        <BreadcrumbsNav />
                        <Box sx={{ pt: 1 }}> {/* Small buffer after sticky breadcrumbs */}
                            <Routes>
                                <Route path="/" element={<StudentHomePage />} />
                                <Route path='*' element={<Navigate to="/" />} />
                                <Route path="/Student/dashboard" element={<StudentHomePage />} />
                                <Route path="/Student/profile" element={<StudentProfile />} />

                                <Route path="/Student/subjects" element={<StudentSubjects />} />
                                <Route path="/Student/attendance" element={<ViewStdAttendance />} />
                                <Route path="/Student/complain" element={<StudentComplain />} />

                                <Route path="/Student/complain" element={<StudentComplain />} />
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

export default StudentDashboard

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