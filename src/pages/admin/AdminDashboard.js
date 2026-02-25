import { useState } from 'react';
import {
    CssBaseline,
    Box,
    Toolbar,
    Typography,
} from '@mui/material';
import { Navigate, Route, Routes, useNavigate } from 'react-router-dom';
import TopNavBar from '../../components/TopNavBar';
import AccountMenu from '../../components/AccountMenu';
import { AppBar } from '../../components/styles';
import LogoutModal from '../../components/LogoutModal';
import { useDispatch } from 'react-redux';
import { authLogout } from '../../redux/userRelated/userSlice';

// Icons for TopNavBar
import HomeIcon from "@mui/icons-material/Home";
import PersonOutlineIcon from "@mui/icons-material/PersonOutline";
import AnnouncementOutlinedIcon from '@mui/icons-material/AnnouncementOutlined';
import ClassOutlinedIcon from '@mui/icons-material/ClassOutlined';
import SupervisorAccountOutlinedIcon from '@mui/icons-material/SupervisorAccountOutlined';
import ReportIcon from '@mui/icons-material/Report';
import AssignmentIcon from '@mui/icons-material/Assignment';
import AssignmentIndIcon from '@mui/icons-material/AssignmentInd';
import MonetizationOnOutlinedIcon from '@mui/icons-material/MonetizationOnOutlined';
import AdminProfile from './AdminProfile';
import AdminHomePage from './AdminHomePage';
import AdminSettings from './AdminSettings';

import AddStudent from './studentRelated/AddStudent';
import SeeComplains from './studentRelated/SeeComplains';
import ShowStudents from './studentRelated/ShowStudents';
import StudentExamMarks from './studentRelated/StudentExamMarks';
import ViewStudent from './studentRelated/ViewStudent';
import StudentLastBalance from './studentRelated/StudentLastBalance';

import AddNotice from './noticeRelated/AddNotice';
import ShowNotices from './noticeRelated/ShowNotices';
import EditNotice from './noticeRelated/EditNotice';
import ViewNotice from './noticeRelated/ViewNotice';

import ShowSubjects from './subjectRelated/ShowSubjects';
import SubjectForm from './subjectRelated/SubjectForm';
import ViewSubject from './subjectRelated/ViewSubject';
import EditSubject from './subjectRelated/EditSubject';
import SubjectAllocation from './SubjectAllocation';

import AddTeacher from './teacherRelated/AddTeacher';
import ChooseClass from './teacherRelated/ChooseClass';
import ChooseSubject from './teacherRelated/ChooseSubject';
import ShowTeachers from './teacherRelated/ShowTeachers';
import TeacherDetails from './teacherRelated/TeacherDetails';

import AddClass from './classRelated/AddClass';
import ClassDetails from './classRelated/ClassDetails';
import ShowClasses from './classRelated/ShowClasses';
import EditClass from './classRelated/EditClass';
import PromoteStudents from './classRelated/PromoteStudents';


import FeeDashboard from './feeRelated/FeeDashboard';
import FeeDefaulters from './feeRelated/FeeDefaulters';
import FeeStructure from './feeRelated/FeeStructure';
import FeeSearch from './feeRelated/FeeSearch';
import FeeDiscounts from './feeRelated/FeeDiscounts';
import LastBalancePresets from './feeRelated/LastBalancePresets';
import BreadcrumbsNav from '../../components/BreadcrumbsNav';

import ShowFamilies from './familyRelated/ShowFamilies';
import ViewFamily from './familyRelated/ViewFamily';
import AddFamily from './familyRelated/AddFamily';
import EditFamily from './familyRelated/EditFamily';
import FamilyRestroomOutlinedIcon from '@mui/icons-material/FamilyRestroomOutlined';

