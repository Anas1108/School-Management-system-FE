import React, { useEffect, useState } from "react";
import { Button, TextField, Grid, Box, Typography, CircularProgress, Container, Paper } from "@mui/material";
import { useNavigate, useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { updateUser } from '../../../redux/userRelated/userHandle';
import { getSubjectDetails } from '../../../redux/sclassRelated/sclassHandle';
import { underControl } from '../../../redux/userRelated/userSlice';
import Popup from '../../../components/Popup';
import styled from 'styled-components';

const EditSubject = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const params = useParams();

    const { id } = params;

    const [subName, setSubName] = useState("");
    const [subCode, setSubCode] = useState("");
    const [sessions, setSessions] = useState("");

    const { status, response, error } = useSelector(state => state.user);
    const { subjectDetails } = useSelector((state) => state.sclass);

    const address = "Subject";

    const [showPopup, setShowPopup] = useState(false);
    const [message, setMessage] = useState("");
    const [loader, setLoader] = useState(false);

    useEffect(() => {
        dispatch(getSubjectDetails(id, "Subject"));
    }, [dispatch, id]);

    useEffect(() => {
        if (subjectDetails) {
            setSubName(subjectDetails.subName || "");
            setSubCode(subjectDetails.subCode || "");
            setSessions(subjectDetails.sessions || "");
        }
    }, [subjectDetails]);

    const submitHandler = (event) => {
        event.preventDefault();
        setLoader(true);
        const fields = { subName, subCode, sessions };
        dispatch(updateUser(fields, id, address));
    };

    useEffect(() => {
        if (status === 'added') {
            navigate("/Admin/subjects");
            dispatch(underControl());
            setLoader(false);
        } else if (status === 'error') {
            setMessage("Network Error");
            setShowPopup(true);
            setLoader(false);
        }
    }, [status, navigate, error, response, dispatch]);

    return (
        <Container maxWidth="md" sx={{ mt: 4, mb: 4 }}>
            <StyledPaper elevation={3}>
                <Typography variant="h4" sx={{ mb: 3, fontWeight: 'bold', color: 'var(--text-primary)' }}>
                    Edit Subject
                </Typography>
                <form onSubmit={submitHandler}>
                    <Grid container spacing={3}>
                        <Grid item xs={12}>
                            <TextField
                                fullWidth
                                label="Subject Name"
                                variant="outlined"
                                value={subName}
                                onChange={(e) => setSubName(e.target.value)}
                                required
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                fullWidth
                                label="Subject Code"
                                variant="outlined"
                                value={subCode}
                                onChange={(e) => setSubCode(e.target.value)}
                                required
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                fullWidth
                                label="Sessions"
                                variant="outlined"
                                type="number"
                                inputProps={{ min: 0 }}
                                value={sessions}
                                onChange={(e) => setSessions(e.target.value)}
                                required
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <Box display="flex" justifyContent="flex-end" gap={2} mt={2}>
                                <Button variant="outlined" onClick={() => navigate(-1)}>
                                    Cancel
                                </Button>
                                <SubmitButton variant="contained" type="submit" disabled={loader}>
                                    {loader ? (
                                        <CircularProgress size={24} color="inherit" />
                                    ) : (
                                        'Update Subject'
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
};

export default EditSubject;

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
