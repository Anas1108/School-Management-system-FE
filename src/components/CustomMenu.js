import React from 'react';
import { Menu, MenuItem, ListItemIcon, ListItemText, Divider, styled } from '@mui/material';

const CustomMenu = ({ anchorEl, open, onClose, menuItems }) => {
    return (
        <StyledMenu
            anchorEl={anchorEl}
            id="custom-menu"
            open={open}
            onClose={onClose}
            onClick={onClose}
            PaperProps={{
                elevation: 0,
                sx: {
                    overflow: 'visible',
                    filter: 'drop-shadow(0px 4px 20px rgba(0, 0, 0, 0.1))',
                    mt: 1.5,
                    borderRadius: '12px',
                    minWidth: '200px',
                    '& .MuiAvatar-root': {
                        width: 32,
                        height: 32,
                        ml: -0.5,
                        mr: 1,
                    },
                    '&:before': {
                        content: '""',
                        display: 'block',
                        position: 'absolute',
                        top: 0,
                        right: 14,
                        width: 10,
                        height: 10,
                        bgcolor: 'background.paper',
                        transform: 'translateY(-50%) rotate(45deg)',
                        zIndex: 0,
                    },
                },
            }}
            transformOrigin={{ horizontal: 'right', vertical: 'top' }}
            anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
        >
            {menuItems.map((item, index) => (
                <div key={index}>
                    {item.divider ? (
                        <Divider sx={{ my: 1, borderColor: 'var(--border-color)' }} />
                    ) : (
                        <StyledMenuItem onClick={item.action}>
                            {item.icon && (
                                <ListItemIcon sx={{ color: item.color || 'var(--text-secondary)' }}>
                                    {item.icon}
                                </ListItemIcon>
                            )}
                            <ListItemText
                                primary={item.label}
                                primaryTypographyProps={{
                                    fontSize: '0.95rem',
                                    fontWeight: 500,
                                    color: item.color || 'var(--text-primary)'
                                }}
                            />
                        </StyledMenuItem>
                    )}
                </div>
            ))}
        </StyledMenu>
    );
};

export default CustomMenu;

const StyledMenu = styled(Menu)(({ theme }) => ({
    '& .MuiPaper-root': {
        border: '1px solid var(--border-color)',
        backgroundColor: 'var(--bg-paper)',
    }
}));

const StyledMenuItem = styled(MenuItem)(({ theme }) => ({
    margin: '4px 8px',
    borderRadius: '8px',
    transition: 'all 0.2s ease-in-out',
    padding: '10px 16px',

    '&:hover': {
        backgroundColor: 'var(--color-primary-50)',
        transform: 'translateY(-1px)',

        '& .MuiListItemIcon-root': {
            color: 'var(--color-primary-600)',
        },
        '& .MuiTypography-root': {
            color: 'var(--color-primary-700)',
        }
    },
}));
