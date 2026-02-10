import React, { useEffect, useState } from "react";
import { Button, TextField, Grid, Box, Typography, CircularProgress, Container, Paper } from "@mui/material";
import { useNavigate, useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { addStuff } from '../../../redux/userRelated/userHandle';
import { underControl } from '../../../redux/userRelated/userSlice';
import Popup from '../../../components/Popup';
import styled from 'styled-components';

const SubjectForm = () => {
    const [subjects, setSubjects] = useState([{ subName: "", subCode: "", sessions: "" }]);

    const dispatch = useDispatch()
    const navigate = useNavigate()
    const params = useParams()

    const userState = useSelector(state => state.user);
    const { status, currentUser, response, error } = userState;

    const sclassName = params.id
    const adminID = currentUser._id
    const address = "Subject"

    const [showPopup, setShowPopup] = useState(false);
    const [message, setMessage] = useState("");
    const [loader, setLoader] = useState(false)

    const handleSubjectNameChange = (index) => (event) => {
        const newSubjects = [...subjects];
        newSubjects[index].subName = event.target.value;
        setSubjects(newSubjects);
    };

    const handleSubjectCodeChange = (index) => (event) => {
        const newSubjects = [...subjects];
        newSubjects[index].subCode = event.target.value;
        setSubjects(newSubjects);
    };

    const handleSessionsChange = (index) => (event) => {
        const newSubjects = [...subjects];
        newSubjects[index].sessions = event.target.value || 0;
        setSubjects(newSubjects);
    };

    const handleAddSubject = () => {
        setSubjects([...subjects, { subName: "", subCode: "" }]);
    };

    const handleRemoveSubject = (index) => () => {
        const newSubjects = [...subjects];
        newSubjects.splice(index, 1);
        setSubjects(newSubjects);
    };

    const fields = {
        sclassName,
        subjects: subjects.map((subject) => ({
            subName: subject.subName,
            subCode: subject.subCode,
            sessions: subject.sessions,
        })),
        adminID,
    };

    const submitHandler = (event) => {
        event.preventDefault();
        setLoader(true)
        dispatch(addStuff(fields, address))
    };

    useEffect(() => {
        if (status === 'added') {
            navigate("/Admin/subjects");
            dispatch(underControl())
            setLoader(false)
        }
        else if (status === 'failed') {
            setMessage(response)
            setShowPopup(true)
            setLoader(false)
        }
        else if (status === 'error') {
            setMessage("Network Error")
            setShowPopup(true)
            setLoader(false)
        }
    }, [status, navigate, error, response, dispatch]);

    return (
        <Container maxWidth="md" sx={{ mt: 4, mb: 4 }}>
            <StyledPaper elevation={3}>
                <Typography variant="h4" sx={{ mb: 3, fontWeight: 'bold', color: 'var(--text-primary)' }}>
                    Add Subjects
                </Typography>
                <form onSubmit={submitHandler}>
                    <Grid container spacing={2}>
                        {subjects.map((subject, index) => (
                            <React.Fragment key={index}>
                                <Grid item xs={12} sm={5}>
                                    <TextField
                                        fullWidth
                                        label="Subject Name"
                                        variant="outlined"
                                        value={subject.subName}
                                        onChange={handleSubjectNameChange(index)}
                                        required
                                    />
                                </Grid>
                                <Grid item xs={12} sm={3}>
                                    <TextField
                                        fullWidth
                                        label="Subject Code"
                                        variant="outlined"
                                        value={subject.subCode}
                                        onChange={handleSubjectCodeChange(index)}
                                        required
                                    />
                                </Grid>
                                <Grid item xs={12} sm={2}>
                                    <TextField
                                        fullWidth
                                        label="Sessions"
                                        variant="outlined"
                                        type="number"
                                        inputProps={{ min: 0 }}
                                        value={subject.sessions}
                                        onChange={handleSessionsChange(index)}
                                        required
                                    />
                                </Grid>
                                <Grid item xs={12} sm={2}>
                                    <Box display="flex" alignItems="center" height="100%">
                                        {index === 0 ? (
                                            <Button
                                                variant="outlined"
                                                color="primary"
                                                onClick={handleAddSubject}
                                                fullWidth
                                            >
                                                Add
                                            </Button>
                                        ) : (
                                            <Button
                                                variant="outlined"
                                                color="error"
                                                onClick={handleRemoveSubject(index)}
                                                fullWidth
                                            >
                                                Remove
                                            </Button>
                                        )}
                                    </Box>
                                </Grid>
                            </React.Fragment>
                        ))}
                        <Grid item xs={12}>
                            <Box display="flex" justifyContent="flex-end" gap={2} mt={2}>
                                <Button variant="outlined" onClick={() => navigate(-1)}>
                                    Cancel
                                </Button>
                                <SubmitButton variant="contained" type="submit" disabled={loader}>
                                    {loader ? (
                                        <CircularProgress size={24} color="inherit" />
                                    ) : (
                                        'Save Subjects'
                                    )}
                                </SubmitButton>
                            </Box>
                        </Grid>
                        <Popup message={message} setShowPopup={setShowPopup} showPopup={showPopup} />
                    </Grid>
                </form>
            </StyledPaper>
        </Container>
    );
}

export default SubjectForm

const StyledPaper = styled(Paper)`
    padding: 2.5rem;
    border-radius: var(--border-radius-xl);
    background: var(--bg-paper);
    border: 1px solid var(--border-color);
`;

const SubmitButton = styled(Button)`
    && {
        background: var(--gradient-primary);
        color: white;
        font-weight: bold;
        padding: 10px 24px;
        border-radius: var(--border-radius-md);
        text-transform: none;
        font-size: 1rem;
        box-shadow: var(--shadow-md);
        transition: all 0.3s ease;

        &:hover {
            box-shadow: var(--shadow-lg);
            transform: translateY(-2px);
            background: var(--gradient-primary);
            filter: brightness(1.1);
        }
    }
`;