import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import { getSubjectDetails } from '../../../redux/sclassRelated/sclassHandle';
import Popup from '../../../components/Popup';
import { registerUser, updateUser } from '../../../redux/userRelated/userHandle';
import { underControl } from '../../../redux/userRelated/userSlice';
import { getTeacherDetails } from '../../../redux/teacherRelated/teacherHandle';
import { CircularProgress, Container, Paper, Typography, TextField, Button, Box, Grid, Stepper, Step, StepLabel } from '@mui/material';
import styled from 'styled-components';

const AddTeacher = ({ situation }) => {
  const params = useParams()
  const dispatch = useDispatch()
  const navigate = useNavigate()

  const subjectID = params.id
  const teacherID = params.id

  const { status, response, error, currentUser } = useSelector(state => state.user);
  const { subjectDetails } = useSelector((state) => state.sclass);
  const { teacherDetails } = useSelector((state) => state.teacher);

  useEffect(() => {
    if (situation === "Edit") {
      dispatch(getTeacherDetails(teacherID));
    } else if (subjectID) {
      dispatch(getSubjectDetails(subjectID, "Subject"));
    }
  }, [dispatch, subjectID, teacherID, situation]);

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [phone, setPhone] = useState('');
  const [cnic, setCnic] = useState('');
  const [qualification, setQualification] = useState('');
  const [designation, setDesignation] = useState('');
  const [department, setDepartment] = useState('');
  const [joiningDate, setJoiningDate] = useState('');
  const [salary, setSalary] = useState('');
  const [policeVerification, setPoliceVerification] = useState('No');
  const [serviceBookNumber, setServiceBookNumber] = useState('');

  // Validation States
  const [cnicError, setCnicError] = useState(false);
  const [phoneError, setPhoneError] = useState(false);



  useEffect(() => {
    if (situation === "Edit" && teacherDetails) {
      setName(teacherDetails.name);
      setEmail(teacherDetails.email);
      setPhone(teacherDetails.phone || '');
      setCnic(teacherDetails.cnic || '');
      setQualification(teacherDetails.qualification || '');
      setDesignation(teacherDetails.designation || '');
      setDepartment(teacherDetails.department?.departmentName || teacherDetails.department || '');
      setJoiningDate(teacherDetails.joiningDate ? new Date(teacherDetails.joiningDate).toISOString().split('T')[0] : '');
      setSalary(teacherDetails.salary || '');
      setPoliceVerification(teacherDetails.policeVerification || 'No');
      setServiceBookNumber(teacherDetails.serviceBookNumber || '');
    }
  }, [teacherDetails, situation]);

  const [showPopup, setShowPopup] = useState(false);
  const [message, setMessage] = useState("");
  const [loader, setLoader] = useState(false)
  const [severity, setSeverity] = useState("success");

  const role = "Teacher"
  const school = (subjectID && subjectDetails) ? subjectDetails.school : currentUser._id
  const teachSubject = (subjectID && subjectDetails) ? subjectDetails._id : null
  const teachSclass = (subjectID && subjectDetails && subjectDetails.sclassName) ? subjectDetails.sclassName._id : null

  const fields = {
    name, email, password, role, school, teachSubject, teachSclass,
    phone, cnic, qualification, designation, department, joiningDate, salary,
    policeVerification, serviceBookNumber
  }

  const handleCnicChange = (e) => {
    let val = e.target.value.replace(/\D/g, ''); // Remove non-digits
    if (val.length > 13) val = val.substring(0, 13);

    // Format: XXXXX-XXXXXXX-X
    if (val.length > 12) {
      val = `${val.slice(0, 5)}-${val.slice(5, 12)}-${val.slice(12)}`;
    } else if (val.length > 5) {
      val = `${val.slice(0, 5)}-${val.slice(5)}`;
    }
    setCnic(val);
    setCnicError(val.replace(/\D/g, '').length !== 13);
  };

  const handlePhoneChange = (e) => {
    let val = e.target.value.replace(/\D/g, '');
    if (val.length > 11) val = val.substring(0, 11);

    // Format: 03XX-XXXXXXX (Desired 11 digits, commonly formatted as 03XX-XXXXXXX or 03XX XXXXXXX)
    // Applying simple dash after code
    if (val.length > 4) {
      val = `${val.slice(0, 4)}-${val.slice(4)}`;
    }
    setPhone(val);
    setPhoneError(val.replace(/\D/g, '').length !== 11);
  };



  const submitHandler = (event) => {
    event.preventDefault()

    if (cnicError || phoneError) {
      setMessage("Please fix validation errors");
      setSeverity("error");
      setShowPopup(true);
      return;
    }

    setLoader(true)
    if (situation === "Edit") {
      const updateFields = {
        name, email, ...(password && { password }),
        phone, cnic, qualification, designation, department, joiningDate, salary,
        policeVerification, serviceBookNumber
      }
      dispatch(updateUser(updateFields, teacherID, "Teacher"));
    } else {
      dispatch(registerUser(fields, role))
    }
  }

  useEffect(() => {
    if (status === 'added' || status === 'currentUser') {
      const msg = situation === "Edit" ? "Teacher Updated Successfully" : "Teacher Added Successfully";
      setMessage(msg);
      setSeverity("success");
      setShowPopup(true);
      setLoader(false);
      const timer = setTimeout(() => {
        dispatch(underControl());
        navigate("/Admin/teachers");
      }, 1500);
      return () => clearTimeout(timer);
    }
    else if (status === 'failed') {
      setMessage(response)
      setSeverity("error")
      setShowPopup(true)
      setLoader(false)
    }
    else if (status === 'error') {
      setMessage("Network Error")
      setSeverity("error")
      setShowPopup(true)
      setLoader(false)
    }
  }, [status, navigate, error, response, dispatch, situation]);

  const [activeStep, setActiveStep] = useState(0);
  const steps = ['Personal Details', 'Login & Employment'];

  const handleNext = () => {
    if (activeStep === 0) {
      if (cnicError || phoneError) {
        setMessage("Please fix validation errors");
        setSeverity("error");
        setShowPopup(true);
        return;
      }
      if (!name || !phone || !cnic || !qualification) {
        setMessage("Please fill all required fields");
        setSeverity("error");
        setShowPopup(true);
        return;
      }
    }
    setActiveStep((prev) => prev + 1);
  };

  const handleBack = () => setActiveStep((prev) => prev - 1);

  return (
    <Container maxWidth="md" sx={{ mt: 4, mb: 4 }}>
      <StyledPaper elevation={3}>
        <Typography variant="h4" sx={{ mb: 3, fontWeight: 'bold', color: 'var(--text-primary)', textAlign: 'center' }}>
          {situation === "Edit" ? "Edit Teacher" : "Add Teacher"}
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
              <Grid item xs={12} sm={6}>
                <TextField fullWidth label="Name" variant="outlined" value={name} onChange={(event) => setName(event.target.value)} autoComplete="name" required />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField fullWidth label="Phone" value={phone} onChange={handlePhoneChange} error={phoneError} helperText={phoneError ? "Invalid Phone Format (03XX-XXXXXXX)" : ""} required />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField fullWidth label="CNIC" value={cnic} onChange={handleCnicChange} error={cnicError} helperText={cnicError ? "Invalid CNIC Format (XXXXX-XXXXXXX-X)" : ""} required />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField fullWidth label="Qualification" value={qualification} onChange={(e) => setQualification(e.target.value)} required />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField fullWidth label="Service Book Number" value={serviceBookNumber} onChange={(e) => setServiceBookNumber(e.target.value)} />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField select fullWidth label="Police Verification" value={policeVerification} onChange={(e) => setPoliceVerification(e.target.value)} SelectProps={{ native: true }}>
                  <option value="No">No</option>
                  <option value="Pending">Pending</option>
                  <option value="Yes">Yes</option>
                </TextField>
              </Grid>
            </Grid>
          )}

          {activeStep === 1 && (
            <Grid container spacing={3}>
              <Grid item xs={12} sm={6}>
                <TextField fullWidth label="Email" type="email" variant="outlined" value={email} onChange={(event) => setEmail(event.target.value)} autoComplete="email" required />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField fullWidth label="Password" type="password" variant="outlined" value={password} onChange={(event) => setPassword(event.target.value)} autoComplete="new-password" required={situation !== "Edit"} helperText={situation === "Edit" ? "Leave blank to keep current password" : ""} />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField fullWidth label="Designation" value={designation} onChange={(e) => setDesignation(e.target.value)} required />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField fullWidth label="Department" value={department} onChange={(e) => setDepartment(e.target.value)} required />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField fullWidth label="Joining Date" type="date" InputLabelProps={{ shrink: true }} value={joiningDate} onChange={(e) => setJoiningDate(e.target.value)} required />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField fullWidth label="Salary" type="number" value={salary} onChange={(e) => setSalary(e.target.value)} required />
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
                {loader ? <CircularProgress size={24} color="inherit" /> : (situation === "Edit" ? 'Update' : 'Register')}
              </SubmitButton>
            ) : (
              <Button variant="contained" onClick={handleNext}>
                Next
              </Button>
            )}
          </Box>
        </form>
      </StyledPaper>
      <Popup message={message} setShowPopup={setShowPopup} showPopup={showPopup} severity={severity} />
    </Container>
  )
}

export default AddTeacher

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