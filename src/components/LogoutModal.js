import React from 'react';
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogContentText,
    DialogActions,
    Button,
    Box
} from '@mui/material';

const LogoutModal = ({ open, handleClose, handleLogout }) => {
    return (
        <Dialog
            open={open}
            onClose={handleClose}
            aria-labelledby="logout-dialog-title"
            aria-describedby="logout-dialog-description"
        >
            <DialogTitle id="logout-dialog-title">
                {"Confirm Logout"}
            </DialogTitle>
            <DialogContent>
                <DialogContentText id="logout-dialog-description">
                    Are you sure you want to log out from the system?
                </DialogContentText>
            </DialogContent>
            <DialogActions>
                <Button onClick={handleClose} sx={{ color: 'var(--text-secondary)' }}>
                    Cancel
                </Button>
                <Button onClick={handleLogout} color="error" autoFocus>
                    Log Out
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default LogoutModal;
