import React, { useEffect, useState } from 'react';
import {
    Box, Paper, Typography, TextField, MenuItem, Button, Table, TableBody,
    TableCell, TableContainer, TableHead, TableRow, IconButton, Dialog,
    DialogTitle, DialogContent, DialogActions, Grid
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import { useDispatch, useSelector } from 'react-redux';
import axios from 'axios';

const FeeStructure = () => {
    const { currentUser } = useSelector(state => state.user);
    const [classes, setClasses] = useState([]);
    const [feeHeads, setFeeHeads] = useState([]);

    // Fee Head State
    const [newHeadName, setNewHeadName] = useState('');
    const [newHeadDesc, setNewHeadDesc] = useState('');

    // Structure State
    const [selectedClass, setSelectedClass] = useState('');
    const [structure, setStructure] = useState({ feeHeads: [], lateFee: 0 });
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        fetchClasses();
        fetchFeeHeads();
    }, []);

    useEffect(() => {
        if (selectedClass) {
            fetchStructure(selectedClass);
        } else {
            setStructure({ feeHeads: [], lateFee: 0 });
        }
    }, [selectedClass]);

    const fetchClasses = async () => {
        try {
            const result = await axios.get(`${process.env.REACT_APP_BASE_URL}/SclassList/${currentUser._id}`);
            if (!result.data.message) setClasses(result.data);
        } catch (error) { console.error(error); }
    }

    const fetchFeeHeads = async () => {
        try {
            const result = await axios.get(`${process.env.REACT_APP_BASE_URL}/FeeHeads/${currentUser._id}`);
            setFeeHeads(result.data);
        } catch (error) { console.error(error); }
    }

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
            fetchFeeHeads();
        } catch (error) { console.error(error); }
    }

    const fetchStructure = async (classId) => {
        try {
            const result = await axios.get(`${process.env.REACT_APP_BASE_URL}/FeeStructure/${classId}`);
            if (result.data) {
                // Transform to match local state if needed, or use as is
                // Backend returns populated feeHeads usually
                setStructure({
                    feeHeads: result.data.feeHeads.map(h => ({ headId: h.headId._id, amount: h.amount })),
                    lateFee: result.data.lateFee
                });
            } else {
                setStructure({ feeHeads: [], lateFee: 0 });
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
                lateFee: structure.lateFee
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
        <Box sx={{ mt: 4, mb: 4 }}>
            <Typography variant="h4" gutterBottom>Fee Configuration</Typography>

            <Grid container spacing={4}>
                {/* Fee Heads Section */}
                <Grid item xs={12} md={4}>
                    <Paper elevation={3} sx={{ p: 2 }}>
                        <Typography variant="h6" gutterBottom>Create Fee Head</Typography>
                        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                            <TextField
                                label="Head Name (e.g. Tuition)"
                                value={newHeadName}
                                onChange={(e) => setNewHeadName(e.target.value)}
                            />
                            <TextField
                                label="Description"
                                value={newHeadDesc}
                                onChange={(e) => setNewHeadDesc(e.target.value)}
                            />
                            <Button variant="contained" onClick={createFeeHead}>Add Head</Button>
                        </Box>

                        <Box sx={{ mt: 3 }}>
                            <Typography variant="subtitle1" fontWeight="bold">Existing Heads:</Typography>
                            {feeHeads.map(head => (
                                <Typography key={head._id} variant="body2">• {head.name}</Typography>
                            ))}
                        </Box>
                    </Paper>
                </Grid>

                {/* Structure Section */}
                <Grid item xs={12} md={8}>
                    <Paper elevation={3} sx={{ p: 2 }}>
                        <Typography variant="h6" gutterBottom>Class Fee Structure</Typography>
                        <TextField
                            select
                            label="Select Class"
                            fullWidth
                            value={selectedClass}
                            onChange={(e) => setSelectedClass(e.target.value)}
                            sx={{ mb: 3 }}
                        >
                            {classes.map((option) => (
                                <MenuItem key={option._id} value={option._id}>
                                    {option.sclassName}
                                </MenuItem>
                            ))}
                        </TextField>

                        {selectedClass && (
                            <>
                                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
                                    <Typography variant="subtitle1">Fee Breakdown</Typography>
                                    <Button startIcon={<AddIcon />} onClick={addHeadToStructure}>Add Fee</Button>
                                </Box>

                                {structure.feeHeads.map((item, index) => (
                                    <Box key={index} sx={{ display: 'flex', gap: 2, mb: 1 }}>
                                        <TextField
                                            select
                                            label="Head"
                                            value={item.headId}
                                            onChange={(e) => updateStructureHead(index, 'headId', e.target.value)}
                                            sx={{ flex: 1 }}
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
                                            sx={{ width: 150 }}
                                        />
                                        <IconButton onClick={() => removeHeadFromStructure(index)} color="error">
                                            <DeleteIcon />
                                        </IconButton>
                                    </Box>
                                ))}

                                <Box sx={{ mt: 3, mb: 2 }}>
                                    <TextField
                                        label="Late Fee Fine"
                                        type="number"
                                        fullWidth
                                        value={structure.lateFee}
                                        onChange={(e) => setStructure({ ...structure, lateFee: e.target.value })}
                                        helperText="Fine amount if paid after due date"
                                    />
                                </Box>

                                <Button variant="contained" color="primary" fullWidth onClick={handleSaveStructure}>
                                    Save Structure
                                </Button>
                            </>
                        )}
                    </Paper>
                </Grid>
            </Grid>
        </Box>
    );
};

export default FeeStructure;
