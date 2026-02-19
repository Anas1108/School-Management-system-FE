import React, { useState } from 'react';
import { Box, Avatar, IconButton, Tooltip } from '@mui/material';
import { Settings, Logout, Person } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import CustomMenu from './CustomMenu';

const AccountMenu = () => {
    const [anchorEl, setAnchorEl] = useState(null);
    const navigate = useNavigate();

    const open = Boolean(anchorEl);

    const { currentRole, currentUser } = useSelector(state => state.user);

    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };
    const handleClose = () => {
        setAnchorEl(null);
    };

    const handleProfile = () => {
        handleClose();
        // Since Link is not used directly, we navigate manually or wrap in Link. 
        // Better to use navigate for cleaner action logic in menu items.
        navigate(`/${currentRole}/profile`);
    };

    const handleLogout = () => {
        handleClose();
        navigate('/logout');
    };

    const menuItems = [
        {
            label: 'Profile',
            icon: <Person fontSize="small" />,
            action: handleProfile
        },
        {
            label: 'Settings',
            icon: <Settings fontSize="small" />,
            action: () => {
                handleClose();
                navigate(`/${currentRole}/settings`);
            }
        },
        { divider: true },
        {
            label: 'Logout',
            icon: <Logout fontSize="small" />,
            action: handleLogout,
            color: 'error.main'
        }
    ];

    return (
        <Box sx={{ display: 'flex', alignItems: 'center', textAlign: 'center' }}>
            <Tooltip title="Account settings">
                <IconButton
                    onClick={handleClick}
                    size="small"
                    sx={{
                        ml: 2,
                        transition: 'all 0.2s',
                        '&:hover': { transform: 'scale(1.05)' }
                    }}
                    aria-controls={open ? 'account-menu' : undefined}
                    aria-haspopup="true"
                    aria-expanded={open ? 'true' : undefined}
                >
                    <Avatar sx={{
                        width: 36,
                        height: 36,
                        bgcolor: 'var(--color-primary-600)',
                        fontSize: '1rem',
                        fontWeight: 600
                    }}>
                        {String(currentUser.name).charAt(0)}
                    </Avatar>
                </IconButton>
            </Tooltip>

            <CustomMenu
                anchorEl={anchorEl}
                open={open}
                onClose={handleClose}
                menuItems={menuItems}
            />
        </Box>
    );
}

export default AccountMenu