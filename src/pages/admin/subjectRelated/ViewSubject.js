import React, { useEffect } from 'react'
import { getSubjectDetails } from '../../../redux/sclassRelated/sclassHandle';
import { useNavigate, useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { Box, Container, Typography, Grid, Tooltip, IconButton, Paper } from '@mui/material';
import { GreenButton } from '../../../components/buttonStyles';
import { ArrowBack as ArrowBackIcon, Edit as EditIcon } from '@mui/icons-material';
import styled from 'styled-components';
import CustomLoader from '../../../components/CustomLoader';

const ViewSubject = () => {
  const navigate = useNavigate()
  const params = useParams()
  const dispatch = useDispatch();
  const { subloading, subjectDetails, error } = useSelector((state) => state.sclass);

  const { subjectID } = params

  useEffect(() => {
    dispatch(getSubjectDetails(subjectID, "Subject"));
  }, [dispatch, subjectID]);

  if (error) {
    console.log(error)
  }

  const SubjectDetailsSection = () => {
    return (
      <DetailsCard>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
          <Typography variant="h4" component="h2" sx={{ fontWeight: 'bold' }}>
            {subjectDetails && subjectDetails.subName}
          </Typography>
          <Box sx={{ display: 'flex', gap: 1.5 }}>
            <Tooltip title="Back">
              <IconButton size="small" onClick={() => navigate(-1)} sx={{ border: '1px solid var(--border-color)', borderRadius: 'var(--border-radius-md)' }}>
                <ArrowBackIcon fontSize="small" />
              </IconButton>
            </Tooltip>
            <Tooltip title="Edit Subject">
              <IconButton size="small" onClick={() => navigate(`/Admin/subjects/edit/${subjectDetails?._id}`)} sx={{ bgcolor: 'primary.main', color: 'white', '&:hover': { bgcolor: 'primary.dark' }, borderRadius: 'var(--border-radius-md)' }}>
                <EditIcon fontSize="small" />
              </IconButton>
            </Tooltip>
          </Box>
        </Box>
        <Grid container spacing={3}>
          <Grid item xs={12} sm={4}>
            <InfoBox>
              <Typography variant="subtitle2" color="textSecondary">Subject Code</Typography>
              <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                {subjectDetails && subjectDetails.subCode}
              </Typography>
            </InfoBox>
          </Grid>
          <Grid item xs={12} sm={4}>
            <InfoBox>
              <Typography variant="subtitle2" color="textSecondary">Sessions</Typography>
              <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                {subjectDetails && subjectDetails.sessions}
              </Typography>
            </InfoBox>
          </Grid>
          <Grid item xs={12} sm={4}>
            <InfoBox>
              <Typography variant="subtitle2" color="textSecondary">Class Name</Typography>
              <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                {subjectDetails && subjectDetails.sclassName && subjectDetails.sclassName.sclassName}
              </Typography>
            </InfoBox>
          </Grid>
        </Grid>
        <Box sx={{ mt: 4, textAlign: 'center' }}>
          {subjectDetails && subjectDetails.teacher ?
            <InfoBox sx={{ display: 'inline-block', minWidth: '300px' }}>
              <Typography variant="subtitle2" color="textSecondary">Teacher Assigned</Typography>
              <Typography variant="h6" sx={{ fontWeight: 'bold', color: 'var(--color-primary-600)' }}>
                {subjectDetails.teacher.name}
              </Typography>
            </InfoBox>
            :
            <GreenButton variant="contained"
              onClick={() => navigate("/Admin/subject-allocation", { state: { classId: subjectDetails?.sclassName?._id } })}>
              Allocate Teacher
            </GreenButton>
          }
        </Box>
      </DetailsCard>
    );
  }

  return (
    <Container maxWidth="md" sx={{ mt: 4, mb: 4 }}>
      {subloading ?
        <CustomLoader />
        :
        <SubjectDetailsSection />
      }
    </Container>
  )
}

export default ViewSubject

const DetailsCard = styled(Paper)`
    background: var(--bg-paper);
    border-radius: var(--border-radius-lg);
    padding: 2.5rem;
    box-shadow: var(--shadow-md);
`;

const InfoBox = styled(Box)`
    padding: 1.5rem;
    background: var(--bg-default);
    border-radius: var(--border-radius-md);
    border: 1px solid var(--border-color);
`;