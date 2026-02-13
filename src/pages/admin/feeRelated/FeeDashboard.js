import React, { useEffect, useState } from 'react';
import { Box, Grid, Paper, Typography, Button, TextField, MenuItem } from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import CountUp from 'react-countup';
import axios from 'axios';
import MonetizationOnIcon from '@mui/icons-material/MonetizationOn';
import CustomModal from '../../../components/CustomModal';

const FeeDashboard = () => {
    const dispatch = useDispatch();
    const { currentUser } = useSelector(state => state.user);
    const [stats, setStats] = useState({ totalExpected: 0, totalCollected: 0, totalLateFines: 0 });
    const [loading, setLoading] = useState(true);

    const [generationData, setGenerationData] = useState({
        classId: '',
        month: new Date().getMonth() + 1, // Default current month
        year: new Date().getFullYear(),
        dueDate: new Date().toISOString().split('T')[0]
    });
    const [classes, setClasses] = useState([]);

    // Modal State
    const [modalData, setModalData] = useState({ open: false, title: '', message: '', type: 'info' });

    useEffect(() => {
        fetchStats();
        fetchClasses();
    }, []);

    const fetchStats = async () => {
        try {
            const result = await axios.get(`${process.env.REACT_APP_BASE_URL}/FeeStats/${currentUser._id}`);
            setStats(result.data);
            setLoading(false);
        } catch (error) {
            console.error(error);
            setLoading(false);
        }
    };

    const fetchClasses = async () => {
        try {
            const result = await axios.get(`${process.env.REACT_APP_BASE_URL}/SclassList/${currentUser._id}`);
            if (result.data.message) {
                // handle no classes
            } else {
                setClasses(result.data);
            }
        } catch (error) {
            console.error(error);
        }
    }

    const handleGenerate = async () => {
        try {
            const data = { ...generationData, adminID: currentUser._id };
            // Ensure month is formatted correctly if needed
            const response = await axios.post(`${process.env.REACT_APP_BASE_URL}/FeeInvoiceGenerate`, data);

            setModalData({ open: true, title: 'Success', message: response.data.message || "Invoices Generation Processed", type: 'success' });
            fetchStats(); // Refresh stats
        } catch (error) {
            console.error(error);
            if (error.response && error.response.data && error.response.data.message) {
                setModalData({ open: true, title: 'Error', message: error.response.data.message, type: 'warning' });
            } else {
                setModalData({ open: true, title: 'Error', message: "Error generating invoices", type: 'error' });
            }
        }
    };

    const handleModalClose = () => {
        setModalData({ ...modalData, open: false });
    };

    const StatCard = ({ title, value, color }) => (
        <Paper elevation={3} sx={{ p: 3, display: 'flex', flexDirection: 'column', alignItems: 'center', bgcolor: color, color: 'white' }}>
            <Typography variant="h6" gutterBottom>{title}</Typography>
            <Typography variant="h4" fontWeight="bold">
                <CountUp start={0} end={value} duration={2.5} separator="," prefix="PKR " />
            </Typography>
        </Paper>
    );

    return (
        <Box sx={{ mt: 4, mb: 4 }}>
            <Typography variant="h4" gutterBottom>Fee Management Dashboard</Typography>

            <Grid container spacing={3} sx={{ mb: 4 }}>
                <Grid item xs={12} md={4}>
                    <StatCard title="Expected Revenue" value={stats.totalExpected} color="#1976d2" />
                </Grid>
                <Grid item xs={12} md={4}>
                    <StatCard title="Collected Revenue" value={stats.totalCollected} color="#2e7d32" />
                </Grid>
                <Grid item xs={12} md={4}>
                    <StatCard title="Total Late Fines" value={stats.totalLateFines} color="#ed6c02" />
                </Grid>
            </Grid>

            <Paper elevation={3} sx={{ p: 3 }}>
                <Typography variant="h6" gutterBottom>Generate Monthly Invoices</Typography>
                <Box component="form" sx={{ display: 'flex', gap: 2, alignItems: 'end', flexWrap: 'wrap' }}>
                    <TextField
                        select
                        label="Select Class"
                        value={generationData.classId}
                        onChange={(e) => setGenerationData({ ...generationData, classId: e.target.value })}
                        sx={{ minWidth: 200 }}
                    >
                        {classes.map((option) => (
                            <MenuItem key={option._id} value={option._id}>
                                {option.sclassName}
                            </MenuItem>
                        ))}
                    </TextField>
                    <TextField
                        label="Month"
                        type="number"
                        value={generationData.month}
                        onChange={(e) => setGenerationData({ ...generationData, month: e.target.value })}
                        inputProps={{ min: 1, max: 12 }}
                    />
                    <TextField
                        label="Year"
                        type="number"
                        value={generationData.year}
                        onChange={(e) => setGenerationData({ ...generationData, year: e.target.value })}
                    />
                    <TextField
                        label="Due Date"
                        type="date"
                        value={generationData.dueDate}
                        onChange={(e) => setGenerationData({ ...generationData, dueDate: e.target.value })}
                        InputLabelProps={{ shrink: true }}
                    />
                    <Button variant="contained" startIcon={<MonetizationOnIcon />} onClick={handleGenerate}>
                        Generate Invoices
                    </Button>
                </Box>
            </Paper>

            {/* Quick Links */}
            <Box sx={{ mt: 3, display: 'flex', gap: 2 }}>
                <Button variant="outlined" href="/Admin/fees/defaulters">View Defaulters</Button>
                <Button variant="outlined" href="/Admin/fees/structure">Configure Fees</Button>
            </Box>

            <CustomModal
                open={modalData.open}
                handleClose={handleModalClose}
                title={modalData.title}
                message={modalData.message}
                type={modalData.type}
            />
        </Box>
    );
};

export default FeeDashboard;
