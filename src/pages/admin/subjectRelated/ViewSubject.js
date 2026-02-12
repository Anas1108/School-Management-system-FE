import React, { useEffect, useState } from 'react'
import { getClassStudents, getSubjectDetails } from '../../../redux/sclassRelated/sclassHandle';
import { useNavigate, useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { Box, Tab, Container, Typography, BottomNavigation, BottomNavigationAction, Paper, Grid, Tooltip } from '@mui/material';
import { GreenButton, ActionIconButtonPrimary, ActionIconButtonSuccess, ActionIconButtonInfo } from '../../../components/buttonStyles';
import TableTemplate from '../../../components/TableTemplate';
import TabContext from '@mui/lab/TabContext';
import TabList from '@mui/lab/TabList';
import TabPanel from '@mui/lab/TabPanel';
import styled from 'styled-components';
import VisibilityOutlinedIcon from '@mui/icons-material/VisibilityOutlined';
import EventAvailableOutlinedIcon from '@mui/icons-material/EventAvailableOutlined';
import GradeOutlinedIcon from '@mui/icons-material/GradeOutlined';

import InsertChartIcon from '@mui/icons-material/InsertChart';
import InsertChartOutlinedIcon from '@mui/icons-material/InsertChartOutlined';
import TableChartIcon from '@mui/icons-material/TableChart';
import TableChartOutlinedIcon from '@mui/icons-material/TableChartOutlined';

const ViewSubject = () => {
  const navigate = useNavigate()
  const params = useParams()
  const dispatch = useDispatch();
  const { subloading, subjectDetails, sclassStudents, getresponse, error } = useSelector((state) => state.sclass);

  const { classID, subjectID } = params

  useEffect(() => {
    dispatch(getSubjectDetails(subjectID, "Subject"));
    dispatch(getClassStudents(classID));
  }, [dispatch, subjectID, classID]);

  if (error) {
    console.log(error)
  }

  const [value, setValue] = useState('1');

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  const [selectedSection, setSelectedSection] = useState('attendance');
  const handleSectionChange = (event, newSection) => {
    setSelectedSection(newSection);
  };

  const studentColumns = [
    { id: 'rollNum', label: 'Roll No.', minWidth: 100 },
    { id: 'name', label: 'Name', minWidth: 170 },
  ]

  const studentRows = sclassStudents.map((student) => {
    return {
      rollNum: student.rollNum,
      name: student.name,
      id: student._id,
    };
  })

  const StudentsAttendanceButtonHaver = ({ row }) => {
    return (
      <>
        <Tooltip title="View" arrow>
          <ActionIconButtonPrimary
            onClick={() => navigate("/Admin/students/student/" + row.id)}>
            <VisibilityOutlinedIcon />
          </ActionIconButtonPrimary>
        </Tooltip>
        <Tooltip title="Take Attendance" arrow>
          <ActionIconButtonSuccess
            onClick={() => navigate(`/Admin/subject/student/attendance/${row.id}/${subjectID}`)}>
            <EventAvailableOutlinedIcon />
          </ActionIconButtonSuccess>
        </Tooltip>
      </>
    );
  };

  const StudentsMarksButtonHaver = ({ row }) => {
    return (
      <>
        <Tooltip title="View" arrow>
          <ActionIconButtonPrimary
            onClick={() => navigate("/Admin/students/student/" + row.id)}>
            <VisibilityOutlinedIcon />
          </ActionIconButtonPrimary>
        </Tooltip>
        <Tooltip title="Provide Marks" arrow>
          <ActionIconButtonInfo
            onClick={() => navigate(`/Admin/subject/student/marks/${row.id}/${subjectID}`)}>
            <GradeOutlinedIcon />
          </ActionIconButtonInfo>
        </Tooltip>
      </>
    );
  };

  const SubjectStudentsSection = () => {
    return (
      <>
        {getresponse ? (
          <>
            <Box sx={{ display: 'flex', justifyContent: 'flex-end', marginTop: '16px' }}>
              <GreenButton
                variant="contained"
                onClick={() => navigate("/Admin/class/addstudents/" + classID)}
              >
                Add Students
              </GreenButton>
            </Box>
          </>
        ) : (
          <>
            <Typography variant="h5" gutterBottom>
              Students List:
            </Typography>

            {selectedSection === 'attendance' &&
              <TableTemplate buttonHaver={StudentsAttendanceButtonHaver} columns={studentColumns} rows={studentRows} />
            }
            {selectedSection === 'marks' &&
              <TableTemplate buttonHaver={StudentsMarksButtonHaver} columns={studentColumns} rows={studentRows} />
            }

            <Paper sx={{ position: 'fixed', bottom: 0, left: 0, right: 0 }} elevation={3}>
              <BottomNavigation value={selectedSection} onChange={handleSectionChange} showLabels>
                <BottomNavigationAction
                  label="Attendance"
                  value="attendance"
                  icon={selectedSection === 'attendance' ? <TableChartIcon /> : <TableChartOutlinedIcon />}
                />
                <BottomNavigationAction
                  label="Marks"
                  value="marks"
                  icon={selectedSection === 'marks' ? <InsertChartIcon /> : <InsertChartOutlinedIcon />}
                />
              </BottomNavigation>
            </Paper>

          </>
        )}
      </>
    )
  }

  const SubjectDetailsSection = () => {
    const numberOfStudents = sclassStudents.length;

    return (
      <DetailsCard>
        <Typography variant="h4" component="h2" gutterBottom sx={{ fontWeight: 'bold', textAlign: 'center' }}>
          {subjectDetails && subjectDetails.subName}
        </Typography>
        <Grid container spacing={3} sx={{ mt: 2 }}>
          <Grid item xs={12} sm={6}>
            <InfoBox>
              <Typography variant="subtitle2" color="textSecondary">Subject Code</Typography>
              <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                {subjectDetails && subjectDetails.subCode}
              </Typography>
            </InfoBox>
          </Grid>
          <Grid item xs={12} sm={6}>
            <InfoBox>
              <Typography variant="subtitle2" color="textSecondary">Sessions</Typography>
              <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                {subjectDetails && subjectDetails.sessions}
              </Typography>
            </InfoBox>
          </Grid>
          <Grid item xs={12} sm={6}>
            <InfoBox>
              <Typography variant="subtitle2" color="textSecondary">Class Name</Typography>
              <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                {subjectDetails && subjectDetails.sclassName && subjectDetails.sclassName.sclassName}
              </Typography>
            </InfoBox>
          </Grid>
          <Grid item xs={12} sm={6}>
            <InfoBox>
              <Typography variant="subtitle2" color="textSecondary">Number of Students</Typography>
              <Typography variant="h6" sx={{ fontWeight: 'bold', color: 'var(--color-success-600)' }}>
                {numberOfStudents}
              </Typography>
            </InfoBox>
          </Grid>
        </Grid>
        <Box sx={{ mt: 4, textAlign: 'center' }}>
          {subjectDetails && subjectDetails.teacher ?
            <InfoBox>
              <Typography variant="subtitle2" color="textSecondary">Teacher Assigned</Typography>
              <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                {subjectDetails.teacher.name}
              </Typography>
            </InfoBox>
            :
            <GreenButton variant="contained"
              onClick={() => navigate("/Admin/teachers/addteacher/" + subjectDetails._id)}>
              Add Subject Teacher
            </GreenButton>
          }
        </Box>
      </DetailsCard>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      {subloading ?
        < div > Loading...</div >
        :
        <>
          <TabContext value={value}>
            <Paper sx={{ borderRadius: 'var(--border-radius-xl)', overflow: 'hidden' }}>
              <Box sx={{ borderBottom: 1, borderColor: 'divider', bgcolor: 'var(--bg-paper)' }}>
                <TabList onChange={handleChange} centered textColor="primary" indicatorColor="primary">
                  <Tab label="Details" value="1" />
                  <Tab label="Students" value="2" />
                </TabList>
              </Box>
              <TabPanel value="1" sx={{ p: 4 }}>
                <SubjectDetailsSection />
              </TabPanel>
              <TabPanel value="2" sx={{ p: 4 }}>
                <SubjectStudentsSection />
              </TabPanel>
            </Paper>
          </TabContext>
        </>
      }
    </Container>
  )
}

export default ViewSubject

const DetailsCard = styled(Box)`
    background: var(--bg-paper);
    border-radius: var(--border-radius-lg);
    padding: 2rem;
`;

const InfoBox = styled(Box)`
    padding: 1.5rem;
    background: var(--bg-default);
    border-radius: var(--border-radius-md);
    border: 1px solid var(--border-color);
`;