import React from 'react';
import { Breadcrumbs, Typography, Link, Box, useMediaQuery, useTheme } from '@mui/material';
import { useLocation, Link as RouterLink } from 'react-router-dom';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';
import HomeIcon from '@mui/icons-material/Home';

/**
 * Route pattern registry.
 * Each entry maps a regex (matching the full pathname) to an array of breadcrumb steps.
 * Crumbs are built left-to-right; each crumb has { label, pathIndex }.
 * pathIndex = index in the split-path array that forms the link's "to".
 * Use null for the path of the last (current) crumb — it won't be linked anyway.
 *
 * Pattern priority: MORE SPECIFIC patterns should come BEFORE less specific ones.
 */
const ROUTE_PATTERNS = [
    // ── Admin ────────────────────────────────────────────────────────────────

    // Dashboard / home
    {
        pattern: /^\/Admin\/dashboard$/i,
        crumbs: [{ label: 'Admin', idx: 1 }, { label: 'Dashboard', idx: null }]
    },

    {
        pattern: /^\/Admin\/profile$/i,
        crumbs: [{ label: 'Admin', idx: 1 }, { label: 'Profile', idx: null }]
    },

    {
        pattern: /^\/Admin\/settings$/i,
        crumbs: [{ label: 'Admin', idx: 1 }, { label: 'Settings', idx: null }]
    },

    {
        pattern: /^\/Admin\/complains$/i,
        crumbs: [{ label: 'Admin', idx: 1 }, { label: 'Complaints', idx: null }]
    },

    // ── Notices ──────────────────────────────────────────────────────────────
    {
        pattern: /^\/Admin\/addnotice$/i,
        crumbs: [{ label: 'Admin', idx: 1 }, { label: 'Notices', idx: 2, customTo: '/Admin/notices' }, { label: 'Add Notice', idx: null }]
    },

    {
        pattern: /^\/Admin\/notices$/i,
        crumbs: [{ label: 'Admin', idx: 1 }, { label: 'Notices', idx: null }]
    },

    {
        pattern: /^\/Admin\/notices\/notice\/.+$/i,
        crumbs: [{ label: 'Admin', idx: 1 }, { label: 'Notices', idx: 2, customTo: '/Admin/notices' }, { label: 'View Notice', idx: null }]
    },

    {
        pattern: /^\/Admin\/notices\/edit\/.+$/i,
        crumbs: [{ label: 'Admin', idx: 1 }, { label: 'Notices', idx: 2, customTo: '/Admin/notices' }, { label: 'Edit Notice', idx: null }]
    },

    // ── Subjects ─────────────────────────────────────────────────────────────
    {
        pattern: /^\/Admin\/subject-allocation$/i,
        crumbs: [{ label: 'Admin', idx: 1 }, { label: 'Subject Allocation', idx: null }]
    },

    {
        pattern: /^\/Admin\/subjects\/subject\/.+\/.+$/i,
        crumbs: [{ label: 'Admin', idx: 1 }, { label: 'Subjects', idx: 2, customTo: '/Admin/subjects' }, { label: 'Subject Details', idx: null }]
    },

    {
        pattern: /^\/Admin\/subjects\/chooseclass$/i,
        crumbs: [{ label: 'Admin', idx: 1 }, { label: 'Subjects', idx: 2, customTo: '/Admin/subjects' }, { label: 'Choose Class', idx: null }]
    },

    {
        pattern: /^\/Admin\/subjects\/edit\/.+$/i,
        crumbs: [{ label: 'Admin', idx: 1 }, { label: 'Subjects', idx: 2, customTo: '/Admin/subjects' }, { label: 'Edit Subject', idx: null }]
    },

    {
        pattern: /^\/Admin\/subjects$/i,
        crumbs: [{ label: 'Admin', idx: 1 }, { label: 'Subjects', idx: null }]
    },

    {
        pattern: /^\/Admin\/addsubject\/.+$/i,
        crumbs: [{ label: 'Admin', idx: 1 }, { label: 'Subjects', idx: 2, customTo: '/Admin/subjects' }, { label: 'Add Subject', idx: null }]
    },

    {
        pattern: /^\/Admin\/class\/subject\/.+\/.+$/i,
        crumbs: [{ label: 'Admin', idx: 1 }, { label: 'Classes', idx: 2, customTo: '/Admin/classes' }, { label: 'Subject Details', idx: null }]
    },

    {
        pattern: /^\/Admin\/subject\/student\/marks\/.+\/.+$/i,
        crumbs: [{ label: 'Admin', idx: 1 }, { label: 'Subjects', idx: 2, customTo: '/Admin/subjects' }, { label: 'Student Marks', idx: null }]
    },

    // ── Classes ───────────────────────────────────────────────────────────────
    {
        pattern: /^\/Admin\/addclass$/i,
        crumbs: [{ label: 'Admin', idx: 1 }, { label: 'Classes', idx: 2, customTo: '/Admin/classes' }, { label: 'Add Class', idx: null }]
    },

    {
        pattern: /^\/Admin\/classes\/class\/edit\/.+$/i,
        crumbs: [{ label: 'Admin', idx: 1 }, { label: 'Classes', idx: 2, customTo: '/Admin/classes' }, { label: 'Edit Class', idx: null }]
    },

    {
        pattern: /^\/Admin\/classes\/class\/.+$/i,
        crumbs: [{ label: 'Admin', idx: 1 }, { label: 'Classes', idx: 2, customTo: '/Admin/classes' }, { label: 'Class Details', idx: null }]
    },

    {
        pattern: /^\/Admin\/classes\/promote$/i,
        crumbs: [{ label: 'Admin', idx: 1 }, { label: 'Classes', idx: 2, customTo: '/Admin/classes' }, { label: 'Promote Students', idx: null }]
    },

    {
        pattern: /^\/Admin\/classes$/i,
        crumbs: [{ label: 'Admin', idx: 1 }, { label: 'Classes', idx: null }]
    },

    {
        pattern: /^\/Admin\/class\/addstudents\/.+$/i,
        crumbs: [{ label: 'Admin', idx: 1 }, { label: 'Classes', idx: 2, customTo: '/Admin/classes' }, { label: 'Add Students', idx: null }]
    },

    // ── Students ──────────────────────────────────────────────────────────────
    {
        pattern: /^\/Admin\/addstudents$/i,
        crumbs: [{ label: 'Admin', idx: 1 }, { label: 'Students', idx: 2, customTo: '/Admin/students' }, { label: 'Add Student', idx: null }]
    },

    {
        pattern: /^\/Admin\/students\/student\/edit\/.+$/i,
        crumbs: [{ label: 'Admin', idx: 1 }, { label: 'Students', idx: 2, customTo: '/Admin/students' }, { label: 'Edit Student', idx: null }]
    },

    {
        pattern: /^\/Admin\/students\/student\/marks\/.+$/i,
        crumbs: [{ label: 'Admin', idx: 1 }, { label: 'Students', idx: 2, customTo: '/Admin/students' }, { label: 'Student Marks', idx: null }]
    },

    {
        pattern: /^\/Admin\/students\/student\/lastbalance\/.+$/i,
        crumbs: [{ label: 'Admin', idx: 1 }, { label: 'Students', idx: 2, customTo: '/Admin/students' }, { label: 'Last Balance', idx: null }]
    },

    {
        pattern: /^\/Admin\/students\/student\/.+$/i,
        crumbs: [{ label: 'Admin', idx: 1 }, { label: 'Students', idx: 2, customTo: '/Admin/students' }, { label: 'Student Details', idx: null }]
    },

    {
        pattern: /^\/Admin\/students$/i,
        crumbs: [{ label: 'Admin', idx: 1 }, { label: 'Students', idx: null }]
    },

    // ── Families ──────────────────────────────────────────────────────────────
    {
        pattern: /^\/Admin\/addfamily$/i,
        crumbs: [{ label: 'Admin', idx: 1 }, { label: 'Families', idx: 2, customTo: '/Admin/families' }, { label: 'Add Family', idx: null }]
    },

    {
        pattern: /^\/Admin\/families\/family\/edit\/.+$/i,
        crumbs: [{ label: 'Admin', idx: 1 }, { label: 'Families', idx: 2, customTo: '/Admin/families' }, { label: 'Edit Family', idx: null }]
    },

    {
        pattern: /^\/Admin\/families\/family\/.+$/i,
        crumbs: [{ label: 'Admin', idx: 1 }, { label: 'Families', idx: 2, customTo: '/Admin/families' }, { label: 'Family Details', idx: null }]
    },

    {
        pattern: /^\/Admin\/families$/i,
        crumbs: [{ label: 'Admin', idx: 1 }, { label: 'Families', idx: null }]
    },

    // ── Teachers ──────────────────────────────────────────────────────────────
    {
        pattern: /^\/Admin\/teachers\/teacher\/edit\/.+$/i,
        crumbs: [{ label: 'Admin', idx: 1 }, { label: 'Teachers', idx: 2, customTo: '/Admin/teachers' }, { label: 'Edit Teacher', idx: null }]
    },

    {
        pattern: /^\/Admin\/teachers\/teacher\/.+$/i,
        crumbs: [{ label: 'Admin', idx: 1 }, { label: 'Teachers', idx: 2, customTo: '/Admin/teachers' }, { label: 'Teacher Details', idx: null }]
    },

    {
        pattern: /^\/Admin\/teachers\/chooseclass$/i,
        crumbs: [{ label: 'Admin', idx: 1 }, { label: 'Teachers', idx: 2, customTo: '/Admin/teachers' }, { label: 'Choose Class', idx: null }]
    },

    {
        pattern: /^\/Admin\/teachers\/choosesubject\/.*/i,
        crumbs: [{ label: 'Admin', idx: 1 }, { label: 'Teachers', idx: 2, customTo: '/Admin/teachers' }, { label: 'Choose Subject', idx: null }]
    },

    {
        pattern: /^\/Admin\/teachers\/add$/i,
        crumbs: [{ label: 'Admin', idx: 1 }, { label: 'Teachers', idx: 2, customTo: '/Admin/teachers' }, { label: 'Add Teacher', idx: null }]
    },

    {
        pattern: /^\/Admin\/teachers\/addteacher\/.+$/i,
        crumbs: [{ label: 'Admin', idx: 1 }, { label: 'Teachers', idx: 2, customTo: '/Admin/teachers' }, { label: 'Add Teacher', idx: null }]
    },

    {
        pattern: /^\/Admin\/teachers$/i,
        crumbs: [{ label: 'Admin', idx: 1 }, { label: 'Teachers', idx: null }]
    },

    // ── Fees ──────────────────────────────────────────────────────────────────
    {
        pattern: /^\/Admin\/fees\/defaulters$/i,
        crumbs: [{ label: 'Admin', idx: 1 }, { label: 'Fee Management', idx: 2, customTo: '/Admin/fees' }, { label: 'Defaulters', idx: null }]
    },

    {
        pattern: /^\/Admin\/fees\/structure$/i,
        crumbs: [{ label: 'Admin', idx: 1 }, { label: 'Fee Management', idx: 2, customTo: '/Admin/fees' }, { label: 'Fee Structure', idx: null }]
    },

    {
        pattern: /^\/Admin\/fees\/search$/i,
        crumbs: [{ label: 'Admin', idx: 1 }, { label: 'Fee Management', idx: 2, customTo: '/Admin/fees' }, { label: 'Fee Search', idx: null }]
    },

    {
        pattern: /^\/Admin\/fees\/discounts$/i,
        crumbs: [{ label: 'Admin', idx: 1 }, { label: 'Fee Management', idx: 2, customTo: '/Admin/fees' }, { label: 'Discounts', idx: null }]
    },

    {
        pattern: /^\/Admin\/fees\/last-balance-presets$/i,
        crumbs: [{ label: 'Admin', idx: 1 }, { label: 'Fee Management', idx: 2, customTo: '/Admin/fees' }, { label: 'Balance Presets', idx: null }]
    },

    {
        pattern: /^\/Admin\/fees$/i,
        crumbs: [{ label: 'Admin', idx: 1 }, { label: 'Fee Management', idx: null }]
    },

    // ── Teacher dashboard ────────────────────────────────────────────────────
    {
        pattern: /^\/Teacher\/dashboard$/i,
        crumbs: [{ label: 'Teacher', idx: 1 }, { label: 'Dashboard', idx: null }]
    },

    {
        pattern: /^\/Teacher\/profile$/i,
        crumbs: [{ label: 'Teacher', idx: 1 }, { label: 'Profile', idx: null }]
    },

    {
        pattern: /^\/Teacher\/complain$/i,
        crumbs: [{ label: 'Teacher', idx: 1 }, { label: 'Complain', idx: null }]
    },

    {
        pattern: /^\/Teacher\/class\/student\/marks\/.+\/.+$/i,
        crumbs: [{ label: 'Teacher', idx: 1 }, { label: 'Class', idx: 2, customTo: '/Teacher/class' }, { label: 'Student Marks', idx: null }]
    },

    {
        pattern: /^\/Teacher\/class\/student\/.+$/i,
        crumbs: [{ label: 'Teacher', idx: 1 }, { label: 'Class', idx: 2, customTo: '/Teacher/class' }, { label: 'Student Details', idx: null }]
    },

    {
        pattern: /^\/Teacher\/class$/i,
        crumbs: [{ label: 'Teacher', idx: 1 }, { label: 'My Class', idx: null }]
    },

    // ── Student dashboard ────────────────────────────────────────────────────
    {
        pattern: /^\/Student\/dashboard$/i,
        crumbs: [{ label: 'Student', idx: 1 }, { label: 'Dashboard', idx: null }]
    },

    {
        pattern: /^\/Student\/profile$/i,
        crumbs: [{ label: 'Student', idx: 1 }, { label: 'Profile', idx: null }]
    },

    {
        pattern: /^\/Student\/subjects$/i,
        crumbs: [{ label: 'Student', idx: 1 }, { label: 'Subjects', idx: null }]
    },

    {
        pattern: /^\/Student\/complain$/i,
        crumbs: [{ label: 'Student', idx: 1 }, { label: 'Complain', idx: null }]
    },
];

