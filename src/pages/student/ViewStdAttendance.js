import React, { useEffect, useState } from 'react'
import { KeyboardArrowDown, KeyboardArrowUp } from '@mui/icons-material';
import { BottomNavigation, BottomNavigationAction, Box, Button, Collapse, Paper, Table, TableBody, TableHead, Typography, Container } from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import { getUserDetails } from '../../redux/userRelated/userHandle';
import { calculateOverallAttendancePercentage, calculateSubjectAttendancePercentage, groupAttendanceBySubject } from '../../components/attendanceCalculator';
import styled from 'styled-components';

import CustomBarChart from '../../components/CustomBarChart'

import InsertChartIcon from '@mui/icons-material/InsertChart';
import InsertChartOutlinedIcon from '@mui/icons-material/InsertChartOutlined';
import TableChartIcon from '@mui/icons-material/TableChart';
import TableChartOutlinedIcon from '@mui/icons-material/TableChartOutlined';
import { StyledTableCell, StyledTableRow } from '../../components/styles';

const ViewStdAttendance = () => {
    const dispatch = useDispatch();

    const [openStates, setOpenStates] = useState({});

    const handleOpen = (subId) => {
        setOpenStates((prevState) => ({
            ...prevState,
            [subId]: !prevState[subId],
        }));
    };

    const { userDetails, currentUser, loading, response, error } = useSelector((state) => state.user);

    useEffect(() => {
        dispatch(getUserDetails(currentUser._id, "Student"));
    }, [dispatch, currentUser._id]);

    if (response) { console.log(response) }
    else if (error) { console.log(error) }

    const [subjectAttendance, setSubjectAttendance] = useState([]);
    const [selectedSection, setSelectedSection] = useState('table');

    useEffect(() => {
        if (userDetails) {
            setSubjectAttendance(userDetails.attendance || []);
        }
    }, [userDetails])

    const attendanceBySubject = groupAttendanceBySubject(subjectAttendance)

    const overallAttendancePercentage = calculateOverallAttendancePercentage(subjectAttendance);

    const subjectData = Object.entries(attendanceBySubject).map(([subName, { subCode, present, sessions }]) => {
        const subjectAttendancePercentage = calculateSubjectAttendancePercentage(present, sessions);
        return {
            subject: subName,
            attendancePercentage: subjectAttendancePercentage,
            totalClasses: sessions,
            attendedClasses: present
        };
    });

    const handleSectionChange = (event, newSection) => {
        setSelectedSection(newSection);
    };

    const renderTableSection = () => {
        return (
            <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
                <Typography variant="h4" sx={{ mb: 3, fontWeight: 'bold', color: 'var(--text-primary)' }}>
                    Attendance
                </Typography>
                <StyledPaper>
                    <Table>
                        <TableHead>
                            <StyledTableRow>
                                <StyledTableCell>Subject</StyledTableCell>
                                <StyledTableCell>Present</StyledTableCell>
                                <StyledTableCell>Total Sessions</StyledTableCell>
                                <StyledTableCell>Attendance Percentage</StyledTableCell>
                                <StyledTableCell align="center">Actions</StyledTableCell>
                            </StyledTableRow>
                        </TableHead>
                        {Object.entries(attendanceBySubject).map(([subName, { present, allData, subId, sessions }], index) => {
                            const subjectAttendancePercentage = calculateSubjectAttendancePercentage(present, sessions);

                            return (
                                <TableBody key={index}>
                                    <StyledTableRow>
                                        <StyledTableCell>{subName}</StyledTableCell>
                                        <StyledTableCell>{present}</StyledTableCell>
                                        <StyledTableCell>{sessions}</StyledTableCell>
                                        <StyledTableCell>
                                            <PercentageBadge $percentage={subjectAttendancePercentage}>
                                                {subjectAttendancePercentage}%
                                            </PercentageBadge>
                                        </StyledTableCell>
                                        <StyledTableCell align="center">
                                            <Button variant="outlined" size="small"
                                                onClick={() => handleOpen(subId)}>
                                                {openStates[subId] ? <KeyboardArrowUp /> : <KeyboardArrowDown />}Details
                                            </Button>
                                        </StyledTableCell>
                                    </StyledTableRow>
                                    <StyledTableRow>
                                        <StyledTableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={6}>
                                            <Collapse in={openStates[subId]} timeout="auto" unmountOnExit>
                                                <Box sx={{ margin: 2 }}>
                                                    <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold', color: 'var(--text-primary)' }}>
                                                        Attendance Details
                                                    </Typography>
                                                    <Table size="small">
                                                        <TableHead>
                                                            <StyledTableRow>
                                                                <StyledTableCell>Date</StyledTableCell>
                                                                <StyledTableCell align="right">Status</StyledTableCell>
                                                            </StyledTableRow>
                                                        </TableHead>
                                                        <TableBody>
                                                            {allData.map((data, index) => {
                                                                const date = new Date(data.date);
                                                                const dateString = date.toString() !== "Invalid Date" ? date.toISOString().substring(0, 10) : "Invalid Date";
                                                                return (
                                                                    <StyledTableRow key={index}>
                                                                        <StyledTableCell component="th" scope="row">
                                                                            {dateString}
                                                                        </StyledTableCell>
                                                                        <StyledTableCell align="right">
                                                                            <StatusBadge $status={data.status}>
                                                                                {data.status}
                                                                            </StatusBadge>
                                                                        </StyledTableCell>
                                                                    </StyledTableRow>
                                                                )
                                                            })}
                                                        </TableBody>
                                                    </Table>
                                                </Box>
                                            </Collapse>
                                        </StyledTableCell>
                                    </StyledTableRow>
                                </TableBody>
                            )
                        }
                        )}
                    </Table>
                </StyledPaper>
                <OverallStats>
                    <Typography variant="h6" sx={{ fontWeight: 'bold', color: 'var(--text-primary)' }}>
                        Overall Attendance: <span style={{ color: 'var(--color-success-600)' }}>{overallAttendancePercentage.toFixed(2)}%</span>
                    </Typography>
                </OverallStats>
            </Container>
        )
    }

    const renderChartSection = () => {
        return (
            <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
                <Typography variant="h4" sx={{ mb: 3, fontWeight: 'bold', color: 'var(--text-primary)' }}>
                    Attendance Chart
                </Typography>
                <CustomBarChart chartData={subjectData} dataKey="attendancePercentage" />
            </Container>
        )
    };

    return (
        <>
            {loading
                ? (
                    <Container maxWidth="lg" sx={{ mt: 4, textAlign: 'center' }}>
                        <Typography variant="h6">Loading...</Typography>
                    </Container>
                )
                :
                <div>
                    {subjectAttendance && Array.isArray(subjectAttendance) && subjectAttendance.length > 0 ?
                        <>
                            {selectedSection === 'table' && renderTableSection()}
                            {selectedSection === 'chart' && renderChartSection()}

                            <Paper sx={{ position: 'fixed', bottom: 0, left: 0, right: 0 }} elevation={3}>
                                <BottomNavigation value={selectedSection} onChange={handleSectionChange} showLabels>
                                    <BottomNavigationAction
                                        label="Table"
                                        value="table"
                                        icon={selectedSection === 'table' ? <TableChartIcon /> : <TableChartOutlinedIcon />}
                                    />
                                    <BottomNavigationAction
                                        label="Chart"
                                        value="chart"
                                        icon={selectedSection === 'chart' ? <InsertChartIcon /> : <InsertChartOutlinedIcon />}
                                    />
                                </BottomNavigation>
                            </Paper>
                        </>
                        :
                        <Container maxWidth="lg" sx={{ mt: 4 }}>
                            <EmptyState>
                                <Typography variant="h5" color="textSecondary">
                                    Currently You Have No Attendance Details
                                </Typography>
                            </EmptyState>
                        </Container>
                    }
                </div>
            }
        </>
    )
}

