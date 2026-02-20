import React from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { useSelector } from 'react-redux';
import { ThemeProvider } from '@mui/material/styles';
import { CssBaseline } from '@mui/material';
import theme from './theme';

import Homepage from './pages/Homepage';
import AdminDashboard from './pages/admin/AdminDashboard';
import StudentDashboard from './pages/student/StudentDashboard';
import TeacherDashboard from './pages/teacher/TeacherDashboard';
import LoginPage from './pages/LoginPage';
import AdminRegisterPage from './pages/admin/AdminRegisterPage';
import ChooseUser from './pages/ChooseUser';

const App = () => {
  const { currentRole } = useSelector(state => state.user);

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Router>
        {currentRole === null &&
          <Routes>
            <Route path="/" element={<Homepage />} />
            <Route path="/choose" element={<ChooseUser />} />

            <Route path="/Adminlogin" element={<LoginPage role="Admin" />} />
            <Route path="/Studentlogin" element={<LoginPage role="Student" />} />
            <Route path="/Teacherlogin" element={<LoginPage role="Teacher" />} />

            <Route path="/Adminregister" element={<AdminRegisterPage />} />

            <Route path='*' element={<Navigate to="/" />} />
          </Routes>}

        {currentRole === "Admin" &&
          <>
            <AdminDashboard />
            <Routes>
              {/* <Route path="/Admin/subject-allocation" element={<SubjectAllocation />} />  Moved to AdminDashboard */}
            </Routes>
          </>
        }

        {currentRole === "Student" &&
          <>
            <StudentDashboard />
          </>
        }

        {currentRole === "Teacher" &&
          <>
            <TeacherDashboard />
          </>
        }
      </Router>
    </ThemeProvider>
  )
}

export default App