/** Resolve home route per role */
const HOME_ROUTES = {
    admin: '/Admin/dashboard',
    teacher: '/Teacher/dashboard',
    student: '/Student/dashboard',
};

const getHomeRoute = (pathname) => {
    const lower = pathname.toLowerCase();
    if (lower.startsWith('/admin')) return HOME_ROUTES.admin;
    if (lower.startsWith('/teacher')) return HOME_ROUTES.teacher;
    if (lower.startsWith('/student')) return HOME_ROUTES.student;
    return '/';
};

const getBreadcrumbs = (pathname) => {
    // Always start with Home
    const homeRoute = getHomeRoute(pathname);

    // Try to find a matching pattern
    const match = ROUTE_PATTERNS.find(({ pattern }) => pattern.test(pathname));

    if (!match) {
        // Fallback: just show Home as the only crumb (e.g. at root "/")
        return [{ label: 'Home', to: homeRoute, isHome: true }];
    }

    // Build crumbs from the matched pattern
    const segments = pathname.split('/').filter(Boolean); // e.g. ['Admin', 'classes', 'class', '<id>']

    const crumbs = [
        { label: 'Home', to: homeRoute, isHome: true },
        ...match.crumbs.map((crumb, i) => {
            const isLast = i === match.crumbs.length - 1;
            let to;
            if (isLast) {
                to = null; // current page — not linked
            } else if (crumb.customTo) {
                to = crumb.customTo;
            } else if (crumb.idx != null) {
                to = '/' + segments.slice(0, crumb.idx).join('/');
            } else {
                to = null;
            }
            return { label: crumb.label, to };
        }),
    ];

    return crumbs;
};

