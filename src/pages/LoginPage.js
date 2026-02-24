import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import {
    Grid,
    Box,
    Typography,
    Paper,
    Checkbox,
    FormControlLabel,
    TextField,
    CssBaseline,
    IconButton,
    InputAdornment,
    CircularProgress,
    Fade,
    List,
    ListItem,
    ListItemIcon,
    ListItemText
} from '@mui/material';
import { ThemeProvider } from '@mui/material/styles';
import { Visibility, VisibilityOff, CheckCircleOutline } from '@mui/icons-material';
import TksLogo from "../assets/tks-Kulluwal.png";
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

    const roleContent = {
        Admin: {
            title: <>Smart Solutions for <br /> Modern Education</>,
            subtitle: "Manage your school with ease, efficiency, and excellence. Everything you need in one powerful platform.",
            features: [
                "Automated Academic Tracking",
                "Seamless Communication Tools",
                "Comprehensive Financial Management",
                "Advanced Student & Teacher Analytics"
            ]
        },
        Teacher: {
            title: <>Empowering Educators <br /> to Inspire Minds</>,
            subtitle: "Streamline your classroom management, track student performance, and enhance teaching with modern digital tools.",
            features: [
                "Interactive Attendance Tracking",
                "Simplified Gradebook Management",
                "Direct Student Communication",
                "Class Performance Analytics"
            ]
        },
        Student: {
            title: <>Your Gateway to <br /> Knowledge & Growth</>,
            subtitle: "Access your grades, attendance, and learning materials all in one place. Stay connected with your campus journey.",
            features: [
                "Real-time Attendance View",
                "Progress Reports & Grades",
                "Class Notices & Updates",
                "Library & Resource Access"
            ]
        }
    };

    const currentContent = roleContent[role] || roleContent.Admin;

    return (
        <ThemeProvider theme={theme}>
            <LoginRoot>
                <CssBaseline />
                <Grid container component="main" sx={{
                    minHeight: '100vh',
                    height: { xs: 'auto', md: '100vh' },
                    overflow: 'auto'
                }}>

                    {/* Visual/Text Side */}
                    <Grid item xs={false} sm={false} md={7} sx={{
                        background: 'var(--gradient-primary)',
                        display: { xs: 'none', md: 'flex' },
                        flexDirection: 'column',
                        color: 'white',
                        padding: { xs: 4, md: 8 },
                        position: 'relative',
                        zIndex: 1,
                    }}>
                        {/* Logo at Top Left */}
                        <Fade in={true} timeout={800}>
                            <Box sx={{ mb: { xs: 4, md: 10 } }}>
                                <img src={TksLogo} alt="TKS Logo" style={{ width: '150px', filter: 'brightness(1.1)' }} />
                            </Box>
                        </Fade>

                        <Fade in={true} timeout={1200}>
                            <Box sx={{ maxWidth: '600px', textAlign: 'left' }}>
                                <Typography variant="h1" sx={{
                                    fontWeight: 800,
                                    mb: 2,
                                    fontSize: { xs: '2.5rem', md: '3rem', lg: '3.5rem' },
                                    fontFamily: 'var(--font-family-heading)',
                                    lineHeight: 1.1,
                                    letterSpacing: '-0.02em',
                                }}>
                                    {currentContent.title}
                                </Typography>
                                <Typography variant="h5" sx={{
                                    fontWeight: 400,
                                    mb: 4,
                                    opacity: 0.9,
                                    maxWidth: '500px',
                                    lineHeight: 1.4,
                                    fontSize: { xs: '1rem', md: '1.1rem', lg: '1.25rem' }
                                }}>
                                    {currentContent.subtitle}
                                </Typography>

                                <Box sx={{
                                    mb: 4,
                                    display: {
                                        xs: 'none',
                                        lg: 'block',
                                        md: 'block'
                                    },
                                    /* Intelligent hiding for low-height screens */
                                    "@media (max-height: 750px)": {
                                        display: 'none'
                                    }
                                }}>
                                    <List sx={{ '& .MuiListItem-root': { px: 0, py: 0.5 } }}>
                                        {currentContent.features.map((text, index) => (
                                            <ListItem key={index}>
                                                <ListItemIcon sx={{ minWidth: '32px' }}>
                                                    <CheckCircleOutline sx={{ color: 'var(--color-secondary-400)', fontSize: '1.2rem' }} />
                                                </ListItemIcon>
                                                <ListItemText
                                                    primary={text}
                                                    primaryTypographyProps={{
                                                        variant: 'body2',
                                                        sx: { fontWeight: 500, opacity: 0.95 }
                                                    }}
                                                />
                                            </ListItem>
                                        ))}
                                    </List>
                                </Box>

                                <Box sx={{
                                    display: {
                                        xs: 'none',
                                        lg: 'flex',
                                        md: 'flex'
                                    },
                                    gap: 2,
                                    mt: 1,
                                    /* Intelligent hiding for low-height screens */
                                    "@media (max-height: 650px)": {
                                        display: 'none'
                                    }
                                }}>
                                    <StatBox>
                                        <Typography variant="h5" sx={{ fontWeight: 800, color: 'var(--color-secondary-400)' }}>Elite</Typography>
                                        <Typography variant="caption" sx={{ opacity: 0.8, fontWeight: 600, display: 'block' }}>Management System</Typography>
                                    </StatBox>
                                    <StatBox>
                                        <Typography variant="h5" sx={{ fontWeight: 800, color: 'var(--color-secondary-400)' }}>Trusted</Typography>
                                        <Typography variant="caption" sx={{ opacity: 0.8, fontWeight: 600, display: 'block' }}>By Leading Institutions</Typography>
                                    </StatBox>
                                </Box>
                            </Box>
                        </Fade>
                    </Grid>

                    {/* Form Side */}
                    <Grid item xs={12} sm={12} md={5} component={Paper} elevation={0} square sx={{
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'center',
                        backgroundColor: 'var(--bg-paper)',
                        position: 'relative',
                        zIndex: 2,
                        boxShadow: '-10px 0 30px rgba(0,0,0,0.05)'
                    }}>
                        <Fade in={true} timeout={1200}>
                            <Box sx={{
                                py: { xs: 4, md: 0 },
                                px: { xs: 2, sm: 4, md: 10 },
                                display: 'flex',
                                flexDirection: 'column',
                                alignItems: 'center',
                                width: '100%',
                            }}>
                                {/* Mobile/Tablet Logo */}
                                <Box sx={{ display: { xs: 'block', md: 'none' }, mb: 4, textAlign: 'center' }}>
                                    <img src={TksLogo} alt="TKS Logo" style={{ width: '140px' }} />
                                </Box>
                                <Box sx={{ textAlign: 'center', mb: 3 }}>
                                    <StyledTypography variant="h4" sx={{ mb: 0.5, color: "var(--text-primary)", fontWeight: 800 }}>
                                        {role} Access
                                    </StyledTypography>
                                    <Typography variant="body2" sx={{ color: 'var(--text-secondary)', fontWeight: 500 }}>
                                        Welcome back to TKS Kulluwal Campus
                                    </Typography>
                                </Box>

                                <Box component="form" noValidate onSubmit={handleSubmit} sx={{ mt: 1, width: '100%', maxWidth: '400px' }}>
                                    {role === "Student" ? (
                                        <>
                                            <StyledTextField
                                                margin="normal"
                                                required
                                                fullWidth
                                                id="rollNumber"
                                                label="Roll Number"
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
                                                label="Full Name"
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
                                            label="Email Address"
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
                                                        {toggle ? <Visibility /> : <VisibilityOff />}
                                                    </IconButton>
                                                </InputAdornment>
                                            ),
                                        }}
                                    />

                                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 2 }}>
                                        <FormControlLabel
                                            control={<Checkbox value="remember" color="primary" sx={{ borderRadius: '4px' }} />}
                                            label={<Typography variant="body2" sx={{ color: 'var(--text-secondary)', fontWeight: 500 }}>Remember me</Typography>}
                                        />
                                        <Typography variant="body2" sx={{ color: 'var(--color-primary-600)', fontWeight: 600, cursor: 'pointer', '&:hover': { textDecoration: 'underline' } }}>
                                            Forgot Password?
                                        </Typography>
                                    </Box>

                                    <LoginButton
                                        type="submit"
                                        fullWidth
                                        variant="contained"
                                        disabled={loader}
                                    >
                                        {loader ? <CircularProgress size={24} color="inherit" /> : `Log in as ${role}`}
                                    </LoginButton>

                                    <Box sx={{ mt: 4, textAlign: 'center' }}>
                                        <Typography variant="body2" sx={{ color: 'var(--text-tertiary)', mb: 1 }}>
                                            Authorized Personnel Only
                                        </Typography>
                                        <Typography variant="caption" sx={{ color: 'var(--text-tertiary)', fontStyle: 'italic' }}>
                                            Managed by ILM Trust. Leading education since 1990.
                                        </Typography>
                                    </Box>
                                </Box>
                            </Box>
                        </Fade>
                    </Grid>
                </Grid>

                <Popup message={message} setShowPopup={setShowPopup} showPopup={showPopup} />
            </LoginRoot>
        </ThemeProvider>
    );
}

