import * as React from 'react';
import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { Grid, Box, Typography, Paper, Checkbox, FormControlLabel, TextField, CssBaseline, IconButton, InputAdornment, CircularProgress } from '@mui/material';
import { ThemeProvider } from '@mui/material/styles';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import bgpic from "../../assets/designlogin.jpg"
import { LightPurpleButton } from '../../components/buttonStyles';
import { registerUser } from '../../redux/userRelated/userHandle';
import styled from 'styled-components';
import Popup from '../../components/Popup';
import theme from '../../theme';

const AdminRegisterPage = () => {

    const dispatch = useDispatch()
    const navigate = useNavigate()

    const { status, currentUser, response, error, currentRole } = useSelector(state => state.user);;

    const [toggle, setToggle] = useState(false)
    const [loader, setLoader] = useState(false)
    const [showPopup, setShowPopup] = useState(false);
    const [message, setMessage] = useState("");

    const [emailError, setEmailError] = useState(false);
    const [passwordError, setPasswordError] = useState(false);
    const [adminNameError, setAdminNameError] = useState(false);
    const [schoolNameError, setSchoolNameError] = useState(false);
    const role = "Admin"

    const handleSubmit = (event) => {
        event.preventDefault();

        const name = event.target.adminName.value;
        const schoolName = event.target.schoolName.value;
        const email = event.target.email.value;
        const password = event.target.password.value;

        if (!name || !schoolName || !email || !password) {
            if (!name) setAdminNameError(true);
            if (!schoolName) setSchoolNameError(true);
            if (!email) setEmailError(true);
            if (!password) setPasswordError(true);
            return;
        }

        const fields = { name, email, password, role, schoolName }
        setLoader(true)
        dispatch(registerUser(fields, role))
    };

    const handleInputChange = (event) => {
        const { name } = event.target;
        if (name === 'email') setEmailError(false);
        if (name === 'password') setPasswordError(false);
        if (name === 'adminName') setAdminNameError(false);
        if (name === 'schoolName') setSchoolNameError(false);
    };

    useEffect(() => {
        if (status === 'success' || (currentUser !== null && currentRole === 'Admin')) {
            navigate('/Admin/dashboard');
        }
        else if (status === 'failed') {
            setMessage(response)
            setShowPopup(true)
            setLoader(false)
        }
        else if (status === 'error') {
            console.log(error)
        }
    }, [status, currentUser, currentRole, navigate, error, response]);

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
                        <StyledTypography variant="h4" sx={{ mb: 2, color: "var(--text-primary)" }}>
                            Admin Register
                        </StyledTypography>
                        <Typography variant="body1" sx={{ color: 'var(--text-secondary)', mb: 3, textAlign: 'center' }}>
                            Create your own school by registering as an admin.
                            <br />
                            You will be able to add students and faculty and
                            manage the system.
                        </Typography>
                        <Box component="form" noValidate onSubmit={handleSubmit} sx={{ mt: 2, width: '100%', maxWidth: '400px' }}>
                            <StyledTextField
                                margin="normal"
                                required
                                fullWidth
                                id="adminName"
                                label="Enter your name"
                                name="adminName"
                                autoComplete="name"
                                autoFocus
                                error={adminNameError}
                                helperText={adminNameError && 'Name is required'}
                                onChange={handleInputChange}
                                variant="outlined"
                            />
                            <StyledTextField
                                margin="normal"
                                required
                                fullWidth
                                id="schoolName"
                                label="Create your school name"
                                name="schoolName"
                                autoComplete="off"
                                error={schoolNameError}
                                helperText={schoolNameError && 'School name is required'}
                                onChange={handleInputChange}
                                variant="outlined"
                            />
                            <StyledTextField
                                margin="normal"
                                required
                                fullWidth
                                id="email"
                                label="Enter your email"
                                name="email"
                                autoComplete="email"
                                error={emailError}
                                helperText={emailError && 'Email is required'}
                                onChange={handleInputChange}
                                variant="outlined"
                            />
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
                                {loader ? <CircularProgress size={24} color="inherit" /> : "Register"}
                            </LightPurpleButton>
                            <Grid container justifyContent="center" sx={{ mt: 3 }}>
                                <Grid item>
                                    <Typography variant="body2" sx={{ color: 'var(--text-secondary)', mr: 1, display: 'inline' }}>
                                        Already have an account?
                                    </Typography>
                                    <StyledLink to="/Adminlogin">
                                        Log in
                                    </StyledLink>
                                </Grid>
                            </Grid>
                        </Box>
                    </Box>
                </Grid>
                <Grid
                    item
                    xs={false}
                    sm={4}
                    md={7}
                    sx={{
                        backgroundImage: `url(${bgpic})`,
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

export default AdminRegisterPage

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

const StyledLink = styled(Link)`
  text-decoration: none;
  color: var(--color-primary-600);
  font-weight: 600;
  transition: color 0.2s;
  
  &:hover {
      color: var(--color-primary-800);
  }
`;
