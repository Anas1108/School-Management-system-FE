import React, { useState } from 'react';
import styled from 'styled-components';
import { Card, CardContent, Typography, Box, Tab, Tabs, Grid, Avatar } from '@mui/material';
import { useSelector } from 'react-redux';
import PersonOutlineIcon from '@mui/icons-material/PersonOutline';
import ClassOutlinedIcon from '@mui/icons-material/ClassOutlined';

const TeacherProfile = () => {
  const { currentUser } = useSelector((state) => state.user);
  const [value, setValue] = useState(0);

  const teachSclass = currentUser.teachSclass;
  const teachSubject = currentUser.teachSubject;
  const teachSchool = currentUser.school;

  // Department could be populated or an ID
  const departmentName = currentUser.department?.departmentName || currentUser.department || "N/A";

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  return (
    <Container>
      <ProfileHeader>
        <Avatar sx={{ width: 100, height: 100, bgcolor: 'primary.main', mb: 2 }}>
          {currentUser.name ? currentUser.name[0].toUpperCase() : 'T'}
        </Avatar>
        <Typography variant="h4" fontWeight="bold">
          {currentUser.name}
        </Typography>
        <Typography variant="subtitle1" color="textSecondary">
          {currentUser.employeeId || "No Employee ID"}
        </Typography>
      </ProfileHeader>

      <StyledCard>
        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
          <Tabs value={value} onChange={handleChange} aria-label="teacher profile tabs" centered>
            <Tab label="Personal Details" icon={<PersonOutlineIcon />} iconPosition="start" />
            <Tab label="Class & Subject" icon={<ClassOutlinedIcon />} iconPosition="start" />
          </Tabs>
        </Box>

        <TabPanel value={value} index={0}>
          <Grid container spacing={2}>
            <InfoItem label="Email" value={currentUser.email} />
            <InfoItem label="Phone" value={currentUser.phone || "N/A"} />
            <InfoItem label="CNIC" value={currentUser.cnic || "N/A"} />
            <InfoItem label="Qualification" value={currentUser.qualification || "N/A"} />
            <InfoItem label="Designation" value={currentUser.designation || "N/A"} />
            <InfoItem label="Department" value={departmentName} />
            <InfoItem label="Joining Date" value={currentUser.joiningDate ? new Date(currentUser.joiningDate).toLocaleDateString() : "N/A"} />
            <InfoItem label="Service Book No" value={currentUser.serviceBookNumber || "N/A"} />
            <InfoItem label="Police Verification" value={currentUser.policeVerification || "No"} />
            <InfoItem label="Salary" value={currentUser.salary ? `${currentUser.salary}` : "N/A"} />
          </Grid>
        </TabPanel>

        <TabPanel value={value} index={1}>
          <Grid container spacing={2} justifyContent="center">
            <Grid item xs={12} md={6}>
              <SubjectCard>
                <Typography variant="h6" color="primary" gutterBottom>Teaching Load</Typography>
                <Typography variant="body1"><strong>Class:</strong> {teachSclass ? teachSclass.sclassName : "N/A"}</Typography>
                <Typography variant="body1"><strong>Subject:</strong> {teachSubject ? teachSubject.subName : "N/A"}</Typography>
                <Typography variant="body1"><strong>School:</strong> {teachSchool ? teachSchool.schoolName : "N/A"}</Typography>
              </SubjectCard>
            </Grid>
          </Grid>
        </TabPanel>
      </StyledCard>
    </Container>
  );
};

const InfoItem = ({ label, value }) => (
  <Grid item xs={12} sm={6}>
    <Box sx={{ p: 2, border: '1px solid #eee', borderRadius: 2 }}>
      <Typography variant="caption" color="textSecondary">{label}</Typography>
      <Typography variant="body1" fontWeight="500">{value}</Typography>
    </Box>
  </Grid>
);

const TabPanel = (props) => {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`tabpanel-${index}`}
      aria-labelledby={`tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: { xs: 2, md: 3 } }}>
          {children}
        </Box>
      )}
    </div>
  );
};

export default TeacherProfile;

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 20px;
`;

const ProfileHeader = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-bottom: 20px;
`;

const StyledCard = styled(Card)`
  width: 100%;
  max-width: 800px;
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0,0,0,0.1);
`;

const SubjectCard = styled.div`
    padding: 20px;
    background-color: #f9f9f9;
    border-radius: 8px;
    text-align: center;
`;