import React from 'react';
import { Breadcrumbs, Typography, Link, Box } from '@mui/material';
import { useLocation, Link as RouterLink } from 'react-router-dom';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';
import HomeIcon from '@mui/icons-material/Home';

const BreadcrumbsNav = () => {
    const location = useLocation();
    const pathname = location.pathname;

    const getBreadcrumbs = (path) => {
        // Base breadcrumb for all authenticated routes
        const homeCrumb = { label: 'Dashboard', to: '/' }; // Redirects to role-based home via root route logic

        // Admin Routes
        if (path.startsWith('/Admin')) {
            const crumbs = [homeCrumb];

            if (path === '/Admin/dashboard') return []; // No breadcrumbs on dashboard itself

            // Students
            if (path.startsWith('/Admin/students')) {
                crumbs.push({ label: 'Students', to: '/Admin/students' });
                if (path.includes('/student/')) {
                    const studentId = path.split('/student/')[1].split('/')[0];
                    crumbs.push({ label: 'Student Profile', to: `/Admin/students/student/${studentId}` });
                    if (path.includes('/attendance')) crumbs.push({ label: 'Attendance', to: '#' });
                    if (path.includes('/marks')) crumbs.push({ label: 'Marks', to: '#' });
                    if (path.includes('/edit')) crumbs.push({ label: 'Edit', to: '#' });
                } else if (path === '/Admin/addstudents') {
                    // Handle the case where addstudents might be visited directly or from students
                    // If we want it under students:
                    // crumbs.push({ label: 'Add Student', to: '#' }); 
                    // But strictly speaking /Admin/addstudents path is sibling to /Admin/students in URL, 
                    // logically it's an action on students.
                    // Let's rely on string matching for the current tail.
                }
            }
            else if (path === '/Admin/addstudents') {
                crumbs.push({ label: 'Students', to: '/Admin/students' });
                crumbs.push({ label: 'Add Student', to: '#' });
            }

            // Teachers
            else if (path.startsWith('/Admin/teachers')) {
                crumbs.push({ label: 'Teachers', to: '/Admin/teachers' });
                if (path.includes('/teacher/')) {
                    const teacherId = path.split('/teacher/')[1].split('/')[0];
                    crumbs.push({ label: 'Teacher Profile', to: `/Admin/teachers/teacher/${teacherId}` });
                }
                if (path.includes('/addteacher')) crumbs.push({ label: 'Add Teacher', to: '#' });
                if (path.includes('/chooseclass')) crumbs.push({ label: 'Choose Class', to: '#' });
            }
            else if (path.includes('/addteacher')) { // Handle independent addteacher route if any
                // Based on routes: /Admin/teachers/addteacher/:id is under teachers
            }

            // Classes
            else if (path.startsWith('/Admin/classes')) {
                crumbs.push({ label: 'Classes', to: '/Admin/classes' });
                if (path.includes('/class/')) {
                    const classId = path.split('/class/')[1].split('/')[0];
                    crumbs.push({ label: 'Class Details', to: `/Admin/classes/class/${classId}` });
                    if (path.includes('/addstudents')) crumbs.push({ label: 'Add Students', to: '#' });
                }
            }
            else if (path === '/Admin/addclass') {
                crumbs.push({ label: 'Classes', to: '/Admin/classes' });
                crumbs.push({ label: 'Add Class', to: '#' });
            }

            // Subjects
            else if (path.startsWith('/Admin/subjects')) {
                crumbs.push({ label: 'Subjects', to: '/Admin/subjects' });
                if (path.includes('/subject/')) {
                    // /Admin/subjects/subject/:classID/:subjectID
                    crumbs.push({ label: 'Subject Details', to: '#' });
                }
                if (path.includes('/chooseclass')) crumbs.push({ label: 'Choose Class', to: '#' });
            }
            else if (path.startsWith('/Admin/addsubject')) {
                crumbs.push({ label: 'Subjects', to: '/Admin/subjects' });
                crumbs.push({ label: 'Add Subject', to: '#' });
            }

            // Notices
            else if (path.startsWith('/Admin/notices')) {
                crumbs.push({ label: 'Notices', to: '/Admin/notices' });
            }
            else if (path === '/Admin/addnotice') {
                crumbs.push({ label: 'Notices', to: '/Admin/notices' });
                crumbs.push({ label: 'Add Notice', to: '#' });
            }

            // Complains
            else if (path === '/Admin/complains') {
                crumbs.push({ label: 'Complains', to: '#' });
            }

            // Profile
            else if (path === '/Admin/profile') {
                crumbs.push({ label: 'Profile', to: '#' });
            }

            // Fees
            else if (path.startsWith('/Admin/fees')) {
                crumbs.push({ label: 'Fees', to: '/Admin/fees' });
                if (path.includes('/defaulters')) crumbs.push({ label: 'Defaulters', to: '#' });
                if (path.includes('/structure')) crumbs.push({ label: 'Fee Structure', to: '#' });
                if (path.includes('/search')) crumbs.push({ label: 'Search', to: '#' });
            }

            return crumbs;
        }

        // Student Routes
        if (path.startsWith('/Student')) {
            const crumbs = [homeCrumb];
            if (path === '/Student/dashboard') return [];

            if (path === '/Student/profile') crumbs.push({ label: 'Profile', to: '#' });
            if (path === '/Student/subjects') crumbs.push({ label: 'Subjects', to: '#' });
            if (path === '/Student/attendance') crumbs.push({ label: 'Attendance', to: '#' });
            if (path === '/Student/complain') crumbs.push({ label: 'Complain', to: '#' });

            return crumbs;
        }

        // Teacher Routes
        if (path.startsWith('/Teacher')) {
            const crumbs = [homeCrumb];
            if (path === '/Teacher/dashboard') return [];

            if (path === '/Teacher/profile') crumbs.push({ label: 'Profile', to: '#' });
            if (path === '/Teacher/complain') crumbs.push({ label: 'Complain', to: '#' });

            if (path.startsWith('/Teacher/class')) {
                crumbs.push({ label: 'Class', to: '/Teacher/class' });
                if (path.includes('/student/')) {
                    crumbs.push({ label: 'Student Details', to: '#' });
                }
            }

            return crumbs;
        }

        return [];
    };

    const breadcrumbs = getBreadcrumbs(pathname);

    if (breadcrumbs.length === 0) return null;

    // Filter out the last item to make it non-clickable in the loop logic easily
    // or handle it inside the map

    return (
        <Box
            sx={{
                mb: 1.5,
                p: '6px 16px',
                borderRadius: 'var(--border-radius-md)',
                background: 'rgba(255, 255, 255, 0.4)',
                backdropFilter: 'blur(10px)',
                border: '1px solid rgba(255, 255, 255, 0.3)',
                display: 'inline-flex',
                boxShadow: 'var(--shadow-sm)',
                transition: 'all 0.3s ease',
                '&:hover': {
                    boxShadow: 'var(--shadow-md)',
                    background: 'rgba(255, 255, 255, 0.6)',
                }
            }}
        >
            <Breadcrumbs
                separator={<NavigateNextIcon fontSize="small" sx={{ color: 'var(--text-tertiary)', mx: 0.5 }} />}
                aria-label="breadcrumb"
            >
                {breadcrumbs.map((crumb, index) => {
                    const last = index === breadcrumbs.length - 1;
                    const isDashboard = crumb.label === 'Dashboard';

                    return last ? (
                        <Typography
                            key={index}
                            sx={{
                                color: 'var(--color-primary-700)',
                                fontWeight: 600,
                                fontSize: 'var(--font-size-sm)',
                                display: 'flex',
                                alignItems: 'center',
                                gap: 0.5
                            }}
                        >
                            {isDashboard && <HomeIcon sx={{ fontSize: '1.2rem', color: 'var(--color-primary-600)' }} />}
                            {crumb.label}
                        </Typography>
                    ) : (
                        <Link
                            underline="none"
                            color="inherit"
                            component={RouterLink}
                            to={crumb.to}
                            key={index}
                            sx={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: 0.5,
                                fontSize: 'var(--font-size-sm)',
                                color: 'var(--text-secondary)',
                                transition: 'color 0.2s',
                                '&:hover': {
                                    color: 'var(--color-primary-600)',
                                }
                            }}
                        >
                            {isDashboard && <HomeIcon sx={{ fontSize: '1.2rem' }} />}
                            {crumb.label}
                        </Link>
                    );
                })}
            </Breadcrumbs>
        </Box>
    );
};

export default BreadcrumbsNav;
