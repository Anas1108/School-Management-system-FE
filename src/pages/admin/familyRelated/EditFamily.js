import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { TextField, Button, Grid, Typography, Container, Paper, Box, CircularProgress } from '@mui/material';
import styled from 'styled-components';
import axios from 'axios';
import Popup from '../../../components/Popup';
import CustomLoader from '../../../components/CustomLoader';

const EditFamily = () => {
    const { id } = useParams();
    const navigate = useNavigate();

    const [familyDetails, setFamilyDetails] = useState({
        familyName: '',
        fatherName: '',
        fatherCNIC: '',
        fatherPhone: '',
        fatherOccupation: '',
        motherName: '',
        motherPhone: '',
        homeAddress: '',
        guardianEmail: '',
    });

    const [loading, setLoading] = useState(true);
    const [submitLoader, setSubmitLoader] = useState(false);
    const [showPopup, setShowPopup] = useState(false);
    const [message, setMessage] = useState("");
    const [severity, setSeverity] = useState("error");

    useEffect(() => {
        const fetchFamily = async () => {
            try {
                const response = await axios.get(`${process.env.REACT_APP_BASE_URL}/Family/${id}`);
                const data = response.data;
                if (data.familyName) {
                    setFamilyDetails({
                        familyName: data.familyName || '',
                        fatherName: data.fatherName || '',
                        fatherCNIC: data.fatherCNIC || '',
                        fatherPhone: data.fatherPhone || '',
                        fatherOccupation: data.fatherOccupation || '',
                        motherName: data.motherName || '',
                        motherPhone: data.motherPhone || '',
                        homeAddress: data.homeAddress || '',
                        guardianEmail: data.guardianEmail || '',
                    });
                }
                setLoading(false);
            } catch (err) {
                console.error(err);
                setMessage("Error fetching family details.");
                setSeverity("error");
                setShowPopup(true);
                setLoading(false);
            }
        };
        fetchFamily();
    }, [id]);

    const formatCNIC = (value) => {
        const cnic = value.replace(/\D/g, "");
        if (cnic.length <= 5) return cnic;
        if (cnic.length <= 12) return `${cnic.slice(0, 5)}-${cnic.slice(5)}`;
        return `${cnic.slice(0, 5)}-${cnic.slice(5, 12)}-${cnic.slice(12, 13)}`;
    };

    const handleFamilyChange = (e) => {
        const { name, value } = e.target;
        if (name === 'fatherCNIC') {
            setFamilyDetails(prev => ({ ...prev, [name]: formatCNIC(value) }));
        } else {
            setFamilyDetails(prev => ({ ...prev, [name]: value }));
        }
    };

    const submitHandler = async (event) => {
        event.preventDefault();

        if (!familyDetails.familyName || !familyDetails.fatherName || !familyDetails.fatherPhone || !familyDetails.homeAddress) {
            setMessage("Please fill all required Family fields");
            setSeverity("error");
            setShowPopup(true);
            return;
        }

        setSubmitLoader(true);
        try {
            const response = await axios.put(`${process.env.REACT_APP_BASE_URL}/Family/${id}`, familyDetails);

            if (response.data.message && typeof response.data.message === 'string' && response.data.message.toLowerCase().includes("error")) {
                setMessage(response.data.message);
                setSeverity("error");
                setShowPopup(true);
            } else {
                setMessage("Family Updated Successfully!");
                setSeverity("success");
                setShowPopup(true);
                setTimeout(() => {
                    navigate('/Admin/families');
                }, 1500);
            }
        } catch (error) {
            console.error(error);
            setMessage("Network Error");
            setSeverity("error");
            setShowPopup(true);
        } finally {
            setSubmitLoader(false);
        }
    };

    if (loading) return <CustomLoader />;

    return (
        <Container maxWidth="md" sx={{ mt: 4, mb: 4 }}>
            <StyledPaper elevation={3}>
                <Typography variant="h4" sx={{ mb: 4, fontWeight: 'bold', color: 'var(--text-primary)', textAlign: 'center' }}>
                    Edit Family Details
                </Typography>
                <form onSubmit={submitHandler}>
                    <Grid container spacing={3}>
                        <Grid item xs={12}>
                            <TextField
                                fullWidth
                                label="Family Name"
                                name="familyName"
                                value={familyDetails.familyName}
                                onChange={handleFamilyChange}
                                required
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                fullWidth
                                label="Father's CNIC (Optional) (XXXXX-XXXXXXX-X)"
                                name="fatherCNIC"
                                value={familyDetails.fatherCNIC}
                                onChange={handleFamilyChange}
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                fullWidth
                                label="Father's Name"
                                name="fatherName"
                                value={familyDetails.fatherName}
                                onChange={handleFamilyChange}
                                required
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                fullWidth
                                label="Father's Phone"
                                name="fatherPhone"
                                value={familyDetails.fatherPhone}
                                onChange={handleFamilyChange}
                                required
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                fullWidth
                                label="Father's Occupation"
                                name="fatherOccupation"
                                value={familyDetails.fatherOccupation}
                                onChange={handleFamilyChange}
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                fullWidth
                                label="Home Address"
                                name="homeAddress"
                                value={familyDetails.homeAddress}
                                onChange={handleFamilyChange}
                                required
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                fullWidth
                                label="Mother's Name"
                                name="motherName"
                                value={familyDetails.motherName}
                                onChange={handleFamilyChange}
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                fullWidth
                                label="Mother's Phone"
                                name="motherPhone"
                                value={familyDetails.motherPhone}
                                onChange={handleFamilyChange}
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                fullWidth
                                label="Guardian Email"
                                name="guardianEmail"
                                type="email"
                                value={familyDetails.guardianEmail}
                                onChange={handleFamilyChange}
                            />
                        </Grid>
                    </Grid>

                    <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 4, gap: 2 }}>
                        <Button onClick={() => navigate(-1)} variant="outlined">
                            Cancel
                        </Button>
                        <SubmitButton variant="contained" type="submit" disabled={submitLoader}>
                            {submitLoader ? <CircularProgress size={24} color="inherit" /> : 'Update Family'}
                        </SubmitButton>
                    </Box>
                </form>
            </StyledPaper>
            <Popup message={message} setShowPopup={setShowPopup} showPopup={showPopup} severity={severity} />
        </Container>
    );
};

export default EditFamily;

const StyledPaper = styled(Paper)`
    padding: 2rem;
    border-radius: var(--border-radius-xl);
    background: var(--bg-paper);
    border: 1px solid var(--border-color);
`;

const SubmitButton = styled(Button)`
    && {
        background: var(--gradient-primary);
        color: white;
        font-weight: bold;
        padding: 10px 20px;
        border-radius: var(--border-radius-md);
        text-transform: none;
        font-size: 1rem;
        box-shadow: var(--shadow-md);
        transition: all 0.3s ease;

        &:hover {
            box-shadow: var(--shadow-lg);
            transform: translateY(-2px);
            background: var(--gradient-primary);
            filter: brightness(1.1);
        }
    }
`;
