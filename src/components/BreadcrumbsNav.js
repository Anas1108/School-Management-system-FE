import React from 'react';
import { Breadcrumbs, Typography, Link, Box } from '@mui/material';
import { useLocation, Link as RouterLink } from 'react-router-dom';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';
import HomeIcon from '@mui/icons-material/Home';

const getBreadcrumbs = (pathname) => {
    const pathnames = pathname.split('/').filter((x) => x);
    return pathnames.map((value, index) => {
        const to = `/${pathnames.slice(0, index + 1).join('/')}`;
        // Simple capitalization, can be enhanced with a map if needed
        const label = value.charAt(0).toUpperCase() + value.slice(1);
        return { label, to };
    });
};

const BreadcrumbsNav = () => {
    const location = useLocation();
    const pathname = location.pathname;
    const breadcrumbs = getBreadcrumbs(pathname);

    if (breadcrumbs.length === 0) return null;

    return (
        <Box
            sx={{
                mb: { xs: 2, md: 3 },
                mt: 1,
                p: '6px 16px',
                borderRadius: 'var(--border-radius-md)',
                background: 'rgba(255, 255, 255, 0.4)',
                backdropFilter: 'blur(10px)',
                border: '1px solid rgba(255, 255, 255, 0.3)',
                display: 'inline-flex',
                maxWidth: '100%', // Ensure it doesn't overflow
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
                sx={{
                    '& .MuiBreadcrumbs-ol': {
                        flexWrap: 'nowrap', // Prevent wrapping if possible, or allow it but control items
                        overflow: 'hidden'
                    },
                    '& .MuiBreadcrumbs-li': {
                        whiteSpace: 'nowrap',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        maxWidth: { xs: '100px', sm: 'unset' } // Truncate on mobile
                    }
                }}
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
                                gap: 0.5,
                                overflow: 'hidden',
                                textOverflow: 'ellipsis'
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
                                overflow: 'hidden',
                                textOverflow: 'ellipsis',
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
