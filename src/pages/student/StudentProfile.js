import React from 'react'
import styled from 'styled-components';
import { Card, CardContent, Typography, Grid, Box, Avatar, Container, Paper } from '@mui/material';
import { useSelector } from 'react-redux';
import SchoolIcon from '@mui/icons-material/School';
import ClassIcon from '@mui/icons-material/Class';
import BadgeIcon from '@mui/icons-material/Badge';

const StudentProfile = () => {
  const { currentUser, response, error } = useSelector((state) => state.user);

  if (response) { console.log(response) }
  else if (error) { console.log(error) }

  const sclassName = currentUser.sclassName
  const studentSchool = currentUser.school

  return (
    <>
      <Container maxWidth="md" sx={{ mt: 4, mb: 4 }}>
        <ProfileCard elevation={3}>
          <Box sx={{ textAlign: 'center', mb: 4 }}>
            <StyledAvatar>
              {String(currentUser.name).charAt(0)}
            </StyledAvatar>
            <Typography variant="h4" sx={{ mt: 2, fontWeight: 'bold', color: 'var(--text-primary)' }}>
              {currentUser.name}
            </Typography>
            <Typography variant="subtitle1" sx={{ color: 'var(--text-secondary)', mt: 1 }}>
              Student
            </Typography>
          </Box>

          <Grid container spacing={3}>
            <Grid item xs={12} sm={6}>
              <InfoBox>
                <IconWrapper>
                  <BadgeIcon sx={{ color: 'var(--color-primary-600)' }} />
                </IconWrapper>
                <Box>
                  <InfoLabel>Roll Number</InfoLabel>
                  <InfoValue>{currentUser.rollNum}</InfoValue>
                </Box>
              </InfoBox>
            </Grid>
            <Grid item xs={12} sm={6}>
              <InfoBox>
                <IconWrapper>
                  <ClassIcon sx={{ color: 'var(--color-success-600)' }} />
                </IconWrapper>
                <Box>
                  <InfoLabel>Class</InfoLabel>
                  <InfoValue>{sclassName.sclassName}</InfoValue>
                </Box>
              </InfoBox>
            </Grid>
            <Grid item xs={12}>
              <InfoBox>
                <IconWrapper>
                  <SchoolIcon sx={{ color: 'var(--color-info-600)' }} />
                </IconWrapper>
                <Box>
                  <InfoLabel>School</InfoLabel>
                  <InfoValue>{studentSchool.schoolName}</InfoValue>
                </Box>
              </InfoBox>
            </Grid>
          </Grid>
        </ProfileCard>

        <Card sx={{
          mt: 3,
          borderRadius: 'var(--border-radius-lg)',
          border: '1px solid var(--border-color)',
          boxShadow: 'var(--shadow-sm)'
        }}>
          <CardContent sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold', color: 'var(--text-primary)', mb: 3 }}>
              Personal Information
            </Typography>
            <Grid container spacing={3}>
              <Grid item xs={12} sm={6}>
                <DetailItem>
                  <DetailLabel>Date of Birth:</DetailLabel>
                  <DetailValue>January 1, 2000</DetailValue>
                </DetailItem>
              </Grid>
              <Grid item xs={12} sm={6}>
                <DetailItem>
                  <DetailLabel>Gender:</DetailLabel>
                  <DetailValue>Male</DetailValue>
                </DetailItem>
              </Grid>
              <Grid item xs={12} sm={6}>
                <DetailItem>
                  <DetailLabel>Email:</DetailLabel>
                  <DetailValue>john.doe@example.com</DetailValue>
                </DetailItem>
              </Grid>
              <Grid item xs={12} sm={6}>
                <DetailItem>
                  <DetailLabel>Phone:</DetailLabel>
                  <DetailValue>(123) 456-7890</DetailValue>
                </DetailItem>
              </Grid>
              <Grid item xs={12} sm={6}>
                <DetailItem>
                  <DetailLabel>Address:</DetailLabel>
                  <DetailValue>123 Main Street, City, Country</DetailValue>
                </DetailItem>
              </Grid>
              <Grid item xs={12} sm={6}>
                <DetailItem>
                  <DetailLabel>Emergency Contact:</DetailLabel>
                  <DetailValue>(987) 654-3210</DetailValue>
                </DetailItem>
              </Grid>
            </Grid>
          </CardContent>
        </Card>
      </Container>
    </>
  )
}

export default StudentProfile

const ProfileCard = styled(Paper)`
  padding: 3rem;
  border-radius: var(--border-radius-xl);
  background: var(--bg-paper);
  border: 1px solid var(--border-color);

  @media (max-width: 600px) {
    padding: 1.5rem;
  }
`;

const StyledAvatar = styled(Avatar)`
  && {
    width: 120px;
    height: 120px;
    margin: 0 auto;
    font-size: 3rem;
    background: var(--gradient-primary);
    box-shadow: var(--shadow-md);
  }
`;

const InfoBox = styled(Box)`
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1.5rem;
  background: var(--bg-default);
  border-radius: var(--border-radius-md);
  border: 1px solid var(--border-color);
  transition: all 0.2s ease;

  &:hover {
    border-color: var(--color-primary-300);
    box-shadow: var(--shadow-sm);
  }
`;

const IconWrapper = styled(Box)`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 48px;
  height: 48px;
  border-radius: var(--border-radius-md);
  background: var(--bg-paper);
`;

const InfoLabel = styled(Typography)`
  && {
    font-size: 0.875rem;
    color: var(--text-secondary);
    margin-bottom: 0.25rem;
  }
`;

const InfoValue = styled(Typography)`
  && {
    font-size: 1.125rem;
    font-weight: 600;
    color: var(--text-primary);
  }
`;

const DetailItem = styled(Box)`
  padding: 1rem;
  background: var(--bg-default);
  border-radius: var(--border-radius-sm);
`;

const DetailLabel = styled.strong`
  color: var(--text-secondary);
  font-size: 0.875rem;
  display: block;
  margin-bottom: 0.25rem;
`;

const DetailValue = styled.span`
  color: var(--text-primary);
  font-size: 1rem;
`;