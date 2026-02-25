import React from 'react';
import { Link } from 'react-router-dom';
import { Typography, Button, Box } from '@mui/material';
import { PlayArrow } from '@mui/icons-material';
import styled from 'styled-components';
import TKSLogo from "../assets/tks-Kulluwal.png";

const Homepage = () => {
  return (
    <MainContainer>
      <LeftPanel>
        <LogoWrapper>
          <LogoImage src={TKSLogo} alt="TKS Logo" />
          <Typography variant="h6" sx={{ fontWeight: 700, ml: 1, color: 'var(--color-primary-600)' }}>
            TKS Kulluwal
          </Typography>
        </LogoWrapper>

        <TextContent>
          <HeroBadge>The Knowledge School</HeroBadge>
          <HeroTitle variant="h1">
            Empowering <br />
            <GradientText>Future Leaders</GradientText>
          </HeroTitle>
          <HeroDescription>
            TKS Kulluwal Campus provides a nurturing environment where students excel academically, socially, and emotionally. Streamline school management and tracking with our unified platform.
          </HeroDescription>

          <ButtonWrapper>
            <StyledLink to="/choose">
              <LoginButton variant="contained">
                Explore Portal <PlayArrow sx={{ ml: 1 }} />
              </LoginButton>
            </StyledLink>
          </ButtonWrapper>
        </TextContent>

        <FooterCredits>
          &copy; {new Date().getFullYear()} TKS Kulluwal Campus. All Rights Reserved.
        </FooterCredits>
      </LeftPanel>

      <RightPanel>
        <DiagonalDivider />
        <VideoWrapper>
          <VideoFrame>
            <iframe
              width="100%"
              height="100%"
              src="https://www.youtube.com/embed/wjBJB8s1ViY?autoplay=1&mute=1&loop=1&playlist=wjBJB8s1ViY"
              title="TKS Kulluwal Campus Video"
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            ></iframe>
          </VideoFrame>
        </VideoWrapper>
      </RightPanel>

      {/* Background Decorations */}
      <FloatingShape1 />
      <FloatingShape2 />
    </MainContainer>
  );
};

export default Homepage;

// Styled Components
const MainContainer = styled.div`
  display: flex;
  height: 100vh;
  width: 100vw;
  overflow: hidden;
  background-color: var(--color-white);
  position: relative;
  
  @media (max-width: 900px) {
    flex-direction: column;
    overflow-y: auto;
    height: auto;
    min-height: 100vh;
  }
`;

const LeftPanel = styled.div`
  flex: 1.2;
  display: flex;
  flex-direction: column;
  justify-content: center;
  padding: 0 8% 0 10%;
  position: relative;
  z-index: 10;
  
  @media (max-width: 900px) {
    padding: 3rem 2rem;
    align-items: center;
    text-align: center;
  }
`;

const LogoWrapper = styled.div`
  position: absolute;
  top: 40px;
  left: 10%;
  display: flex;
  align-items: center;
  
  @media (max-width: 900px) {
    position: relative;
    top: 0;
    left: 0;
    margin-bottom: 2rem;
  }
`;

const LogoImage = styled.img`
  width: 45px;
  height: auto;
`;

const TextContent = styled.div`
  max-width: 550px;
`;

const HeroBadge = styled.span`
  background: var(--color-primary-50);
  color: var(--color-primary-600);
  padding: 6px 16px;
  border-radius: 50px;
  font-weight: 600;
  font-size: 0.8rem;
  display: inline-block;
  margin-bottom: 1.5rem;
  border: 1px solid var(--color-primary-100);
  letter-spacing: 1px;
  text-transform: uppercase;
`;

const HeroTitle = styled(Typography)`
  && {
    font-size: clamp(2.5rem, 4.5vw, 4.5rem);
    font-weight: 800;
    line-height: 1.1;
    margin-bottom: 1.5rem;
    font-family: var(--font-family-heading);
    color: var(--color-gray-900);
  }
`;

const HeroDescription = styled(Typography)`
  && {
    font-size: 1.125rem;
    color: var(--text-secondary);
    margin-bottom: 2.5rem;
    line-height: 1.6;
    max-width: 480px;
  }
`;

const ButtonWrapper = styled(Box)`
  display: flex;
  gap: 1rem;
`;

const LoginButton = styled(Button)`
  && {
    border-radius: 50px;
    padding: 12px 35px;
    font-size: 1rem;
    font-weight: 600;
    background: var(--gradient-primary);
    box-shadow: 0 10px 20px rgba(155, 27, 48, 0.2);
    transition: all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);
    
    &:hover {
      transform: translateY(-5px);
      box-shadow: 0 15px 30px rgba(155, 27, 48, 0.3);
      filter: brightness(1.1);
    }
  }
`;

const GradientText = styled.span`
  background: var(--gradient-primary);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
`;

const FooterCredits = styled.div`
  position: absolute;
  bottom: 40px;
  left: 10%;
  font-size: 0.8rem;
  color: var(--color-gray-400);
  
  @media (max-width: 900px) {
    position: relative;
    bottom: 0;
    left: 0;
    margin-top: 3rem;
  }
`;

const RightPanel = styled.div`
  flex: 1;
  background-color: var(--color-primary-900);
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 2rem;
  
  @media (max-width: 900px) {
    flex: none;
    height: 400px;
    width: 100%;
    padding: 1rem;
  }
`;

const DiagonalDivider = styled.div`
  position: absolute;
  top: 0;
  left: -150px;
  height: 100%;
  width: 300px;
  background-color: var(--color-primary-900);
  transform: skewX(-12deg);
  z-index: 1;
  
  &::after {
    content: '';
    position: absolute;
    top: 0;
    left: 20px;
    height: 100%;
    width: 4px;
    background: var(--color-secondary-500);
    opacity: 0.5;
  }

  @media (max-width: 900px) {
    display: none;
  }
`;

const VideoWrapper = styled.div`
  width: 100%;
  max-width: 800px;
  position: relative;
  z-index: 5;
  filter: drop-shadow(0 25px 50px rgba(0,0,0,0.5));
  
  &::before {
    content: '';
    position: absolute;
    top: -15px;
    left: -15px;
    right: 15px;
    bottom: 15px;
    border: 1px solid var(--color-secondary-400);
    z-index: -1;
    border-radius: 12px;
    opacity: 0.4;
  }
`;

const VideoFrame = styled.div`
  aspect-ratio: 16 / 9;
  border-radius: 12px;
  overflow: hidden;
  background: #000;
  border: 1px solid rgba(255,255,255,0.1);
`;

const FloatingShape1 = styled.div`
  position: absolute;
  top: -100px;
  left: -100px;
  width: 300px;
  height: 300px;
  background: radial-gradient(circle, var(--color-primary-50) 0%, transparent 70%);
  border-radius: 50%;
  z-index: 1;
  opacity: 0.6;
`;

const FloatingShape2 = styled.div`
  position: absolute;
  bottom: 10%;
  left: 30%;
  width: 150px;
  height: 150px;
  background: radial-gradient(circle, var(--color-secondary-100) 0%, transparent 70%);
  border-radius: 50%;
  z-index: 1;
  opacity: 0.4;
`;

const StyledLink = styled(Link)`
  text-decoration: none;
`;
