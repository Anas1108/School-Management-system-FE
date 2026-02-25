import React, { useEffect, useState, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Container, Box, Typography, Button, TextField, Table, TableBody, TableHead, IconButton, Paper, Tooltip, Dialog, DialogTitle, DialogContent, DialogActions } from '@mui/material';
import { StyledTableCell, StyledTableRow } from '../../../components/styles';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import Popup from '../../../components/Popup';
import CustomLoader from '../../../components/CustomLoader';

const LastBalancePresets = () => {
    const navigate = useNavigate();

    const { currentUser } = useSelector(state => state.user);

    const [presets, setPresets] = useState([]);
    const [loading, setLoading] = useState(true);

    const [openAddModal, setOpenAddModal] = useState(false);
    const [newPresetName, setNewPresetName] = useState('');

    const [message, setMessage] = useState("");
    const [showPopup, setShowPopup] = useState(false);
    const [severity, setSeverity] = useState("success");

    const fetchPresets = useCallback(async () => {
        setLoading(true);
        try {
            const result = await axios.get(`${process.env.REACT_APP_BASE_URL}/LastBalancePresets/${currentUser._id}`);
            if (result.data.message) {
                setPresets([]);
            } else {
                setPresets(result.data);
            }
        } catch (error) {
            console.error(error);
            setMessage("Failed to load presets.");
            setSeverity("error");
            setShowPopup(true);
        } finally {
            setLoading(false);
        }
    }, [currentUser._id]);

    useEffect(() => {
        fetchPresets();
    }, [fetchPresets]);

    const handleAddPreset = async () => {
        if (!newPresetName.trim()) {
            setMessage("Please enter a valid preset name.");
            setSeverity("error");
            setShowPopup(true);
            return;
        }

        try {
            const result = await axios.post(`${process.env.REACT_APP_BASE_URL}/LastBalancePresetCreate`, {
                name: newPresetName.trim(),
                adminID: currentUser._id
            });

            if (result.data.message) {
                // Means it exists or failed validation
                setMessage(result.data.message);
                setSeverity("error");
                setShowPopup(true);
            } else {
                setMessage("Preset created successfully.");
                setSeverity("success");
                setShowPopup(true);
                setNewPresetName('');
                setOpenAddModal(false);
                fetchPresets();
            }
        } catch (error) {
            console.error(error);
            setMessage("Error creating preset.");
            setSeverity("error");
            setShowPopup(true);
        }
    };

    const handleDeletePreset = async (id) => {
        if (!window.confirm("Are you sure you want to delete this preset?")) return;

        try {
            await axios.delete(`${process.env.REACT_APP_BASE_URL}/LastBalancePreset/${id}`);
            setMessage("Preset deleted successfully.");
            setSeverity("success");
            setShowPopup(true);
            fetchPresets();
        } catch (error) {
            console.error(error);
            setMessage("Error deleting preset.");
            setSeverity("error");
            setShowPopup(true);
        }
    };

    return (
        <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
            {loading ? (
                <CustomLoader />
            ) : (
                <>
                    <Paper sx={{ p: 3, mb: 3, borderRadius: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <Box>
                            <Typography variant="h5" component="h1" sx={{ fontWeight: 'bold' }}>
                                Global Last Balance Presets
                            </Typography>
                            <Typography variant="body1" color="textSecondary" sx={{ mt: 1 }}>
                                Manage common balance names (e.g., Books, Uniform) available to all students.
                            </Typography>
                        </Box>
                        <Box sx={{ display: 'flex', gap: 1.5 }}>
                            <Tooltip title="Back to Fees">
                                <IconButton size="small" onClick={() => navigate('/Admin/fees')} sx={{ border: '1px solid var(--border-color)', borderRadius: 'var(--border-radius-md)' }}>
                                    <ArrowBackIcon fontSize="small" />
                                </IconButton>
                            </Tooltip>
                        </Box>
                    </Paper>

                    <Paper sx={{ p: 4, borderRadius: 'var(--border-radius-xl)' }}>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                            <Typography variant="h6" fontWeight="bold">Active Presets</Typography>
                            <Button variant="contained" startIcon={<AddIcon />} onClick={() => setOpenAddModal(true)} sx={{ borderRadius: 2, textTransform: 'none', boxShadow: 'none' }}>
                                Add Preset
                            </Button>
                        </Box>

                        <Table>
                            <TableHead>
                                <StyledTableRow>
                                    <StyledTableCell>Preset Name</StyledTableCell>
                                    <StyledTableCell align="right">Actions</StyledTableCell>
                                </StyledTableRow>
                            </TableHead>
                            <TableBody>
                                {presets.map((preset) => (
                                    <StyledTableRow key={preset._id}>
                                        <StyledTableCell>{preset.name}</StyledTableCell>
                                        <StyledTableCell align="right">
                                            <IconButton color="error" onClick={() => handleDeletePreset(preset._id)}>
                                                <DeleteIcon />
                                            </IconButton>
                                        </StyledTableCell>
                                    </StyledTableRow>
                                ))}
                                {presets.length === 0 && (
                                    <StyledTableRow>
                                        <StyledTableCell colSpan={2} align="center">
                                            No global presets found. Click "Add Preset" to start creating them.
                                        </StyledTableCell>
                                    </StyledTableRow>
                                )}
                            </TableBody>
                        </Table>
                    </Paper>
                </>
            )}

            <Dialog open={openAddModal} onClose={() => setOpenAddModal(false)} maxWidth="sm" fullWidth>
                <DialogTitle sx={{ fontWeight: 'bold' }}>Add Global Preset</DialogTitle>
                <DialogContent>
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3, mt: 2 }}>
                        <TextField
                            label="Preset Name (e.g. Books, Uniform)"
                            fullWidth
                            value={newPresetName}
                            onChange={(e) => setNewPresetName(e.target.value)}
                        />
                    </Box>
                </DialogContent>
                <DialogActions sx={{ p: 3 }}>
                    <Button onClick={() => setOpenAddModal(false)} color="inherit">Cancel</Button>
                    <Button variant="contained" onClick={handleAddPreset}>Save</Button>
                </DialogActions>
            </Dialog>

            <Popup message={message} setShowPopup={setShowPopup} showPopup={showPopup} severity={severity} />
        </Container>
    );
};

export default LastBalancePresets;
