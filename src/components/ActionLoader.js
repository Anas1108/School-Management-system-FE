import React from 'react';
import { Backdrop, CircularProgress, Typography, Box } from '@mui/material';

const ActionLoader = ({ open, message = "Please wait, processing..." }) => {
    return (
        <Backdrop
            sx={{ color: '#fff', zIndex: (theme) => Math.max(theme.zIndex.drawer, theme.zIndex.modal, theme.zIndex.snackbar, theme.zIndex.tooltip) + 1000 }}
            open={open}
        >
            <Box display="flex" flexDirection="column" alignItems="center">
                <CircularProgress color="inherit" size={60} thickness={4} />
                <Typography variant="h6" sx={{ mt: 2, fontWeight: 'medium', letterSpacing: 1 }}>
                    {message}
                </Typography>
            </Box>
        </Backdrop>
    );
};

export default ActionLoader;
