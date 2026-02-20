import { useState, useEffect } from 'react';
import {
    CssBaseline,
    Box,
    Toolbar,
    List,
    Typography,
    Divider,
    IconButton,
    useMediaQuery,
    useTheme,
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import TeacherSideBar from './TeacherSideBar';
import { Navigate, Route, Routes, useLocation, useNavigate } from 'react-router-dom';
import LogoutModal from '../../components/LogoutModal';
import AccountMenu from '../../components/AccountMenu';
import { AppBar, Drawer } from '../../components/styles';
import StudentAttendance from '../admin/studentRelated/StudentAttendance';
import { useDispatch } from 'react-redux';
import { authLogout } from '../../redux/userRelated/userSlice';

import TeacherClassDetails from './TeacherClassDetails';
import TeacherComplain from './TeacherComplain';
import TeacherHomePage from './TeacherHomePage';
import TeacherProfile from './TeacherProfile';
import TeacherViewStudent from './TeacherViewStudent';
import StudentExamMarks from '../admin/studentRelated/StudentExamMarks';
import BreadcrumbsNav from '../../components/BreadcrumbsNav';

const TeacherDashboard = () => {
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('md'));
    const [open, setOpen] = useState(!isMobile);
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

    // Toggle drawer
    const toggleDrawer = () => {
        setOpen(!open);
    };

    // Auto-close overlay drawer on route change
    const location = useLocation();
    useEffect(() => {
        if (isMobile && open) {
            setOpen(false);
        }
    }, [location.pathname, isMobile, open]);

    return (
        <>
            <Box sx={{ display: 'flex', height: '100vh', overflow: 'hidden' }}>
                <CssBaseline />
                <AppBar open={open} position='absolute'>
                    <Toolbar sx={{ pr: '24px' }}>
                        <IconButton
                            edge="start"
                            color="inherit"
                            aria-label="open drawer"
                            onClick={toggleDrawer}
                            sx={{
                                marginRight: '36px',
                                ...(open && !isMobile && { display: 'none' }),
                            }}
                        >
                            <MenuIcon />
                        </IconButton>
                        <Typography
                            component="h1"
                            variant="h6"
                            color="inherit"
                            noWrap
                            sx={{ flexGrow: 1 }}
                        >
                            Teacher Dashboard
                        </Typography>
                        <AccountMenu onLogout={handleLogoutOpen} />
                    </Toolbar>
                </AppBar>
                <Drawer
                    variant={isMobile ? "temporary" : "permanent"}
                    open={open}
                    onClose={toggleDrawer}
                    sx={styles.drawerStyled}
                    PaperProps={{
                        sx: {
                            backgroundColor: 'var(--bg-paper)',
                            width: isMobile ? '260px' : undefined
                        }
                    }}
                >
                    <Toolbar sx={styles.toolBarStyled}>
                        <IconButton onClick={toggleDrawer}>
                            <ChevronLeftIcon />
                        </IconButton>
                    </Toolbar>
                    <Divider />
                    <List component="nav" sx={{ flex: 1, overflow: 'hidden' }}>
                        <TeacherSideBar onLogout={handleLogoutOpen} />
                    </List>
                </Drawer>
                <Box component="main" sx={styles.boxStyled}>
                    <Toolbar />
                    <Box sx={{
                        flex: 1,
                        overflow: 'hidden',
                        background: 'var(--bg-body)',
                        p: { xs: 2, sm: 3, md: 4 } // Responsive padding
                    }}>
                        <BreadcrumbsNav />
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
    },
    drawerStyled: {
        display: "flex"
    },
}