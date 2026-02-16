import React from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, Typography, Box } from '@mui/material';
import WarningAmberIcon from '@mui/icons-material/WarningAmber';

const ConfirmationModal = ({ open, handleClose, handleConfirm, title, message, confirmLabel = "Delete", cancelLabel = "Cancel" }) => {
    return (
        <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
            <DialogTitle sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 1 }}>
                <WarningAmberIcon sx={{ fontSize: 40, color: 'orange' }} />
                <Typography variant="h6" component="div">
                    {title}
                </Typography>
            </DialogTitle>
            <DialogContent dividers sx={{ textAlign: 'center' }}>
                <Typography variant="body1">
                    {message}
                </Typography>
            </DialogContent>
            <DialogActions sx={{ justifyContent: 'center', pb: 2, gap: 2 }}>
                <Button onClick={handleClose} variant="outlined" color="primary">
                    {cancelLabel}
                </Button>
                <Button onClick={handleConfirm} variant="contained" color="error">
                    {confirmLabel}
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default ConfirmationModal;
