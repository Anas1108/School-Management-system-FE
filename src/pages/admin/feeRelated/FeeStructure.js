import React, { useEffect, useState, useCallback } from 'react';
import {
    Box, Paper, Typography, TextField, MenuItem, Button, IconButton, Dialog,
    DialogTitle, DialogContent, DialogActions, Grid
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const FeeStructure = () => {
    const navigate = useNavigate();
    const { currentUser } = useSelector(state => state.user);
    const [classes, setClasses] = useState([]);
    const [feeHeads, setFeeHeads] = useState([]);

    // Fee Head State
    const [newHeadName, setNewHeadName] = useState('');
    const [newHeadDesc, setNewHeadDesc] = useState('');
    const [headModalOpen, setHeadModalOpen] = useState(false);

    // Structure State
    const [selectedClass, setSelectedClass] = useState('');
    const [structure, setStructure] = useState({ feeHeads: [], lateFee: 0, dueDay: 10 });
    const [loading] = useState(false);

    useEffect(() => {
        fetchClasses();
        fetchFeeHeads();
    }, [fetchClasses, fetchFeeHeads]);

    useEffect(() => {
        if (selectedClass) {
            fetchStructure(selectedClass);
        } else {
            setStructure({ feeHeads: [], lateFee: 0, dueDay: 10 });
        }
    }, [selectedClass]);

    const fetchClasses = useCallback(async () => {
        try {
            const result = await axios.get(`${process.env.REACT_APP_BASE_URL}/SclassList/${currentUser._id}`);
            if (!result.data.message) setClasses(result.data);
        } catch (error) { console.error(error); }
    }, [currentUser._id]);

    const fetchFeeHeads = useCallback(async () => {
        try {
            const result = await axios.get(`${process.env.REACT_APP_BASE_URL}/FeeHeads/${currentUser._id}`);
            setFeeHeads(result.data);
        } catch (error) { console.error(error); }
    }, [currentUser._id]);

    const createFeeHead = async () => {
        if (!newHeadName) return;
        try {
            await axios.post(`${process.env.REACT_APP_BASE_URL}/FeeHeadCreate`, {
                name: newHeadName,
                description: newHeadDesc,
                adminID: currentUser._id
            });
            setNewHeadName('');
            setNewHeadDesc('');
            setHeadModalOpen(false);
            fetchFeeHeads();
        } catch (error) { console.error(error); }
    }

    const fetchStructure = async (classId) => {
        try {
            const result = await axios.get(`${process.env.REACT_APP_BASE_URL}/FeeStructure/${classId}`);
            if (result.data) {
                setStructure({
                    feeHeads: result.data.feeHeads.map(h => ({ headId: h.headId._id, amount: h.amount })),
                    lateFee: result.data.lateFee,
                    dueDay: result.data.dueDay || 10
                });
            } else {
                setStructure({ feeHeads: [], lateFee: 0, dueDay: 10 });
            }
        } catch (error) { console.error(error); }
    }

    const handleSaveStructure = async () => {
        if (!selectedClass) return;
        try {
            await axios.post(`${process.env.REACT_APP_BASE_URL}/FeeStructureCreate`, {
                classId: selectedClass,
                adminID: currentUser._id,
                feeHeads: structure.feeHeads,
                lateFee: structure.lateFee,
                dueDay: structure.dueDay
            });
            alert("Fee Structure Saved");
        } catch (error) { console.error(error); alert("Failed to save"); }
    }

    const addHeadToStructure = () => {
        setStructure({ ...structure, feeHeads: [...structure.feeHeads, { headId: '', amount: 0 }] });
    }

    const updateStructureHead = (index, field, value) => {
        const newHeads = [...structure.feeHeads];
        newHeads[index][field] = value;
        setStructure({ ...structure, feeHeads: newHeads });
    }

    const removeHeadFromStructure = (index) => {
        const newHeads = [...structure.feeHeads];
        newHeads.splice(index, 1);
        setStructure({ ...structure, feeHeads: newHeads });
    }

    return (
        <Box sx={{ mt: 2, mb: 4, px: 3 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
                <Typography variant="h4" fontWeight="bold">Fee Configuration</Typography>
                <Box sx={{ display: 'flex', gap: 1 }}>
                    <Button
                        variant="outlined"
                        startIcon={<ArrowBackIcon />}
                        onClick={() => navigate('/Admin/fees')}
                        sx={{ borderRadius: 2 }}
                    >
                        Back to Dashboard
                    </Button>
                    <Button
                        variant="contained"
                        startIcon={<AddIcon />}
                        onClick={() => setHeadModalOpen(true)}
                        sx={{ borderRadius: 2 }}
                    >
                        Create Fee Head
                    </Button>
                </Box>
            </Box>

            <Grid container spacing={4}>
                <Grid item xs={12} md={4}>
                    <Paper elevation={0} sx={{ p: 3, borderRadius: 3, border: '1px solid', borderColor: 'divider' }}>
                        <Typography variant="h6" fontWeight="bold" gutterBottom>Fee Heads</Typography>
                        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                            Define global fee categories (e.g., Tuition, Sports).
                        </Typography>
                        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                            {feeHeads.length > 0 ? feeHeads.map(head => (
                                <Box key={head._id} sx={{ p: 1.5, borderRadius: 2, bgcolor: 'action.hover', border: '1px solid', borderColor: 'divider' }}>
                                    <Typography variant="subtitle2" fontWeight="bold">{head.name}</Typography>
                                    {head.description && <Typography variant="caption" color="text.secondary">{head.description}</Typography>}
                                </Box>
                            )) : (
                                <Typography variant="body2" color="text.secondary" align="center">No fee heads created yet.</Typography>
                            )}
                        </Box>
                    </Paper>
                </Grid>

                <Grid item xs={12} md={8}>
                    <Paper elevation={0} sx={{ p: 3, borderRadius: 3, border: '1px solid', borderColor: 'divider' }}>
                        <Typography variant="h6" fontWeight="bold" gutterBottom>Class Fee Structure</Typography>
                        <TextField
                            select
                            label="Select Class"
                            fullWidth
                            value={selectedClass}
                            onChange={(e) => setSelectedClass(e.target.value)}
                            sx={{ mb: 4 }}
                            size="small"
                        >
                            {classes.map((option) => (
                                <MenuItem key={option._id} value={option._id}>
                                    {option.sclassName}
                                </MenuItem>
                            ))}
                        </TextField>

                        {selectedClass ? (
                            <>
                                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
                                    <Typography variant="subtitle1" fontWeight="bold">Fee Breakdown</Typography>
                                    <Button variant="outlined" size="small" startIcon={<AddIcon />} onClick={addHeadToStructure}>Add Row</Button>
                                </Box>

                                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mb: 4 }}>
                                    {structure.feeHeads.map((item, index) => (
                                        <Box key={index} sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
                                            <TextField
                                                select
                                                label="Head"
                                                value={item.headId}
                                                onChange={(e) => updateStructureHead(index, 'headId', e.target.value)}
                                                sx={{ flex: 1 }}
                                                size="small"
                                            >
                                                {feeHeads.map(head => (
                                                    <MenuItem key={head._id} value={head._id}>{head.name}</MenuItem>
                                                ))}
                                            </TextField>
                                            <TextField
                                                label="Amount"
                                                type="number"
                                                value={item.amount}
                                                onChange={(e) => updateStructureHead(index, 'amount', e.target.value)}
                                                sx={{ width: 180 }}
                                                size="small"
                                            />
                                            <IconButton onClick={() => removeHeadFromStructure(index)} color="error" size="small">
                                                <DeleteIcon />
                                            </IconButton>
                                        </Box>
                                    ))}
                                    {structure.feeHeads.length === 0 && (
                                        <Typography variant="body2" color="text.secondary" align="center" sx={{ py: 2, bgcolor: 'action.hover', borderRadius: 2 }}>
                                            No fees added to this structure yet.
                                        </Typography>
                                    )}
                                </Box>

                                <Typography variant="subtitle1" fontWeight="bold" gutterBottom>Configuration</Typography>
                                <Grid container spacing={2} sx={{ mb: 4 }}>
                                    <Grid item xs={12} md={6}>
                                        <TextField
                                            label="Late Fee Fine"
                                            type="number"
                                            fullWidth
                                            value={structure.lateFee}
                                            onChange={(e) => setStructure({ ...structure, lateFee: e.target.value })}
                                            helperText="Fine amount if paid after due date"
                                            size="small"
                                        />
                                    </Grid>
                                    <Grid item xs={12} md={6}>
                                        <TextField
                                            label="Due Day of Month"
                                            type="number"
                                            fullWidth
                                            value={structure.dueDay}
                                            onChange={(e) => setStructure({ ...structure, dueDay: e.target.value })}
                                            helperText="Day of the month when fee is due (1-31)"
                                            inputProps={{ min: 1, max: 31 }}
                                            size="small"
                                        />
                                    </Grid>
                                </Grid>

                                <Button variant="contained" color="primary" fullWidth onClick={handleSaveStructure} size="large" sx={{ borderRadius: 2 }}>
                                    Save Class Structure
                                </Button>
                            </>
                        ) : (
                            <Box sx={{ py: 8, display: 'flex', justifyContent: 'center', alignItems: 'center', bgcolor: 'action.hover', borderRadius: 2 }}>
                                <Typography color="text.secondary">Select a class to configure its fee structure</Typography>
                            </Box>
                        )}
                    </Paper>
                </Grid>
            </Grid>

            {/* Create Fee Head Modal */}
            <Dialog open={headModalOpen} onClose={() => setHeadModalOpen(false)} maxWidth="xs" fullWidth>
                <DialogTitle sx={{ fontWeight: 'bold' }}>Create New Fee Head</DialogTitle>
                <DialogContent>
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 1 }}>
                        <TextField
                            label="Head Name (e.g. Tuition)"
                            fullWidth
                            value={newHeadName}
                            onChange={(e) => setNewHeadName(e.target.value)}
                        />
                        <TextField
                            label="Description"
                            fullWidth
                            multiline
                            rows={3}
                            value={newHeadDesc}
                            onChange={(e) => setNewHeadDesc(e.target.value)}
                        />
                    </Box>
                </DialogContent>
                <DialogActions sx={{ p: 3 }}>
                    <Button onClick={() => setHeadModalOpen(false)} color="inherit">Cancel</Button>
                    <Button variant="contained" onClick={createFeeHead}>Create Head</Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
};

export default FeeStructure;
