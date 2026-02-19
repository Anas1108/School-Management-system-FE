import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Grid,
  Paper,
  Container,
  CircularProgress,
  Backdrop,
  Typography,
} from '@mui/material';
import { AccountCircle, School, Group } from '@mui/icons-material';
import styled, { keyframes } from 'styled-components';
import { useDispatch, useSelector } from 'react-redux';
import { loginUser } from '../redux/userRelated/userHandle';
import Popup from '../components/Popup';

const ChooseUser = () => {
  const dispatch = useDispatch()
  const navigate = useNavigate()

  const { status, currentUser, currentRole } = useSelector(state => state.user);;

  const [loader, setLoader] = useState(false)
  const [showPopup, setShowPopup] = useState(false);
  const [message, setMessage] = useState("");

  const navigateHandler = (user) => {
    if (user === "Admin") {
      navigate('/Adminlogin');
    }

    else if (user === "Student") {
      navigate('/Studentlogin');
    }

    else if (user === "Teacher") {
      navigate('/Teacherlogin');
    }
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
    else if (status === 'error') {
      setLoader(false)
      setMessage("Network Error")
      setShowPopup(true)
    }
  }, [status, currentRole, navigate, currentUser]);

  return (
    <StyledContainer>
      <Container>
        <Title variant="h3" align="center" gutterBottom>
          Who are you?
        </Title>
        <SubTitle align="center" gutterBottom>
          Choose your role to continue
        </SubTitle>
        <Grid container spacing={4} justifyContent="center">
          <Grid item xs={12} sm={6} md={4}>
            <div onClick={() => navigateHandler("Admin")}>
              <StyledPaper elevation={3}>
                <IconWrapper color="var(--color-primary-600)">
                  <AccountCircle fontSize="inherit" />
                </IconWrapper>
                <StyledTypography>
                  Admin
                </StyledTypography>
                <Description>
                  Login as an administrator to access the dashboard to manage app data.
                </Description>
              </StyledPaper>
            </div>
          </Grid>
          <Grid item xs={12} sm={6} md={4}>
            <div onClick={() => navigateHandler("Student")}>
              <StyledPaper elevation={3}>
                <IconWrapper color="var(--color-secondary-500)">
                  <School fontSize="inherit" />
                </IconWrapper>
                <StyledTypography>
                  Student
                </StyledTypography>
                <Description>
                  Login as a student to explore course materials and assignments.
                </Description>
              </StyledPaper>
            </div>
          </Grid>
          <Grid item xs={12} sm={6} md={4}>
            <div onClick={() => navigateHandler("Teacher")}>
              <StyledPaper elevation={3}>
                <IconWrapper color="var(--color-primary-400)">
                  <Group fontSize="inherit" />
                </IconWrapper>
                <StyledTypography>
                  Teacher
                </StyledTypography>
                <Description>
                  Login as a teacher to create courses, assignments, and track student progress.
                </Description>
              </StyledPaper>
            </div>
          </Grid>
        </Grid>
      </Container>
      <Backdrop
        sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
        open={loader}
      >
        <CircularProgress color="inherit" />
        Please Wait
      </Backdrop>
      <Popup message={message} setShowPopup={setShowPopup} showPopup={showPopup} />
    </StyledContainer>
  );
};

export default ChooseUser;

const fadeIn = keyframes`
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
`;

const StyledContainer = styled.div`
  background-color: var(--bg-body);
  min-height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 2rem;
  background-image: var(--gradient-glass);
`;

const Title = styled(Typography)`
  && {
    font-family: var(--font-family-heading);
    color: var(--text-primary);
    font-weight: 700;
    margin-bottom: 0.5rem;
  }
`;

const SubTitle = styled(Typography)`
  && {
    color: var(--text-secondary);
    margin-bottom: 3rem;
  }
`;

const StyledPaper = styled(Paper)`
  padding: 2rem;
  text-align: center;
  background-color: var(--bg-paper) !important;
  color: var(--text-secondary);
  cursor: pointer;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  transition: all var(--transition-normal) !important;
  border: 1px solid var(--border-color);
  border-radius: var(--border-radius-xl) !important;
  animation: ${fadeIn} 0.5s ease-out forwards;

  &:hover {
    transform: translateY(-8px);
    box-shadow: var(--shadow-xl) !important;
    border-color: var(--color-primary-400);
  }
`;

const IconWrapper = styled.div`
  font-size: 4rem;
  margin-bottom: 1.5rem;
  color: ${props => props.color};
  transition: transform var(--transition-fast);

  ${StyledPaper}:hover & {
    transform: scale(1.1);
  }
`;

const StyledTypography = styled.h2`
  margin-bottom: 10px;
  font-family: var(--font-family-heading);
  color: var(--text-primary);
  font-size: 1.5rem;
`;

const Description = styled.p`
  color: var(--text-tertiary);
  font-size: 0.9rem;
  line-height: 1.6;
`;
