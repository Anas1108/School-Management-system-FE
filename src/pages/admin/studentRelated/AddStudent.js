import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { registerUser } from '../../../redux/userRelated/userHandle';
import Popup from '../../../components/Popup';
import { underControl } from '../../../redux/userRelated/userSlice';
import { getAllSclasses } from '../../../redux/sclassRelated/sclassHandle';
import { CircularProgress, Container, Paper, Typography, TextField, MenuItem, Button, Box, Grid, Stepper, Step, StepLabel } from '@mui/material';
import styled from 'styled-components';
import axios from 'axios';

const AddStudent = ({ situation }) => {
    const dispatch = useDispatch()
    const navigate = useNavigate()
    const params = useParams()

    const userState = useSelector(state => state.user);
    const { status, currentUser, response, error } = userState;
    const { sclassesList } = useSelector((state) => state.sclass);

    const [activeStep, setActiveStep] = useState(0);
    const steps = ['Guardian Info', 'Student Details', 'Academic Info'];

    // Family State
    const [familyId, setFamilyId] = useState('');
    const [familyDetails, setFamilyDetails] = useState({
        fatherName: '',
        fatherCNIC: '',
        fatherPhone: '',
        fatherOccupation: '',
        motherName: '',
        motherPhone: '',
        homeAddress: '',
        guardianEmail: '',
    });
    const [familyFound, setFamilyFound] = useState(false);
    const [searching, setSearching] = useState(false);

    // Student State
    const [studentDetails, setStudentDetails] = useState({
        name: '',
        dateOfBirth: '',
        gender: '',
        studentBForm: '',
        religion: '',
        bloodGroup: '',
        admissionDate: new Date().toISOString().split('T')[0],
    });

    // Academic State
    const [academicDetails, setAcademicDetails] = useState({
        rollNum: '',
        password: '',
        sclassName: '',
        className: ''
    });

    const adminID = currentUser._id
    const role = "Student"

    useEffect(() => {
        if (situation === "Class") {
            setAcademicDetails(prev => ({ ...prev, sclassName: params.id }));
        }
    }, [params.id, situation]);

    const [showPopup, setShowPopup] = useState(false);
    const [message, setMessage] = useState("");
    const [loader, setLoader] = useState(false)

    useEffect(() => {
        dispatch(getAllSclasses(adminID, "Sclass"));
    }, [adminID, dispatch]);

    // Handlers
    const handleFamilyChange = (e) => {
        const { name, value } = e.target;
        setFamilyDetails(prev => ({ ...prev, [name]: value }));
    };

    const handleStudentChange = (e) => {
        const { name, value } = e.target;
        setStudentDetails(prev => ({ ...prev, [name]: value }));
    };

    const handleAcademicChange = (e) => {
        const { name, value } = e.target;
        if (name === 'className') {
            if (value === 'Select Class') {
                setAcademicDetails(prev => ({ ...prev, className: 'Select Class', sclassName: '' }));
            } else {
                const selectedClass = sclassesList.find(c => c.sclassName === value);
                setAcademicDetails(prev => ({ ...prev, className: selectedClass.sclassName, sclassName: selectedClass._id }));
            }
        } else {
            setAcademicDetails(prev => ({ ...prev, [name]: value }));
        }
    };

    const searchFamily = async () => {
        if (!familyDetails.fatherCNIC) {
            setMessage("Please enter Father's CNIC");
            setShowPopup(true);
            return;
        }
        setSearching(true);
        try {
            const result = await axios.post(`${process.env.REACT_APP_BASE_URL}/SearchFamily`, { cnic: familyDetails.fatherCNIC });
            if (result.data.message === "Family found") {
                setFamilyId(result.data.family._id);
                setFamilyDetails(result.data.family);
                setFamilyFound(true);
                setMessage("Family Found! Linked automatically.");
                setShowPopup(true);
            } else {
                setFamilyFound(false);
                setFamilyId('');
                setMessage("Family not found. Please enter new details.");
                setShowPopup(true);
            }
        } catch (error) {
            console.error(error);
            setMessage("Error searching family");
            setShowPopup(true);
        }
        setSearching(false);
    };

    const handleNext = () => {
        if (activeStep === 0) {
            if (!familyDetails.fatherCNIC || !familyDetails.fatherName || !familyDetails.homeAddress) {
                // Basic validation for new family
                if (!familyFound && (!familyDetails.fatherCNIC || !familyDetails.fatherName)) {
                    setMessage("Please fill required Guardian fields (CNIC, Name)");
                    setShowPopup(true);
                    return;
                }
            }
        }
        setActiveStep((prev) => prev + 1);
    };

    const handleBack = () => setActiveStep((prev) => prev - 1);

    const submitHandler = (event) => {
        event.preventDefault()
        if (academicDetails.sclassName === "") {
            setMessage("Please select a classname")
            setShowPopup(true)
        }
        else {
            setLoader(true)
            const fields = {
                ...studentDetails,
                ...academicDetails,
                familyId: familyFound ? familyId : null,
                familyDetails: familyFound ? null : familyDetails,
                adminID,
            }
            dispatch(registerUser(fields, role))
        }
    }

    useEffect(() => {
        if (status === 'added') {
            dispatch(underControl())
            navigate(-1)
        }
        else if (status === 'failed') {
            setMessage(response)
            setShowPopup(true)
            setLoader(false)
        }
        else if (status === 'error') {
            setMessage("Network Error")
            setShowPopup(true)
            setLoader(false)
        }
    }, [status, navigate, error, response, dispatch]);

    return (
        <Container maxWidth="md" sx={{ mt: 4, mb: 4 }}>
            <StyledPaper elevation={3}>
                <Typography variant="h4" sx={{ mb: 3, fontWeight: 'bold', color: 'var(--text-primary)', textAlign: 'center' }}>
                    Add Student
                </Typography>

                <Stepper activeStep={activeStep} alternativeLabel sx={{ mb: 4 }}>
                    {steps.map((label) => (
                        <Step key={label}>
                            <StepLabel>{label}</StepLabel>
                        </Step>
                    ))}
                </Stepper>

                <form onSubmit={submitHandler}>
                    {activeStep === 0 && (
                        <Grid container spacing={3}>
                            <Grid item xs={12}>
                                <Box display="flex" gap={2}>
                                    <TextField
                                        fullWidth
                                        label="Father's CNIC (XXXXX-XXXXXXX-X)"
                                        name="fatherCNIC"
                                        value={familyDetails.fatherCNIC}
                                        onChange={handleFamilyChange}
                                        required
                                        disabled={familyFound}
                                    />
                                    <Button
                                        variant="contained"
                                        onClick={searchFamily}
                                        disabled={searching || familyFound}
                                        sx={{ minWidth: '120px' }}
                                    >
                                        {searching ? <CircularProgress size={24} /> : 'Search'}
                                    </Button>
                                    {familyFound && (
                                        <Button variant="outlined" color="error" onClick={() => {
                                            setFamilyFound(false);
                                            setFamilyDetails({
                                                fatherName: '', fatherCNIC: '', fatherPhone: '', fatherOccupation: '',
                                                motherName: '', motherPhone: '', homeAddress: '', guardianEmail: ''
                                            });
                                            setFamilyId('');
                                        }}>
                                            Reset
                                        </Button>
                                    )}
                                </Box>
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <TextField
                                    fullWidth
                                    label="Father's Name"
                                    name="fatherName"
                                    value={familyDetails.fatherName}
                                    onChange={handleFamilyChange}
                                    required
                                    disabled={familyFound}
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
                                    disabled={familyFound}
                                />
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <TextField
                                    fullWidth
                                    label="Father's Occupation"
                                    name="fatherOccupation"
                                    value={familyDetails.fatherOccupation}
                                    onChange={handleFamilyChange}
                                    disabled={familyFound}
                                />
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <TextField
                                    fullWidth
                                    label="Home Address"
                                    name="homeAddress"
                                    value={familyDetails.homeAddress}
                                    onChange={handleFamilyChange}
                                    required
                                    disabled={familyFound}
                                />
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <TextField
                                    fullWidth
                                    label="Mother's Name"
                                    name="motherName"
                                    value={familyDetails.motherName}
                                    onChange={handleFamilyChange}
                                    disabled={familyFound}
                                />
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <TextField
                                    fullWidth
                                    label="Mother's Phone"
                                    name="motherPhone"
                                    value={familyDetails.motherPhone}
                                    onChange={handleFamilyChange}
                                    disabled={familyFound}
                                />
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <TextField
                                    fullWidth
                                    label="Guardian Email"
                                    name="guardianEmail"
                                    value={familyDetails.guardianEmail}
                                    onChange={handleFamilyChange}
                                    disabled={familyFound}
                                />
                            </Grid>
                        </Grid>
                    )}

                    {activeStep === 1 && (
                        <Grid container spacing={3}>
                            <Grid item xs={12} sm={6}>
                                <TextField
                                    fullWidth
                                    label="Student Name"
                                    name="name"
                                    value={studentDetails.name}
                                    onChange={handleStudentChange}
                                    required
                                />
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <TextField
                                    fullWidth
                                    label="B-Form (XXXXX-XXXXXXX-X)"
                                    name="studentBForm"
                                    value={studentDetails.studentBForm}
                                    onChange={handleStudentChange}
                                    required
                                />
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <TextField
                                    fullWidth
                                    label="Date of Birth"
                                    type="date"
                                    name="dateOfBirth"
                                    value={studentDetails.dateOfBirth}
                                    onChange={handleStudentChange}
                                    InputLabelProps={{ shrink: true }}
                                    required
                                />
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <TextField
                                    fullWidth
                                    select
                                    label="Gender"
                                    name="gender"
                                    value={studentDetails.gender}
                                    onChange={handleStudentChange}
                                    required
                                >
                                    <MenuItem value="Male">Male</MenuItem>
                                    <MenuItem value="Female">Female</MenuItem>
                                    <MenuItem value="Other">Other</MenuItem>
                                </TextField>
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <TextField
                                    fullWidth
                                    select
                                    label="Religion"
                                    name="religion"
                                    value={studentDetails.religion}
                                    onChange={handleStudentChange}
                                    required
                                >
                                    <MenuItem value="Muslim">Muslim</MenuItem>
                                    <MenuItem value="Non-Muslim">Non-Muslim</MenuItem>
                                </TextField>
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <TextField
                                    fullWidth
                                    label="Blood Group"
                                    name="bloodGroup"
                                    value={studentDetails.bloodGroup}
                                    onChange={handleStudentChange}
                                />
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <TextField
                                    fullWidth
                                    label="Admission Date"
                                    type="date"
                                    name="admissionDate"
                                    value={studentDetails.admissionDate}
                                    onChange={handleStudentChange}
                                    InputLabelProps={{ shrink: true }}
                                />
                            </Grid>
                        </Grid>
                    )}

                    {activeStep === 2 && (
                        <Grid container spacing={3}>
                            {situation === "Student" && (
                                <Grid item xs={12}>
                                    <TextField
                                        fullWidth
                                        select
                                        label="Class"
                                        name="className"
                                        value={academicDetails.className}
                                        onChange={handleAcademicChange}
                                        required
                                    >
                                        <MenuItem value='Select Class'>Select Class</MenuItem>
                                        {sclassesList.map((classItem, index) => (
                                            <MenuItem key={index} value={classItem.sclassName}>
                                                {classItem.sclassName}
                                            </MenuItem>
                                        ))}
                                    </TextField>
                                </Grid>
                            )}
                            <Grid item xs={12}>
                                <TextField
                                    fullWidth
                                    label="Roll Number"
                                    type="number"
                                    name="rollNum"
                                    value={academicDetails.rollNum}
                                    onChange={handleAcademicChange}
                                    required
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <TextField
                                    fullWidth
                                    label="Password"
                                    type="password"
                                    name="password"
                                    value={academicDetails.password}
                                    onChange={handleAcademicChange}
                                    autoComplete="new-password"
                                    required
                                />
                            </Grid>
                        </Grid>
                    )}

                    <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 3, gap: 2 }}>
                        {activeStep !== 0 && (
                            <Button onClick={handleBack} variant="outlined">
                                Back
                            </Button>
                        )}
                        {activeStep === steps.length - 1 ? (
                            <SubmitButton
                                variant="contained"
                                type="submit"
                                disabled={loader}
                            >
                                {loader ? <CircularProgress size={24} color="inherit" /> : 'Register Student'}
                            </SubmitButton>
                        ) : (
                            <Button variant="contained" onClick={handleNext}>
                                Next
                            </Button>
                        )}
                    </Box>
                </form>
            </StyledPaper>
            <Popup message={message} setShowPopup={setShowPopup} showPopup={showPopup} />
        </Container>
    )
}

export default AddStudent

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