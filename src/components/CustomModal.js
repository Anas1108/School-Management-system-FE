import React from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, Typography } from '@mui/material';
import WarningAmberIcon from '@mui/icons-material/WarningAmber';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';

const CustomModal = ({ open, handleClose, title, message, type = 'info' }) => {

    const getIcon = () => {
        if (type === 'warning') return <WarningAmberIcon sx={{ fontSize: 40, color: 'orange' }} />;
        if (type === 'error') return <ErrorOutlineIcon sx={{ fontSize: 40, color: 'red' }} />;
        if (type === 'success') return <CheckCircleOutlineIcon sx={{ fontSize: 40, color: 'green' }} />;
        return null;
    };

    return (
        <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
            <DialogTitle sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 1 }}>
                {getIcon()}
                <Typography variant="h6" component="div">
                    {title}
                </Typography>
            </DialogTitle>
            <DialogContent dividers sx={{ textAlign: 'center' }}>
                <Typography variant="body1">
                    {message}
                </Typography>
            </DialogContent>
            <DialogActions sx={{ justifyContent: 'center', pb: 2 }}>
                <Button onClick={handleClose} variant="contained" color="primary">
                    OK
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default CustomModal;
