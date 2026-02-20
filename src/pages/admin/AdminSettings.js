import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
    Box,
    Container,
    Paper,
    Typography,
    TextField,
    Button,
    Grid,
    CircularProgress,
    Alert,
    Snackbar,
    Divider
} from '@mui/material';
import { Security as SecurityIcon } from '@mui/icons-material';
import { updateUser } from '../../redux/userRelated/userHandle';
import { underControl } from '../../redux/userRelated/userSlice';

const AdminSettings = () => {
    const dispatch = useDispatch();
    const { currentUser, status, error, response } = useSelector((state) => state.user);

    const [passwordData, setPasswordData] = useState({
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
    });

    const [loading, setLoading] = useState(false);
    const [showAlert, setShowAlert] = useState(false);
    const [alertMessage, setAlertMessage] = useState('');
    const [alertSeverity, setAlertSeverity] = useState('success');

    useEffect(() => {
        if (status === 'added' || status === 'success') {
            setLoading(false);
            if (status === 'added' || (status === 'success' && loading)) {
                setAlertSeverity('success');
                setAlertMessage('Password updated successfully!');
                setShowAlert(true);
                setPasswordData({
                    currentPassword: '',
                    newPassword: '',
                    confirmPassword: '',
                });
            }
            dispatch(underControl());
        } else if (status === 'failed' || status === 'error') {
            setLoading(false);
            if (loading) {
                setAlertSeverity('error');
                setAlertMessage(response || error || 'Something went wrong');
                setShowAlert(true);
            }
            dispatch(underControl());
        }
    }, [status, response, error, dispatch, loading]);

    const handlePasswordChange = (e) => {
        const { name, value } = e.target;
        setPasswordData({ ...passwordData, [name]: value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        if (passwordData.newPassword !== passwordData.confirmPassword) {
            setAlertSeverity('error');
            setAlertMessage('New passwords do not match');
            setShowAlert(true);
            return;
        }

        if (passwordData.newPassword.length < 6) {
            setAlertSeverity('error');
            setAlertMessage('Password must be at least 6 characters long');
            setShowAlert(true);
            return;
        }

        setLoading(true);
        const fields = { password: passwordData.newPassword };
        dispatch(updateUser(fields, currentUser._id, "Admin"));
    };

    return (
        <Container maxWidth="md" sx={{ mt: 4, mb: 4 }}>
            <Paper elevation={3} sx={{
                p: 4,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                borderRadius: 'var(--border-radius-xl)',
                background: 'var(--bg-paper)',
                border: '1px solid var(--border-color)'
            }}>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 3, width: '100%', justifyContent: 'center' }}>
                    <SecurityIcon sx={{ mr: 1, color: 'var(--color-primary-600)', fontSize: '2rem' }} />
                    <Typography variant="h5" sx={{ fontWeight: 700, color: 'var(--text-primary)' }}>
                        Security & Password
                    </Typography>
                </Box>

                <Divider sx={{ mb: 4, width: '100%' }} />

                <Box component="form" onSubmit={handleSubmit} noValidate sx={{ width: '100%', maxWidth: '600px' }}>
                    <Grid container spacing={3}>
                        <Grid item xs={12}>
                            <TextField
                                fullWidth
                                label="Current Password"
                                name="currentPassword"
                                type="password"
                                value={passwordData.currentPassword}
                                onChange={handlePasswordChange}
                                required
                                helperText="Enter your current password to verify"
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                fullWidth
                                label="New Password"
                                name="newPassword"
                                type="password"
                                value={passwordData.newPassword}
                                onChange={handlePasswordChange}
                                required
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                fullWidth
                                label="Confirm New Password"
                                name="confirmPassword"
                                type="password"
                                value={passwordData.confirmPassword}
                                onChange={handlePasswordChange}
                                required
                            />
                        </Grid>
                        <Grid item xs={12} sx={{ display: 'flex', justifyContent: 'center' }}>
                            <Button
                                type="submit"
                                variant="contained"
                                disabled={loading}
                                sx={{
                                    mt: 2,
                                    py: 1.5,
                                    px: 6,
                                    borderRadius: 'var(--border-radius-lg)',
                                    background: 'var(--gradient-primary)',
                                    boxShadow: 'var(--shadow-md)',
                                    '&:hover': {
                                        background: 'var(--gradient-primary-dark)',
                                    }
                                }}
                            >
                                {loading ? <CircularProgress size={24} color="inherit" /> : 'Update Password'}
                            </Button>
                        </Grid>
                    </Grid>
                </Box>
            </Paper>

            <Snackbar
                open={showAlert}
                autoHideDuration={6000}
                onClose={() => setShowAlert(false)}
                anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
            >
                <Alert onClose={() => setShowAlert(false)} severity={alertSeverity} sx={{ width: '100%', boxShadow: 'var(--shadow-lg)' }}>
                    {alertMessage}
                </Alert>
            </Snackbar>
        </Container>
    );
};

export default AdminSettings;
