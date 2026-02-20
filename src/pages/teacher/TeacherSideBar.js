import * as React from 'react';
import { Box, Divider, ListItemButton, ListItemIcon, ListItemText, ListSubheader } from '@mui/material';
import { Link, useLocation } from 'react-router-dom';

import HomeIcon from '@mui/icons-material/Home';
import ExitToAppIcon from "@mui/icons-material/ExitToApp";
import AccountCircleOutlinedIcon from "@mui/icons-material/AccountCircleOutlined";
import AnnouncementOutlinedIcon from '@mui/icons-material/AnnouncementOutlined';
import ClassOutlinedIcon from '@mui/icons-material/ClassOutlined';
import { useSelector } from 'react-redux';

const TeacherSideBar = ({ onLogout }) => {
    const { currentUser } = useSelector((state) => state.user);
    const sclassName = currentUser.teachSclass

    const location = useLocation();
    return (
        <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%', pt: 1 }}>
            <Box sx={{ flex: 1, overflowY: 'auto', overflowX: 'hidden', '&::-webkit-scrollbar': { width: '4px' }, '&::-webkit-scrollbar-thumb': { backgroundColor: 'var(--color-gray-300)', borderRadius: '4px' } }}>
                <React.Fragment>
                    <ListItemButton component={Link} to="/">
                        <ListItemIcon>
                            <HomeIcon color={location.pathname === ("/" || "/Teacher/dashboard") ? 'primary' : 'inherit'} />
                        </ListItemIcon>
                        <ListItemText primary="Home" />
                    </ListItemButton>
                    <ListItemButton component={Link} to="/Teacher/class">
                        <ListItemIcon>
                            <ClassOutlinedIcon color={location.pathname.startsWith("/Teacher/class") ? 'primary' : 'inherit'} />
                        </ListItemIcon>
                        <ListItemText primary={`Class ${sclassName.sclassName}`} />
                    </ListItemButton>
                    <ListItemButton component={Link} to="/Teacher/complain">
                        <ListItemIcon>
                            <AnnouncementOutlinedIcon color={location.pathname.startsWith("/Teacher/complain") ? 'primary' : 'inherit'} />
                        </ListItemIcon>
                        <ListItemText primary="Complain" />
                    </ListItemButton>
                </React.Fragment>
            </Box>
            <Box>
                <Divider sx={{ my: 1 }} />
                <React.Fragment>
                    <ListSubheader component="div" inset>
                        User
                    </ListSubheader>
                    <ListItemButton component={Link} to="/Teacher/profile">
                        <ListItemIcon>
                            <AccountCircleOutlinedIcon color={location.pathname.startsWith("/Teacher/profile") ? 'primary' : 'inherit'} />
                        </ListItemIcon>
                        <ListItemText primary="Profile" />
                    </ListItemButton>
                    <ListItemButton onClick={onLogout}>
                        <ListItemIcon>
                            <ExitToAppIcon />
                        </ListItemIcon>
                        <ListItemText primary="Logout" />
                    </ListItemButton>
                </React.Fragment>
            </Box>
        </Box>
    )
}

export default TeacherSideBar