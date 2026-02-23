import React, { useEffect, useState, useCallback } from 'react';
import {
    Container, Box, Typography, Button, IconButton, Dialog,
    DialogTitle, DialogContent, DialogActions, TextField, Grid,
    Card, CardContent, MenuItem
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import CustomModal from '../../../components/CustomModal';

const FeeDiscounts = () => {
    const navigate = useNavigate();
    const { currentUser } = useSelector(state => state.user);
    const [discountGroups, setDiscountGroups] = useState([]);

    const [newGroupName, setNewGroupName] = useState('');
    const [newGroupDesc, setNewGroupDesc] = useState('');
    const [newGroupType, setNewGroupType] = useState('Percentage');
    const [newGroupValue, setNewGroupValue] = useState(0);
    const [editingGroupId, setEditingGroupId] = useState(null);
    const [modalOpen, setModalOpen] = useState(false);

    const [messageData, setMessageData] = useState({ open: false, title: '', message: '', type: 'info' });

    const fetchDiscountGroups = useCallback(async () => {
        try {
            const result = await axios.get(`${process.env.REACT_APP_BASE_URL}/DiscountGroups/${currentUser._id}`);
            if (result.data) {
                setDiscountGroups(result.data);
            }
        } catch (error) {
            console.error("Error fetching discounts:", error);
        }
    }, [currentUser._id]);

    useEffect(() => {
        fetchDiscountGroups();
    }, [fetchDiscountGroups]);

    const handleOpenModal = (group = null) => {
        if (group) {
            setEditingGroupId(group._id);
            setNewGroupName(group.name);
            setNewGroupDesc(group.description);
            setNewGroupType(group.type || 'Percentage');
            setNewGroupValue(group.value || 0);
        } else {
            setEditingGroupId(null);
            setNewGroupName('');
            setNewGroupDesc('');
            setNewGroupType('Percentage');
            setNewGroupValue(0);
        }
        setModalOpen(true);
    };

    const saveDiscountGroup = async () => {
        if (!newGroupName) return;
        try {
            if (editingGroupId) {
                await axios.put(`${process.env.REACT_APP_BASE_URL}/DiscountGroupUpdate/${editingGroupId}`, {
                    name: newGroupName,
                    description: newGroupDesc,
                    type: newGroupType,
                    value: newGroupValue
                });
                setMessageData({ open: true, title: 'Success', message: 'Discount Group updated', type: 'success' });
            } else {
                await axios.post(`${process.env.REACT_APP_BASE_URL}/DiscountGroupCreate`, {
                    name: newGroupName,
                    description: newGroupDesc,
                    type: newGroupType,
                    value: newGroupValue,
                    adminID: currentUser._id
                });
                setMessageData({ open: true, title: 'Success', message: 'Discount Group created', type: 'success' });
            }
            setModalOpen(false);
            fetchDiscountGroups();
        } catch (error) {
            console.error(error);
            setMessageData({ open: true, title: 'Error', message: error.response?.data?.message || 'Error saving', type: 'error' });
        }
    };

    const deleteDiscountGroup = async (id) => {
        if (!window.confirm("Are you sure you want to delete this discount preset?")) return;
        try {
            await axios.delete(`${process.env.REACT_APP_BASE_URL}/DiscountGroupDelete/${id}`);
            setMessageData({ open: true, title: 'Success', message: 'Discount Group deleted', type: 'success' });
            fetchDiscountGroups();
        } catch (error) {
            console.error(error);
            setMessageData({ open: true, title: 'Error', message: 'Failed to delete', type: 'error' });
        }
    };

    return (
        <Container maxWidth={false} sx={{ mt: 2, mb: 2 }}>
            <Box sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, justifyContent: 'space-between', alignItems: { xs: 'flex-start', sm: 'center' }, gap: 2, mb: 4 }}>
                <Typography variant="h4" component="h1" sx={{ fontWeight: 'bold', color: 'var(--text-primary)' }}>
                    Manage Discounts
                </Typography>
                <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
                    <Button
                        variant="outlined"
                        startIcon={<ArrowBackIcon />}
                        onClick={() => navigate('/Admin/fees')}
                        sx={{ borderRadius: 'var(--border-radius-md)', px: 2, textTransform: 'none' }}
                    >
                        Back
                    </Button>
                    <Button
                        variant="contained"
                        startIcon={<AddIcon />}
                        onClick={() => handleOpenModal()}
                        sx={{ borderRadius: 'var(--border-radius-md)', px: 2, textTransform: 'none', boxShadow: 'none' }}
                    >
                        Create Discount Group
                    </Button>
                </Box>
            </Box>

            <Grid container spacing={3}>
                {discountGroups.length > 0 ? discountGroups.map((group) => (
                    <Grid item xs={12} sm={6} md={4} key={group._id}>
                        <Card sx={{ borderRadius: 2, boxShadow: '0 2px 10px rgba(0,0,0,0.05)' }}>
                            <CardContent>
                                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                                    <Box>
                                        <Typography variant="h6" fontWeight="bold" gutterBottom>{group.name}</Typography>
                                        <Typography variant="body2" color="text.secondary">
                                            {group.description || "No description provided."}
                                        </Typography>
                                        <Typography variant="subtitle2" sx={{ mt: 1, color: 'primary.main' }}>
                                            Value: {group.value}{group.type === 'Percentage' ? '%' : ' PKR'}
                                        </Typography>
                                    </Box>
                                    <Box sx={{ display: 'flex', gap: 0.5, flexDirection: 'column' }}>
                                        <IconButton size="small" color="primary" onClick={() => handleOpenModal(group)}>
                                            <EditIcon fontSize="small" />
                                        </IconButton>
                                        <IconButton size="small" color="error" onClick={() => deleteDiscountGroup(group._id)}>
                                            <DeleteIcon fontSize="small" />
                                        </IconButton>
                                    </Box>
                                </Box>
                            </CardContent>
                        </Card>
                    </Grid>
                )) : (
                    <Grid item xs={12}>
                        <Box sx={{ p: 4, textAlign: 'center', bgcolor: 'var(--bg-paper)', borderRadius: 2 }}>
                            <Typography color="text.secondary">No discount groups created yet.</Typography>
                        </Box>
                    </Grid>
                )}
            </Grid>

            {/* Modal */}
            <Dialog open={modalOpen} onClose={() => setModalOpen(false)} maxWidth="sm" fullWidth>
                <DialogTitle sx={{ fontWeight: 'bold' }}>{editingGroupId ? 'Edit Discount Group' : 'Create Discount Group'}</DialogTitle>
                <DialogContent>
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 1 }}>
                        <TextField
                            label="Group Name (e.g. Family Discount)"
                            fullWidth
                            value={newGroupName}
                            onChange={(e) => setNewGroupName(e.target.value)}
                        />
                        <TextField
                            label="Description"
                            fullWidth
                            multiline
                            rows={3}
                            value={newGroupDesc}
                            onChange={(e) => setNewGroupDesc(e.target.value)}
                        />
                        <Grid container spacing={2}>
                            <Grid item xs={12} sm={6}>
                                <TextField
                                    select
                                    label="Discount Type"
                                    value={newGroupType}
                                    onChange={(e) => setNewGroupType(e.target.value)}
                                    fullWidth
                                >
                                    <MenuItem value="Percentage">Percentage (%)</MenuItem>
                                    <MenuItem value="FixedAmount">Fixed Amount (PKR)</MenuItem>
                                </TextField>
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <TextField
                                    label="Discount Value"
                                    type="number"
                                    value={newGroupValue}
                                    onChange={(e) => {
                                        let val = Number(e.target.value);
                                        if (newGroupType === 'Percentage') {
                                            if (val < 0) val = 0;
                                            if (val > 100) val = 100;
                                        } else {
                                            if (val < 0) val = 0;
                                        }
                                        setNewGroupValue(val);
                                    }}
                                    fullWidth
                                    inputProps={newGroupType === 'Percentage' ? { min: 0, max: 100 } : { min: 0 }}
                                />
                            </Grid>
                        </Grid>
                    </Box>
                </DialogContent>
                <DialogActions sx={{ p: 3 }}>
                    <Button onClick={() => setModalOpen(false)} color="inherit">Cancel</Button>
                    <Button variant="contained" onClick={saveDiscountGroup}>{editingGroupId ? 'Save Changes' : 'Create'}</Button>
                </DialogActions>
            </Dialog>

            <CustomModal
                open={messageData.open}
                handleClose={() => setMessageData({ ...messageData, open: false })}
                title={messageData.title}
                message={messageData.message}
                type={messageData.type}
            />
        </Container>
    );
};

export default FeeDiscounts;
