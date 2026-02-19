import * as React from 'react';
import { Box, Divider, ListItemButton, ListItemIcon, ListItemText, ListSubheader } from '@mui/material';
import { Link, useLocation } from 'react-router-dom';
import styled from 'styled-components';

import HomeIcon from '@mui/icons-material/Home';
import ExitToAppIcon from "@mui/icons-material/ExitToApp";
import AccountCircleOutlinedIcon from "@mui/icons-material/AccountCircleOutlined";
import AnnouncementOutlinedIcon from '@mui/icons-material/AnnouncementOutlined';
import ClassOutlinedIcon from '@mui/icons-material/ClassOutlined';
import AssignmentIcon from '@mui/icons-material/Assignment';

const StudentSideBar = ({ onLogout }) => {
    const location = useLocation();

    const isActive = (path) => {
        if (path === '/' || path === '/Student/dashboard') {
            return location.pathname === '/' || location.pathname === '/Student/dashboard';
        }
        return location.pathname.startsWith(path);
    };

    return (
        <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%', pt: 1 }}>
            <Box sx={{ flex: 1, overflowY: 'auto', overflowX: 'hidden', '&::-webkit-scrollbar': { width: '4px' }, '&::-webkit-scrollbar-thumb': { backgroundColor: 'var(--color-gray-300)', borderRadius: '4px' } }}>
                <React.Fragment>
                    <StyledListItemButton component={Link} to="/" $active={isActive('/')}>
                        <ListItemIcon>
                            <HomeIcon sx={{ color: isActive('/') ? 'var(--color-primary-600)' : 'inherit' }} />
                        </ListItemIcon>
                        <ListItemText primary="Home" />
                    </StyledListItemButton>
                    <StyledListItemButton component={Link} to="/Student/subjects" $active={isActive('/Student/subjects')}>
                        <ListItemIcon>
                            <AssignmentIcon sx={{ color: isActive('/Student/subjects') ? 'var(--color-primary-600)' : 'inherit' }} />
                        </ListItemIcon>
                        <ListItemText primary="Subjects" />
                    </StyledListItemButton>
                    <StyledListItemButton component={Link} to="/Student/attendance" $active={isActive('/Student/attendance')}>
                        <ListItemIcon>
                            <ClassOutlinedIcon sx={{ color: isActive('/Student/attendance') ? 'var(--color-primary-600)' : 'inherit' }} />
                        </ListItemIcon>
                        <ListItemText primary="Attendance" />
                    </StyledListItemButton>
                    <StyledListItemButton component={Link} to="/Student/complain" $active={isActive('/Student/complain')}>
                        <ListItemIcon>
                            <AnnouncementOutlinedIcon sx={{ color: isActive('/Student/complain') ? 'var(--color-primary-600)' : 'inherit' }} />
                        </ListItemIcon>
                        <ListItemText primary="Complain" />
                    </StyledListItemButton>
                </React.Fragment>
            </Box>
            <Box>
                <Divider sx={{ my: 1 }} />
                <React.Fragment>
                    <StyledListSubheader component="div" inset>
                        User
                    </StyledListSubheader>
                    <StyledListItemButton component={Link} to="/Student/profile" $active={isActive('/Student/profile')}>
                        <ListItemIcon>
                            <AccountCircleOutlinedIcon sx={{ color: isActive('/Student/profile') ? 'var(--color-primary-600)' : 'inherit' }} />
                        </ListItemIcon>
                        <ListItemText primary="Profile" />
                    </StyledListItemButton>
                    <StyledListItemButton onClick={onLogout}>
                        <ListItemIcon>
                            <ExitToAppIcon />
                        </ListItemIcon>
                        <ListItemText primary="Logout" />
                    </StyledListItemButton>
                </React.Fragment>
            </Box>
        </Box>
    )
}

export default StudentSideBar

const StyledListItemButton = styled(ListItemButton)`
    && {
        border-radius: var(--border-radius-md);
        margin: 4px 8px;
        transition: all 0.2s ease;
        background: ${props => props.$active ? 'var(--color-primary-50)' : 'transparent'};
        
        &:hover {
            background: var(--color-primary-100);
            transform: translateX(4px);
        }

        .MuiListItemText-primary {
            font-weight: ${props => props.$active ? '600' : '400'};
            color: ${props => props.$active ? 'var(--color-primary-700)' : 'inherit'};
        }
    }
`;

const StyledListSubheader = styled(ListSubheader)`
    && {
        font-weight: 600;
        color: var(--text-secondary);
        font-size: 0.75rem;
        text-transform: uppercase;
        letter-spacing: 0.5px;
        margin-top: 8px;
    }
`;