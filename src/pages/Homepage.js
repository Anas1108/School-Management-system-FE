import React from 'react';
import { Link } from 'react-router-dom';
import { Container, Grid, Box, Button, Typography, Paper } from '@mui/material';
import styled, { keyframes } from 'styled-components';
import Students from "../assets/students.svg";
import { LightPurpleButton } from '../components/buttonStyles';

const Homepage = () => {
    return (
        <StyledContainer maxWidth={false}>
            <Grid container spacing={4} alignItems="center" justifyContent="center">
                <Grid item xs={12} md={6}>
                    <ContentWrapper>
                        <StyledTitle variant="h1">
                            Welcome to the <br />
                            <GradientText>School Management</GradientText> <br />
                            System
                        </StyledTitle>
                        <StyledText>
                            Streamline school management, class organization, and add students and faculty.
                            Seamlessly track attendance, assess performance, and provide feedback.
                            Access records, view marks, and communicate effortlessly.
                        </StyledText>
                        <ButtonContainer>
                            <StyledLink to="/choose">
                                <LightPurpleButton variant="contained" fullWidth>
                                    Login
                                </LightPurpleButton>
                            </StyledLink>
                            <StyledLink to="/chooseasguest">
                                <GuestButton variant="outlined" fullWidth>
                                    Login as Guest
                                </GuestButton>
                            </StyledLink>
                        </ButtonContainer>
                        <FooterText>
                            Don't have an account?{' '}
                            <Link to="/Adminregister" style={{ color: "var(--color-primary-600)", fontWeight: "600" }}>
                                Sign up
                            </Link>
                        </FooterText>
                    </ContentWrapper>
                </Grid>
                <Grid item xs={12} md={6}>
                    <ImageWrapper>
                        <StyledImage src={Students} alt="students" />
                    </ImageWrapper>
                </Grid>
            </Grid>
            <BackgroundShape1 />
            <BackgroundShape2 />
        </StyledContainer>
    );
};

export default Homepage;

const float = keyframes`
  0% { transform: translateY(0px); }
  50% { transform: translateY(-20px); }
  100% { transform: translateY(0px); }
`;

const StyledContainer = styled(Container)`
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  position: relative;
  overflow: hidden;
  background-color: var(--bg-body);
  padding: 2rem !important;
`;

const ContentWrapper = styled.div`
  padding: 2rem;
  z-index: 10;
  position: relative;
  
  @media (max-width: 768px) {
    text-align: center;
    padding: 1rem;
  }
`;

const ImageWrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  animation: ${float} 6s ease-in-out infinite;
  z-index: 10;
  position: relative;
`;

const StyledImage = styled.img`
  width: 100%;
  max-width: 600px;
  filter: drop-shadow(0 20px 30px rgba(0,0,0,0.1));
`;

const StyledTitle = styled(Typography)`
  && {
    font-size: clamp(2.5rem, 5vw, 4rem);
    color: var(--text-primary);
    font-weight: 800;
    line-height: 1.2;
    margin-bottom: 1.5rem;
    font-family: var(--font-family-heading);
  }
`;

const GradientText = styled.span`
  background: var(--gradient-primary);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
`;

const StyledText = styled.p`
  color: var(--text-secondary);
  font-size: 1.1rem;
  line-height: 1.6;
  margin-bottom: 2.5rem;
  max-width: 600px;
  
  @media (max-width: 768px) {
    margin-left: auto;
    margin-right: auto;
  }
`;

const ButtonContainer = styled.div`
  display: flex;
  gap: 1.5rem;
  margin-bottom: 2rem;
  
  @media (max-width: 768px) {
    flex-direction: column;
    align-items: center;
    width: 100%;
  }
`;

const StyledLink = styled(Link)`
  text-decoration: none;
  width: 100%;
  max-width: 200px;
`;

const GuestButton = styled(Button)`
  && {
    color: var(--color-primary-600);
    border-color: var(--color-primary-600);
    padding: 12px 24px;
    border-radius: var(--border-radius-lg);
    font-weight: 600;
    font-family: var(--font-family-sans);
    
    &:hover {
      background-color: var(--color-primary-50);
      border-color: var(--color-primary-700);
      transform: translateY(-2px);
      box-shadow: var(--shadow-md);
    }
  }
`;

const FooterText = styled.p`
  color: var(--text-tertiary);
  font-size: 0.9rem;
  margin-top: 1rem;
`;

const BackgroundShape1 = styled.div`
  position: absolute;
  top: -10%;
  right: -5%;
  width: 50vw;
  height: 50vw;
  background: radial-gradient(circle, var(--color-primary-100) 0%, rgba(255,255,255,0) 70%);
  border-radius: 50%;
  z-index: 1;
  pointer-events: none;
`;

const BackgroundShape2 = styled.div`
  position: absolute;
  bottom: -10%;
  left: -10%;
  width: 40vw;
  height: 40vw;
  background: radial-gradient(circle, var(--color-secondary-100) 0%, rgba(255,255,255,0) 70%);
  border-radius: 50%;
  z-index: 1;
  pointer-events: none;
`;