const BreadcrumbsNav = () => {
    const location = useLocation();
    const pathname = location.pathname;
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

    const breadcrumbs = getBreadcrumbs(pathname);

    // On the dashboard/home page (only 1 item), hide the breadcrumb bar entirely
    if (breadcrumbs.length <= 1) return null;

    // On mobile, show only the last 2 crumbs to save space
    const visibleCrumbs = isMobile && breadcrumbs.length > 2
        ? [
            { label: '…', to: null, isEllipsis: true },
            ...breadcrumbs.slice(-2),
        ]
        : breadcrumbs;

    return (
        <Box
            sx={{
                position: 'sticky',
                top: 0,
                zIndex: 100,
                width: '100%',
                background: 'var(--bg-body)',
                pt: 0.5,
                pb: 0.5,
                display: 'flex',
                alignItems: 'center',
            }}
        >
            <Box
                sx={{
                    p: { xs: '3px 8px', sm: '4px 12px' },
                    borderRadius: 'var(--border-radius-md)',
                    background: 'rgba(255, 255, 255, 0.4)',
                    backdropFilter: 'blur(10px)',
                    border: '1px solid rgba(255, 255, 255, 0.3)',
                    display: 'inline-flex',
                    maxWidth: '100%',
                    minWidth: 0,
                    boxShadow: 'var(--shadow-sm)',
                    transition: 'all 0.3s ease',
                    '&:hover': {
                        boxShadow: 'var(--shadow-md)',
                        background: 'rgba(255, 255, 255, 0.6)',
                    },
                    overflow: 'hidden',
                }}
            >
                <Breadcrumbs
                    separator={
                        <NavigateNextIcon
                            fontSize="small"
                            sx={{
                                color: 'var(--text-tertiary)',
                                mx: { xs: 0, sm: 0.5 },
                                fontSize: { xs: '0.9rem', sm: '1rem' },
                            }}
                        />
                    }
                    aria-label="breadcrumb"
                    sx={{
                        '& .MuiBreadcrumbs-ol': {
                            flexWrap: 'nowrap',
                            alignItems: 'center',
                            overflow: 'hidden',
                        },
                        '& .MuiBreadcrumbs-li': {
                            display: 'flex',
                            alignItems: 'center',
                            minWidth: 0,
                        },
                        '& .MuiBreadcrumbs-separator': {
                            mx: { xs: 0.25, sm: 0.5 },
                        },
                    }}
                >
                    {visibleCrumbs.map((crumb, index) => {
                        const isLast = index === visibleCrumbs.length - 1;

                        if (crumb.isEllipsis) {
                            return (
                                <Typography
                                    key="ellipsis"
                                    sx={{
                                        color: 'var(--text-tertiary)',
                                        fontSize: { xs: '0.7rem', sm: 'var(--font-size-sm)' },
                                        lineHeight: 1,
                                    }}
                                >
                                    …
                                </Typography>
                            );
                        }

                        return isLast ? (
                            <Typography
                                key={index}
                                sx={{
                                    color: 'var(--color-primary-700)',
                                    fontWeight: 600,
                                    fontSize: { xs: '0.72rem', sm: 'var(--font-size-sm)' },
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: 0.5,
                                    whiteSpace: 'nowrap',
                                    overflow: 'hidden',
                                    textOverflow: 'ellipsis',
                                    maxWidth: { xs: '110px', sm: 'unset' },
                                }}
                            >
                                {crumb.isHome && (
                                    <HomeIcon sx={{ fontSize: { xs: '0.85rem', sm: '1.1rem' }, color: 'var(--color-primary-600)' }} />
                                )}
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
                                    fontSize: { xs: '0.72rem', sm: 'var(--font-size-sm)' },
                                    color: 'var(--text-secondary)',
                                    transition: 'color 0.2s',
                                    whiteSpace: 'nowrap',
                                    overflow: 'hidden',
                                    textOverflow: 'ellipsis',
                                    maxWidth: { xs: '80px', sm: 'unset' },
                                    '&:hover': {
                                        color: 'var(--color-primary-600)',
                                    },
                                }}
                            >
                                {crumb.isHome && (
                                    <HomeIcon sx={{ fontSize: { xs: '0.85rem', sm: '1.1rem' } }} />
                                )}
                                {crumb.label}
                            </Link>
                        );
                    })}
                </Breadcrumbs>
            </Box>
        </Box>
    );
};

export default BreadcrumbsNav;
