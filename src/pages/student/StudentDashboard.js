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
import StudentSideBar from './StudentSideBar';
import { Navigate, Route, Routes, useLocation } from 'react-router-dom';
import StudentHomePage from './StudentHomePage';
import StudentProfile from './StudentProfile';
import StudentSubjects from './StudentSubjects';
import ViewStdAttendance from './ViewStdAttendance';
import StudentComplain from './StudentComplain';
import Logout from '../Logout'
import AccountMenu from '../../components/AccountMenu';
import { AppBar, Drawer } from '../../components/styles';
import BreadcrumbsNav from '../../components/BreadcrumbsNav';

const StudentDashboard = () => {
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('md'));
    const [open, setOpen] = useState(!isMobile);

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
    }, [location.pathname]);

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
                            Student Dashboard
                        </Typography>
                        <AccountMenu />
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
                        <StudentSideBar />
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
                            <Route path="/" element={<StudentHomePage />} />
                            <Route path='*' element={<Navigate to="/" />} />
                            <Route path="/Student/dashboard" element={<StudentHomePage />} />
                            <Route path="/Student/profile" element={<StudentProfile />} />

                            <Route path="/Student/subjects" element={<StudentSubjects />} />
                            <Route path="/Student/attendance" element={<ViewStdAttendance />} />
                            <Route path="/Student/complain" element={<StudentComplain />} />

                            <Route path="/logout" element={<Logout />} />
                        </Routes>
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
    },
    drawerStyled: {
        display: "flex"
    },
}