export default LoginPage

const LoginRoot = styled.div`
    height: 100vh;
    background-color: var(--bg-body);
`;

const StyledTypography = styled(Typography)`
    font-family: var(--font-family-heading) !important;
    font-weight: 700 !important;
`;

const StyledTextField = styled(TextField)`
    & .MuiOutlinedInput-root {
        border-radius: var(--border-radius-lg) !important;
        background-color: var(--color-gray-50);
        transition: all 0.2s ease;
        
        & fieldset {
            border-color: var(--color-gray-200);
            border-width: 1px;
        }
        
        &:hover fieldset {
            border-color: var(--color-primary-300);
        }
        
        &.Mui-focused fieldset {
            border-color: var(--color-primary-600);
            border-width: 2px;
        }

        & input {
            padding: 18px 14px;
        }
    }
    
    & .MuiInputLabel-root {
        &.Mui-focused {
            color: var(--color-primary-600);
        }
    }
`;

const LoginButton = styled(LightPurpleButton)`
    margin-top: 2.5rem !important;
    margin-bottom: 1rem !important;
    padding: 14px !important;
    font-size: 1rem !important;
    font-weight: 800 !important;
    text-transform: none !important;
    border-radius: var(--border-radius-lg) !important;
    background: var(--gradient-primary) !important;
    box-shadow: 0 8px 20px rgba(155, 27, 48, 0.2) !important;
    transition: all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275) !important;
    
    &:hover {
        box-shadow: 0 12px 28px rgba(155, 27, 48, 0.3) !important;
        transform: translateY(-2px);
    }

    &:active {
        transform: translateY(0);
    }

    &:disabled {
        opacity: 0.7;
        background: var(--color-gray-400) !important;
    }
`;

const StatBox = styled(Box)`
    padding: 0.75rem 1rem;
    border-radius: var(--border-radius-lg);
    background: rgba(255, 255, 255, 0.08);
    backdrop-filter: blur(12px);
    border: 1px solid rgba(255, 255, 255, 0.12);
    min-width: 140px;
    transition: all 0.3s ease;

    &:hover {
        background: rgba(255, 255, 255, 0.12);
        transform: translateY(-4px);
        border-color: rgba(255, 255, 255, 0.2);
    }
`;
