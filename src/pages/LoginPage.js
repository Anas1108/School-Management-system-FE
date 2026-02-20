import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { Grid, Box, Typography, Paper, Checkbox, FormControlLabel, TextField, CssBaseline, IconButton, InputAdornment, CircularProgress } from '@mui/material';
import { ThemeProvider } from '@mui/material/styles';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import bgpic from "../assets/designlogin.jpg"
import AdminImage from "../assets/admin.png";
import StudentImage from "../assets/student.png";
import TeacherImage from "../assets/teacher.png";
import { LightPurpleButton } from '../components/buttonStyles';
import styled from 'styled-components';
import { loginUser } from '../redux/userRelated/userHandle';
import Popup from '../components/Popup';
import theme from '../theme';

const LoginPage = ({ role }) => {

    const dispatch = useDispatch()
    const navigate = useNavigate()

    const { status, currentUser, response, error, currentRole } = useSelector(state => state.user);;

    const [toggle, setToggle] = useState(false)
    const [loader, setLoader] = useState(false)
    const [showPopup, setShowPopup] = useState(false);
    const [message, setMessage] = useState("");

    const [emailError, setEmailError] = useState(false);
    const [passwordError, setPasswordError] = useState(false);
    const [rollNumberError, setRollNumberError] = useState(false);
    const [studentNameError, setStudentNameError] = useState(false);

    const handleSubmit = (event) => {
        event.preventDefault();

        if (role === "Student") {
            const rollNum = event.target.rollNumber.value;
            const studentName = event.target.studentName.value;
            const password = event.target.password.value;

            if (!rollNum || !studentName || !password) {
                if (!rollNum) setRollNumberError(true);
                if (!studentName) setStudentNameError(true);
                if (!password) setPasswordError(true);
                return;
            }
            const fields = { rollNum, studentName, password }
            setLoader(true)
            dispatch(loginUser(fields, role))
        }

        else {
            const email = event.target.email.value;
            const password = event.target.password.value;

            if (!email || !password) {
                if (!email) setEmailError(true);
                if (!password) setPasswordError(true);
                return;
            }

            const fields = { email, password }
            setLoader(true)
            dispatch(loginUser(fields, role))
        }
    };

    const handleInputChange = (event) => {
        const { name } = event.target;
        if (name === 'email') setEmailError(false);
        if (name === 'password') setPasswordError(false);
        if (name === 'rollNumber') setRollNumberError(false);
        if (name === 'studentName') setStudentNameError(false);
    };



    const roleImage = {
        "Admin": AdminImage,
        "Student": StudentImage,
        "Teacher": TeacherImage
    }

    useEffect(() => {
        if (status === 'success' || currentUser !== null) {
            if (currentRole === 'Admin') {
                navigate('/Admin/dashboard');
            }
            else if (currentRole === 'Student') {
                navigate('/Student/dashboard');
            } else if (currentRole === 'Teacher') {
                navigate('/Teacher/dashboard');
            }
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
    }, [status, currentRole, navigate, error, response, currentUser]);

    return (
        <ThemeProvider theme={theme}>
            <Grid container component="main" sx={{ height: '100vh' }}>
                <CssBaseline />
                <Grid item xs={12} sm={8} md={5} component={Paper} elevation={6} square sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center',
                    backgroundColor: 'var(--bg-paper)'
                }}>
                    <Box
                        sx={{
                            my: 8,
                            mx: 4,
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                        }}
                    >
                        <StyledTypography variant="h4" sx={{ mb: 1, color: "var(--text-primary)" }}>
                            {role} Login
                        </StyledTypography>
                        <Typography variant="body1" sx={{ color: 'var(--text-secondary)', mb: 3 }}>
                            Welcome back! Please enter your details
                        </Typography>
                        <Box component="form" noValidate onSubmit={handleSubmit} sx={{ mt: 1, width: '100%', maxWidth: '400px' }}>
                            {role === "Student" ? (
                                <>
                                    <StyledTextField
                                        margin="normal"
                                        required
                                        fullWidth
                                        id="rollNumber"
                                        label="Enter your Roll Number"
                                        name="rollNumber"
                                        autoComplete="off"
                                        type="number"
                                        autoFocus
                                        error={rollNumberError}
                                        helperText={rollNumberError && 'Roll Number is required'}
                                        onChange={handleInputChange}
                                        variant="outlined"
                                    />
                                    <StyledTextField
                                        margin="normal"
                                        required
                                        fullWidth
                                        id="studentName"
                                        label="Enter your name"
                                        name="studentName"
                                        autoComplete="name"
                                        error={studentNameError}
                                        helperText={studentNameError && 'Name is required'}
                                        onChange={handleInputChange}
                                        variant="outlined"
                                    />
                                </>
                            ) : (
                                <StyledTextField
                                    margin="normal"
                                    required
                                    fullWidth
                                    id="email"
                                    label="Enter your email"
                                    name="email"
                                    autoComplete="email"
                                    autoFocus
                                    error={emailError}
                                    helperText={emailError && 'Email is required'}
                                    onChange={handleInputChange}
                                    variant="outlined"
                                />
                            )}
                            <StyledTextField
                                margin="normal"
                                required
                                fullWidth
                                name="password"
                                label="Password"
                                type={toggle ? 'text' : 'password'}
                                id="password"
                                autoComplete="current-password"
                                error={passwordError}
                                helperText={passwordError && 'Password is required'}
                                onChange={handleInputChange}
                                variant="outlined"
                                InputProps={{
                                    endAdornment: (
                                        <InputAdornment position="end">
                                            <IconButton onClick={() => setToggle(!toggle)}>
                                                {toggle ? (
                                                    <Visibility />
                                                ) : (
                                                    <VisibilityOff />
                                                )}
                                            </IconButton>
                                        </InputAdornment>
                                    ),
                                }}
                            />
                            <Grid container sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mt: 1 }}>
                                <FormControlLabel
                                    control={<Checkbox value="remember" color="primary" />}
                                    label={<Typography sx={{ color: 'var(--text-secondary)' }}>Remember me</Typography>}
                                />
                            </Grid>
                            <LightPurpleButton
                                type="submit"
                                fullWidth
                                variant="contained"
                                sx={{ mt: 3, mb: 2 }}
                            >
                                {loader ?
                                    <CircularProgress size={24} color="inherit" />
                                    : "Login"}
                            </LightPurpleButton>

                        </Box>
                    </Box>
                </Grid>
                <Grid
                    item
                    xs={false}
                    sm={4}
                    md={7}
                    sx={{
                        backgroundImage: `url(${roleImage[role] || bgpic})`,
                        backgroundRepeat: 'no-repeat',
                        backgroundColor: 'var(--color-primary-50)',
                        backgroundSize: 'cover',
                        backgroundPosition: 'center',
                        borderLeft: '1px solid var(--border-color)',
                    }}
                />
            </Grid>

            <Popup message={message} setShowPopup={setShowPopup} showPopup={showPopup} />
        </ThemeProvider>
    );
}

export default LoginPage

const StyledTypography = styled(Typography)`
    font-family: var(--font-family-heading) !important;
    font-weight: 700 !important;
`;

const StyledTextField = styled(TextField)`
    & .MuiOutlinedInput-root {
        border-radius: var(--border-radius-lg) !important;
        background-color: var(--color-gray-50);
        
        & fieldset {
            border-color: var(--color-gray-200);
        }
        
        &:hover fieldset {
            border-color: var(--color-primary-300);
        }
        
        &.Mui-focused fieldset {
            border-color: var(--color-primary-600);
        }
    }
`;




