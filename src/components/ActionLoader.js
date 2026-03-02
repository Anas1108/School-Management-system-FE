import React from 'react';
import { Backdrop, Typography, Box, CircularProgress } from '@mui/material';

const ActionLoader = ({ open, message = "Please wait, processing..." }) => {
    // Strip trailing ellipsis if given, so we can animate it ourselves
    const cleanMessage = message.replace(/\.+$/, '');

    return (
        <Backdrop
            sx={{
                color: '#fff',
                zIndex: (theme) => Math.max(theme.zIndex.drawer, theme.zIndex.modal, theme.zIndex.snackbar, theme.zIndex.tooltip) + 1000,
                backgroundColor: 'rgba(0, 0, 0, 0.4)',
                backdropFilter: 'blur(6px)'
            }}
            open={open}
        >
            <Box
                sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    backgroundColor: 'background.paper',
                    padding: '36px 54px',
                    borderRadius: '24px',
                    boxShadow: '0 12px 40px rgba(0, 0, 0, 0.3)',
                    border: '1px solid',
                    borderColor: 'divider',
                    animation: 'float 3s ease-in-out infinite',
                    '@keyframes float': {
                        '0%': { transform: 'translateY(0px)' },
                        '50%': { transform: 'translateY(-10px)' },
                        '100%': { transform: 'translateY(0px)' }
                    }
                }}
            >
                {/* Modern layered spinner */}
                <Box sx={{ position: 'relative', display: 'inline-flex', mb: 4 }}>
                    <CircularProgress
                        variant="determinate"
                        sx={{
                            color: 'action.hover',
                        }}
                        size={68}
                        thickness={5}
                        value={100}
                    />
                    <CircularProgress
                        variant="indeterminate"
                        disableShrink
                        sx={{
                            color: 'primary.main',
                            animationDuration: '1s',
                            position: 'absolute',
                            left: 0,
                            right: 0,
                            top: 0,
                            bottom: 0,
                            [`& .MuiCircularProgress-circle`]: {
                                strokeLinecap: 'round',
                            },
                        }}
                        size={68}
                        thickness={5}
                    />
                </Box>

                {/* Animated Text */}
                <Box sx={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'center' }}>
                    <Typography
                        variant="h6"
                        sx={{
                            fontWeight: 'bold',
                            color: 'primary.main',
                            letterSpacing: 1,
                            textAlign: 'center',
                            fontSize: '1.2rem',
                        }}
                    >
                        {cleanMessage}
                    </Typography>

                    <Box
                        sx={{
                            display: 'flex',
                            alignItems: 'flex-end',
                            ml: 0.5,
                            pb: 0.5,
                            color: 'primary.main',
                            fontWeight: 'bold',
                            fontSize: '1.5rem',
                            lineHeight: 0.8,
                        }}
                    >
                        <Box component="span" sx={{ animation: 'blink 1.4s infinite both', '@keyframes blink': { '0%': { opacity: 0.2 }, '20%': { opacity: 1 }, '100%': { opacity: 0.2 } } }}>.</Box>
                        <Box component="span" sx={{ animation: 'blink 1.4s infinite both', animationDelay: '0.2s' }}>.</Box>
                        <Box component="span" sx={{ animation: 'blink 1.4s infinite both', animationDelay: '0.4s' }}>.</Box>
                    </Box>
                </Box>
            </Box>
        </Backdrop>
    );
};

export default ActionLoader;
