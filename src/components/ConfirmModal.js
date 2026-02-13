import React from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, Typography, Box } from '@mui/material';
import WarningAmberIcon from '@mui/icons-material/WarningAmber';

const ConfirmModal = ({ open, handleClose, handleConfirm, title, message }) => {
    return (
        <Dialog open={open} onClose={handleClose} maxWidth="xs" fullWidth>
            <DialogTitle sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 1 }}>
                <WarningAmberIcon sx={{ fontSize: 40, color: 'orange' }} />
                <Typography variant="h6" component="div">
                    {title || "Confirm Action"}
                </Typography>
            </DialogTitle>
            <DialogContent dividers sx={{ textAlign: 'center' }}>
                <Typography variant="body1">
                    {message || "Are you sure you want to proceed?"}
                </Typography>
            </DialogContent>
            <DialogActions sx={{ justifyContent: 'center', pb: 2, gap: 2 }}>
                <Button onClick={handleClose} variant="outlined" color="primary">
                    Cancel
                </Button>
                <Button onClick={handleConfirm} variant="contained" color="error">
                    Confirm
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default ConfirmModal;
