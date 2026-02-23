import React, { useState } from 'react';
import {
    AppBar as MuiAppBar,
    Toolbar,
    Typography,
    IconButton,
    Box,
    Drawer,
    List,
    ListItem,
    ListItemIcon,
    ListItemText,
    useTheme,
    useMediaQuery,
    Button,
    styled
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import { Link, useLocation } from 'react-router-dom';


const StyledAppBar = styled(MuiAppBar)(({ theme }) => ({
    zIndex: theme.zIndex.drawer + 0, // Lower z-index so it feels secondary
    background: 'var(--bg-glass)',
    backdropFilter: 'var(--backdrop-blur)',
    boxShadow: 'var(--shadow-sm)', // Add subtle shadow for distinction
    borderBottom: '1px solid var(--border-color)',
    borderRadius: 'var(--border-radius-lg)', // Rounded corners for floating feel
    color: 'var(--text-primary)',
    margin: '8px 16px', // Gap from the edges and top bar
    width: 'calc(100% - 32px)',
    transition: 'all 0.3s ease',
}));

const NavButton = styled(Button)(({ theme, active }) => ({
    margin: '0 4px',
    padding: '4px 12px', // Slimmer padding
    borderRadius: 'var(--border-radius-md)',
    color: active ? 'var(--color-primary-700)' : 'var(--text-secondary)',
    background: active ? 'var(--color-primary-50)' : 'transparent',
    textTransform: 'none',
    fontWeight: active ? 600 : 500,
    fontSize: '0.875rem', // Slightly smaller text
    transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
    minWidth: 'fit-content',
    '&:hover': {
        background: 'var(--color-primary-100)',
        color: 'var(--color-primary-800)',
    },
    '& .MuiButton-startIcon': {
        color: active ? 'var(--color-primary-600)' : 'inherit',
        marginRight: '4px',
    }
}));

const SidebarItem = styled(ListItem)(({ theme, active }) => ({
    borderRadius: 'var(--border-radius-md)',
    margin: '4px 8px',
    width: 'calc(100% - 16px)',
    color: active ? 'var(--color-primary-800)' : 'var(--text-secondary)',
    backgroundColor: active ? 'var(--color-primary-100)' : 'transparent',
    fontWeight: active ? 600 : 400,
    '&:hover': {
        backgroundColor: 'var(--color-primary-50)',
    },
    '& .MuiListItemIcon-root': {
        color: active ? 'var(--color-primary-700)' : 'inherit',
    }
}));

const TopNavBar = ({ links, title, onLogout }) => {
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('lg')); // Use lg breakpoint to switch to hamburger if many links
    const [mobileOpen, setMobileOpen] = useState(false);
    const location = useLocation();

    const handleDrawerToggle = () => {
        setMobileOpen(!mobileOpen);
    };

    const isActive = (path) => {
        if (path === '/') {
            return location.pathname === '/' || location.pathname.endsWith('/dashboard');
        }
        return location.pathname.startsWith(path);
    };

    const mobileDrawer = (
        <Box onClick={handleDrawerToggle} sx={{ textAlign: 'center', height: '100%', display: 'flex', flexDirection: 'column', p: 2 }}>
            <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mb: 2 }}>
                <img
                    src="/favicon.png"
                    alt="TKS Logo"
                    style={{ height: '48px', marginBottom: '8px' }}
                />
                <Typography variant="h6" sx={{
                    fontWeight: 800,
                    background: 'var(--gradient-primary)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    letterSpacing: '-1px',
                    fontSize: '1.1rem'
                }}>
                    THE KNOWLEDGE SCHOOL
                </Typography>
                <Typography variant="caption" sx={{ color: 'var(--color-primary-600)', fontWeight: 700 }}>
                    Kulluwal Campus
                </Typography>
            </Box>
            <List sx={{ flex: 1, overflowY: 'auto' }}>
                {links.map((item) => (
                    <SidebarItem
                        button
                        key={item.title}
                        component={Link}
                        to={item.path}
                        active={isActive(item.path) ? 1 : 0}
                    >
                        <ListItemIcon>
                            {React.cloneElement(item.icon, {
                                color: isActive(item.path) ? 'primary' : 'inherit'
                            })}
                        </ListItemIcon>
                        <ListItemText
                            primary={item.title}
                            primaryTypographyProps={{ fontWeight: isActive(item.path) ? 600 : 400 }}
                        />
                    </SidebarItem>
                ))}
            </List>
        </Box>
    );

    return (
        <>
            <StyledAppBar position='static'>
                <Toolbar sx={{ px: '12px !important', minHeight: '40px !important' }}>
                    {isMobile && (
                        <IconButton
                            color="inherit"
                            aria-label="open drawer"
                            edge="start"
                            onClick={handleDrawerToggle}
                            sx={{ mr: 1, color: 'var(--color-primary-600)', padding: '4px' }}
                        >
                            <MenuIcon fontSize="small" />
                        </IconButton>
                    )}

                    {!isMobile ? (
                        <Box sx={{
                            flexGrow: 1,
                            display: 'flex',
                            justifyContent: 'center', // Center navigation for modern feel
                            overflowX: 'auto',
                            '&::-webkit-scrollbar': { display: 'none' }
                        }}>
                            {links.map((item) => (
                                <NavButton
                                    key={item.title}
                                    component={Link}
                                    to={item.path}
                                    startIcon={React.cloneElement(item.icon, { sx: { fontSize: '18px !important' } })}
                                    active={isActive(item.path) ? 1 : 0}
                                >
                                    {item.title}
                                </NavButton>
                            ))}
                        </Box>
                    ) : (
                        <Box sx={{ flexGrow: 1 }}>
                            <Typography
                                component="h1"
                                variant="h6"
                                color="var(--text-primary)"
                                noWrap
                                sx={{
                                    fontWeight: 700,
                                    letterSpacing: '-0.5px',
                                    background: 'var(--gradient-primary)',
                                    WebkitBackgroundClip: 'text',
                                    WebkitTextFillColor: 'transparent',
                                }}
                            >
                                Menu
                            </Typography>
                        </Box>
                    )}
                </Toolbar>
            </StyledAppBar>

            <Drawer
                variant="temporary"
                open={mobileOpen}
                onClose={handleDrawerToggle}
                ModalProps={{
                    keepMounted: true,
                }}
                sx={{
                    display: { xs: 'block', lg: 'none' },
                    '& .MuiDrawer-paper': { boxSizing: 'border-box', width: 280, backgroundColor: 'var(--bg-paper)' },
                }}
            >
                {mobileDrawer}
            </Drawer>
        </>
    );
};

export default TopNavBar;
