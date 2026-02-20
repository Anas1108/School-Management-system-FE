import React from 'react';
import styled, { keyframes } from 'styled-components';
import { Box, Typography } from '@mui/material';

const spin = keyframes`
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
`;

const LoaderContainer = styled(Box)`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  height: 60vh;
  width: 100%;
`;

const Spinner = styled.div`
  width: 50px;
  height: 50px;
  border: 5px solid rgba(155, 27, 48, 0.2);
  border-top: 5px solid #9b1b30;
  border-radius: 50%;
  animation: ${spin} 1s linear infinite;
  margin-bottom: 20px;
`;



const LoadingText = styled(Typography)`
  font-family: 'Poppins', sans-serif;
  font-weight: 500;
  color: #555;
  letter-spacing: 1px;
  margin-top: 10px;
`;

const CustomLoader = () => {
  return (
    <LoaderContainer>
      <Spinner />
      {/* <PulseCircle />  Optional: Inner pulse circle for extra effect */}
      <LoadingText variant="h6">
        Loading Data...
      </LoadingText>
    </LoaderContainer>
  );
};

export default CustomLoader;