export default ViewStdAttendance

const StyledPaper = styled(Paper)`
    border-radius: var(--border-radius-lg);
    border: 1px solid var(--border-color);
    box-shadow: var(--shadow-sm);
    overflow: hidden;
`;

const OverallStats = styled(Box)`
    margin-top: 2rem;
    padding: 1.5rem;
    background: var(--bg-paper);
    border-radius: var(--border-radius-md);
    border: 1px solid var(--border-color);
    text-align: center;
`;

const PercentageBadge = styled.span`
    padding: 0.25rem 0.75rem;
    border-radius: var(--border-radius-sm);
    font-weight: 600;
    background: ${props => props.$percentage >= 75 ? 'var(--color-success-100)' : props.$percentage >= 50 ? 'var(--color-warning-100)' : 'var(--color-error-100)'};
    color: ${props => props.$percentage >= 75 ? 'var(--color-success-700)' : props.$percentage >= 50 ? 'var(--color-warning-700)' : 'var(--color-error-700)'};
`;

const StatusBadge = styled.span`
    padding: 0.25rem 0.75rem;
    border-radius: var(--border-radius-sm);
    font-weight: 600;
    font-size: 0.875rem;
    background: ${props => props.$status === 'Present' ? 'var(--color-success-100)' : 'var(--color-error-100)'};
    color: ${props => props.$status === 'Present' ? 'var(--color-success-700)' : 'var(--color-error-700)'};
`;

const EmptyState = styled(Box)`
    display: flex;
    justify-content: center;
    align-items: center;
    min-height: 400px;
    background: var(--bg-paper);
    border-radius: var(--border-radius-lg);
    border: 1px solid var(--border-color);
`;