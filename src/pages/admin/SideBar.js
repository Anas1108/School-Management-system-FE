import * as React from 'react';
import { Divider, ListItemButton, ListItemIcon, ListItemText, ListSubheader, Box } from '@mui/material';
import { Link, useLocation } from 'react-router-dom';
import styled from 'styled-components';

import HomeIcon from "@mui/icons-material/Home";
import PersonOutlineIcon from "@mui/icons-material/PersonOutline";
import ExitToAppIcon from "@mui/icons-material/ExitToApp";
import AccountCircleOutlinedIcon from "@mui/icons-material/AccountCircleOutlined";
import AnnouncementOutlinedIcon from '@mui/icons-material/AnnouncementOutlined';
import ClassOutlinedIcon from '@mui/icons-material/ClassOutlined';
import SupervisorAccountOutlinedIcon from '@mui/icons-material/SupervisorAccountOutlined';
import ReportIcon from '@mui/icons-material/Report';
import AssignmentIcon from '@mui/icons-material/Assignment';

const SideBar = ({ open }) => {
    const location = useLocation();

    // Helper to check active path
    const isActive = (path) => {
        if (path === "/") {
            return location.pathname === "/" || location.pathname === "/Admin/dashboard";
        }
        return location.pathname.startsWith(path);
    };

    const mainMenuItems = [
        { text: 'Home', icon: <HomeIcon />, link: '/' },
        { text: 'Classes', icon: <ClassOutlinedIcon />, link: '/Admin/classes' },
        { text: 'Subjects', icon: <AssignmentIcon />, link: '/Admin/subjects' },
        { text: 'Teachers', icon: <SupervisorAccountOutlinedIcon />, link: '/Admin/teachers' },
        { text: 'Students', icon: <PersonOutlineIcon />, link: '/Admin/students' },
        { text: 'Notices', icon: <AnnouncementOutlinedIcon />, link: '/Admin/notices' },
        { text: 'Complains', icon: <ReportIcon />, link: '/Admin/complains' },
    ];

    const userMenuItems = [
        { text: 'Profile', icon: <AccountCircleOutlinedIcon />, link: '/Admin/profile' },
        { text: 'Logout', icon: <ExitToAppIcon />, link: '/logout' },
    ];

    const renderMenuItem = (item) => (
        <StyledListItemButton
            key={item.text}
            component={Link}
            to={item.link}
            selected={isActive(item.link)}
            sx={{
                justifyContent: open ? 'initial' : 'center',
                px: 2.5,
            }}
        >
            <ListItemIcon sx={{
                minWidth: 0,
                mr: open ? 3 : 'auto',
                justifyContent: 'center',
                color: isActive(item.link) ? 'var(--color-primary-600)' : 'inherit'
            }}>
                {React.cloneElement(item.icon, {
                    color: isActive(item.link) ? 'primary' : 'inherit'
                })}
            </ListItemIcon>
            <ListItemText
                primary={item.text}
                sx={{
                    opacity: open ? 1 : 0,
                    display: open ? 'block' : 'none',
                    whiteSpace: 'nowrap'
                }}
            />
        </StyledListItemButton>
    );

    return (
        <Box sx={{ px: open ? 2 : 1, pt: 2, display: 'flex', flexDirection: 'column', height: '100%' }}>
            <Box sx={{ flex: 1, overflowY: 'auto', overflowX: 'hidden', '&::-webkit-scrollbar': { width: '4px' }, '&::-webkit-scrollbar-thumb': { backgroundColor: 'var(--color-gray-300)', borderRadius: '4px' } }}>
                <React.Fragment>
                    {open && (
                        <ListSubheader component="div" inset sx={{
                            bgcolor: 'transparent',
                            color: 'var(--text-tertiary)',
                            fontWeight: 600,
                            fontSize: '0.75rem',
                            textTransform: 'uppercase',
                            letterSpacing: '1px',
                            mb: 1,
                            pl: 1
                        }}>
                            Menu
                        </ListSubheader>
                    )}

                    {mainMenuItems.map(renderMenuItem)}
                </React.Fragment>
            </Box>

            <Box>
                <Divider sx={{ my: 2, borderColor: 'var(--border-color)' }} />

                <React.Fragment>
                    {open && (
                        <ListSubheader component="div" inset sx={{
                            bgcolor: 'transparent',
                            color: 'var(--text-tertiary)',
                            fontWeight: 600,
                            fontSize: '0.75rem',
                            textTransform: 'uppercase',
                            letterSpacing: '1px',
                            mb: 1,
                            pl: 1
                        }}>
                            User
                        </ListSubheader>
                    )}

                    {userMenuItems.map(renderMenuItem)}
                </React.Fragment>
            </Box>
        </Box>
    )
}

export default SideBar;

const StyledListItemButton = styled(ListItemButton)`
  && {
    border-radius: var(--border-radius-lg);
    margin-bottom: 4px;
    padding-top: 10px;
    padding-bottom: 10px;
    transition: all 0.2s ease-in-out;
    color: var(--text-secondary);
    min-height: 48px;

    &:hover {
      background-color: var(--color-primary-50);
      color: var(--color-primary-700);
      
      .MuiListItemIcon-root {
        color: var(--color-primary-600);
      }
    }

    &.Mui-selected {
      background-color: var(--color-primary-100);
      color: var(--color-primary-800);
      font-weight: 600;

      &:hover {
        background-color: var(--color-primary-200);
      }
      
      .MuiListItemIcon-root {
        color: var(--color-primary-700);
      }
      
      .MuiTypography-root {
        font-weight: 600;
      }
    }
  }
`;