const AdminDashboard = () => {
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

    const adminLinks = [
        { title: 'Home', icon: <HomeIcon />, path: '/' },
        { title: 'Classes', icon: <ClassOutlinedIcon />, path: '/Admin/classes' },
        { title: 'Subjects', icon: <AssignmentIcon />, path: '/Admin/subjects' },
        { title: 'Teachers', icon: <SupervisorAccountOutlinedIcon />, path: '/Admin/teachers' },
        { title: 'Students', icon: <PersonOutlineIcon />, path: '/Admin/students' },
        { title: 'Families', icon: <FamilyRestroomOutlinedIcon />, path: '/Admin/families' },
        { title: 'Notices', icon: <AnnouncementOutlinedIcon />, path: '/Admin/notices' },
        { title: 'Complains', icon: <ReportIcon />, path: '/Admin/complains' },
        { title: 'Subject Allocation', icon: <AssignmentIndIcon />, path: '/Admin/subject-allocation' },
        { title: 'Fee Management', icon: <MonetizationOnOutlinedIcon />, path: '/Admin/fees' },
    ];

    return (
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
                                Kulluwal Campus
                            </Typography>
                        </Box>
                    </Box>
                    <AccountMenu onLogout={handleLogoutOpen} />
                </Toolbar>
            </AppBar>

            <Box component="main" sx={styles.boxStyled}>
                <Box sx={{ minHeight: '64px' }} /> {/* Increased to match standard AppBar height */}
                <TopNavBar links={adminLinks} title="TKS Kulluwal" />
                <Box sx={{
                    flex: 1,
                    overflow: 'auto',
                    background: 'var(--bg-body)',
                    px: { xs: 2, sm: 3, md: 4 },
                    pb: { xs: 2, sm: 3, md: 4 },
                }}>
                    <BreadcrumbsNav />
                    <Box sx={{ pt: 0 }}> {/* Removed buffer */}
                        <Routes>
                            <Route path="/" element={<AdminHomePage />} />
                            <Route path='*' element={<Navigate to="/" />} />
                            <Route path="/Admin/dashboard" element={<AdminHomePage />} />
                            <Route path="/Admin/profile" element={<AdminProfile />} />
                            <Route path="/Admin/settings" element={<AdminSettings />} />
                            <Route path="/Admin/complains" element={<SeeComplains />} />

                            {/* Notice */}
                            <Route path="/Admin/addnotice" element={<AddNotice />} />
                            <Route path="/Admin/notices" element={<ShowNotices />} />
                            <Route path="/Admin/notices/notice/:id" element={<ViewNotice />} />
                            <Route path="/Admin/notices/edit/:id" element={<EditNotice />} />

                            {/* Subject */}
                            <Route path="/Admin/subjects" element={<ShowSubjects />} />
                            <Route path="/Admin/subjects/subject/:classID/:subjectID" element={<ViewSubject />} />
                            <Route path="/Admin/subjects/chooseclass" element={<ChooseClass situation="Subject" />} />
                            <Route path="/Admin/subjects/edit/:id" element={<EditSubject />} />

                            <Route path="/Admin/addsubject/:id" element={<SubjectForm />} />
                            <Route path="/Admin/class/subject/:classID/:subjectID" element={<ViewSubject />} />

                            <Route path="/Admin/subject/student/marks/:studentID/:subjectID" element={<StudentExamMarks situation="Subject" />} />
                            <Route path="/Admin/subject-allocation" element={<SubjectAllocation />} />

                            {/* Class */}
                            <Route path="/Admin/addclass" element={<AddClass />} />
                            <Route path="/Admin/classes" element={<ShowClasses />} />
                            <Route path="/Admin/classes/class/:id" element={<ClassDetails />} />
                            <Route path="/Admin/classes/class/edit/:id" element={<EditClass />} />
                            <Route path="/Admin/class/addstudents/:id" element={<AddStudent situation="Class" />} />
                            <Route path="/Admin/classes/promote" element={<PromoteStudents />} />

                            {/* Student */}
                            <Route path="/Admin/addstudents" element={<AddStudent situation="Student" />} />
                            <Route path="/Admin/students" element={<ShowStudents />} />
                            <Route path="/Admin/students/student/edit/:id" element={<AddStudent situation="Edit" />} />
                            <Route path="/Admin/students/student/:id" element={<ViewStudent />} />
                            <Route path="/Admin/students/student/marks/:id" element={<StudentExamMarks situation="Student" />} />
                            <Route path="/Admin/students/student/lastbalance/:id" element={<StudentLastBalance />} />

                            {/* Family */}
                            <Route path="/Admin/families" element={<ShowFamilies />} />
                            <Route path="/Admin/families/family/:id" element={<ViewFamily />} />
                            <Route path="/Admin/families/family/edit/:id" element={<EditFamily />} />
                            <Route path="/Admin/addfamily" element={<AddFamily />} />

                            {/* Teacher */}
                            <Route path="/Admin/teachers" element={<ShowTeachers />} />
                            <Route path="/Admin/teachers/teacher/edit/:id" element={<AddTeacher situation="Edit" />} />
                            <Route path="/Admin/teachers/teacher/:id" element={<TeacherDetails />} />
                            <Route path="/Admin/teachers/chooseclass" element={<ChooseClass situation="Teacher" />} />
                            <Route path="/Admin/teachers/choosesubject/:id" element={<ChooseSubject situation="Norm" />} />
                            <Route path="/Admin/teachers/choosesubject/:classID/:teacherID" element={<ChooseSubject situation="Teacher" />} />
                            <Route path="/Admin/teachers/add" element={<AddTeacher />} />
                            <Route path="/Admin/teachers/addteacher/:id" element={<AddTeacher />} />



                            {/* Fees */}
                            <Route path="/Admin/fees" element={<FeeDashboard />} />
                            <Route path="/Admin/fees/defaulters" element={<FeeDefaulters />} />
                            <Route path="/Admin/fees/structure" element={<FeeStructure />} />
                            <Route path="/Admin/fees/search" element={<FeeSearch />} />
                            <Route path="/Admin/fees/discounts" element={<FeeDiscounts />} />
                            <Route path="/Admin/fees/last-balance-presets" element={<LastBalancePresets />} />
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
    );
}

export default AdminDashboard

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