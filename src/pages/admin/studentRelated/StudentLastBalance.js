import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getUserDetails } from '../../../redux/userRelated/userHandle';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import { Box, Button, Typography, Paper, Container, IconButton, Table, TableBody, TableHead, TextField, Dialog, DialogTitle, DialogContent, DialogActions, Tooltip, Autocomplete } from '@mui/material';
import { StyledTableCell, StyledTableRow } from '../../../components/styles';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import SaveIcon from '@mui/icons-material/Save';
import Popup from '../../../components/Popup';
import CustomLoader from '../../../components/CustomLoader';
import { updateStudentFields } from '../../../redux/studentRelated/studentHandle';

const StudentLastBalance = () => {
    const navigate = useNavigate();
    const params = useParams();
    const dispatch = useDispatch();
    const { userDetails, loading, error, response } = useSelector((state) => state.user);

    const studentID = params.id;
    const address = "Student";

    const [balances, setBalances] = useState([]);
    const [presets, setPresets] = useState([]);

    const [openAddModal, setOpenAddModal] = useState(false);
    const [newBalance, setNewBalance] = useState({ feeName: '', amount: 0 });

    const [message, setMessage] = useState("");
    const [showPopup, setShowPopup] = useState(false);
    const [severity, setSeverity] = useState("success");

    useEffect(() => {
        dispatch(getUserDetails(studentID, address));

        const loadPresets = async () => {
            if (userDetails?.school?._id) {
                try {
                    const res = await axios.get(`${process.env.REACT_APP_BASE_URL}/LastBalancePresets/${userDetails.school._id}`);
                    if (!res.data.message) {
                        setPresets(res.data.map(p => p.name));
                    }
                } catch (e) {
                    console.error("Error fetching presets", e);
                }
            }
        };

        if (userDetails) {
            loadPresets();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [dispatch, studentID, userDetails?.school?._id]);

    useEffect(() => {
        if (userDetails && userDetails.lastBalances) {
            setBalances(userDetails.lastBalances);
        } else if (userDetails) {
            setBalances([]);
        }
    }, [userDetails]);

    const handleAddBalance = () => {
        if (!newBalance.feeName || newBalance.amount < 0) {
            setMessage("Please enter a valid Fee Name and a non-negative Amount.");
            setSeverity("error");
            setShowPopup(true);
            return;
        }

        const updatedBalances = [...balances, newBalance];
        setBalances(updatedBalances);
        setNewBalance({ feeName: '', amount: 0 });
        setOpenAddModal(false);
    };

    const handleDeleteBalance = (index) => {
        const updatedBalances = [...balances];
        updatedBalances.splice(index, 1);
        setBalances(updatedBalances);
    };

    const handleSaveBalances = () => {
        dispatch(updateStudentFields(studentID, { lastBalances: balances }, "Student"))
            .then(() => {
                setMessage("Last Balances saved successfully.");
                setSeverity("success");
                setShowPopup(true);
                // Re-fetch details to ensure sync
                dispatch(getUserDetails(studentID, address));
            })
            .catch((err) => {
                setMessage("Error saving Last Balances: " + err);
                setSeverity("error");
                setShowPopup(true);
            })
    };

    const totalBalance = balances.reduce((sum, item) => sum + Number(item.amount), 0);

    return (
        <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
            {loading ? (
                <CustomLoader />
            ) : (
                <>
                    <Paper sx={{ p: 3, mb: 3, borderRadius: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <Box>
                            <Typography variant="h5" component="h1" sx={{ fontWeight: 'bold' }}>
                                Last Balances - {userDetails?.name}
                            </Typography>
                            <Typography variant="body1" color="textSecondary">
                                Roll Number: {userDetails?.rollNum}
                            </Typography>
                            <Typography variant="h6" color="primary" sx={{ mt: 1 }}>
                                Total Last Balance: {totalBalance} PKR
                            </Typography>
                        </Box>
                        <Box sx={{ display: 'flex', gap: 1.5 }}>
                            <Tooltip title="Back">
                                <IconButton size="small" onClick={() => navigate(-1)} sx={{ border: '1px solid var(--border-color)', borderRadius: 'var(--border-radius-md)' }}>
                                    <ArrowBackIcon fontSize="small" />
                                </IconButton>
                            </Tooltip>
                        </Box>
                    </Paper>

                    <Paper sx={{ p: 4, borderRadius: 'var(--border-radius-xl)' }}>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                            <Typography variant="h6" fontWeight="bold">Balance Records</Typography>
                            <Button variant="contained" startIcon={<AddIcon />} onClick={() => setOpenAddModal(true)} sx={{ borderRadius: 2, textTransform: 'none', boxShadow: 'none' }}>
                                Add Balance Record
                            </Button>
                        </Box>

                        <Table>
                            <TableHead>
                                <StyledTableRow>
                                    <StyledTableCell>Fee Name</StyledTableCell>
                                    <StyledTableCell align="center">Amount (PKR)</StyledTableCell>
                                    <StyledTableCell align="right">Actions</StyledTableCell>
                                </StyledTableRow>
                            </TableHead>
                            <TableBody>
                                {balances.map((item, index) => (
                                    <StyledTableRow key={index}>
                                        <StyledTableCell>{item.feeName}</StyledTableCell>
                                        <StyledTableCell align="center">{item.amount}</StyledTableCell>
                                        <StyledTableCell align="right">
                                            <IconButton color="error" onClick={() => handleDeleteBalance(index)}>
                                                <DeleteIcon />
                                            </IconButton>
                                        </StyledTableCell>
                                    </StyledTableRow>
                                ))}
                                {balances.length === 0 && (
                                    <StyledTableRow>
                                        <StyledTableCell colSpan={3} align="center">
                                            No balance records found.
                                        </StyledTableCell>
                                    </StyledTableRow>
                                )}
                            </TableBody>
                        </Table>

                        <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 4 }}>
                            <Button variant="contained" color="success" startIcon={<SaveIcon />} onClick={handleSaveBalances} sx={{ borderRadius: 2, px: 4, py: 1.5 }}>
                                Save Changes
                            </Button>
                        </Box>
                    </Paper>
                </>
            )}

            <Dialog open={openAddModal} onClose={() => setOpenAddModal(false)} maxWidth="sm" fullWidth>
                <DialogTitle sx={{ fontWeight: 'bold' }}>Add Balance Record</DialogTitle>
                <DialogContent>
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3, mt: 2 }}>
                        <Autocomplete
                            freeSolo
                            options={presets}
                            value={newBalance.feeName}
                            onInputChange={(event, newValue) => {
                                setNewBalance({ ...newBalance, feeName: newValue });
                            }}
                            renderInput={(params) => (
                                <TextField {...params} label="Fee Name (e.g. Books, Uniform)" fullWidth />
                            )}
                        />
                        <TextField
                            label="Amount (PKR)"
                            type="number"
                            fullWidth
                            value={newBalance.amount}
                            onChange={(e) => setNewBalance({ ...newBalance, amount: Number(e.target.value) })}
                            inputProps={{ min: 0 }}
                        />
                    </Box>
                </DialogContent>
                <DialogActions sx={{ p: 3 }}>
                    <Button onClick={() => setOpenAddModal(false)} color="inherit">Cancel</Button>
                    <Button variant="contained" onClick={handleAddBalance}>Add</Button>
                </DialogActions>
            </Dialog>

            <Popup message={message} setShowPopup={setShowPopup} showPopup={showPopup} severity={severity} />
        </Container>
    );
};

export default StudentLastBalance;
