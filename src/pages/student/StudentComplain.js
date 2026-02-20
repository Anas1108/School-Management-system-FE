import { useEffect, useState } from 'react';
import { Box, CircularProgress, Stack, TextField, Typography, Container, Paper } from '@mui/material';
import Popup from '../../components/Popup';
import { addStuff } from '../../redux/userRelated/userHandle';
import { getComplainsByUser } from '../../redux/complainRelated/complainHandle';
import { useDispatch, useSelector } from 'react-redux';
import styled from 'styled-components';

const StudentComplain = () => {
    const [complaint, setComplaint] = useState("");
    const [date, setDate] = useState("");

    const dispatch = useDispatch()

    const { status, currentUser, error } = useSelector(state => state.user);

    const user = currentUser._id
    const school = currentUser.school._id
    const address = "Complain"

    const [loader, setLoader] = useState(false)
    const [message, setMessage] = useState("");
    const [showPopup, setShowPopup] = useState(false);

    const fields = {
        user,
        date,
        complaint,
        school,
        model_type: 'student'
    };

    const submitHandler = (event) => {
        event.preventDefault()
        setLoader(true)
        dispatch(addStuff(fields, address))
    };

    useEffect(() => {
        if (status === "added") {
            setLoader(false)
            setShowPopup(true)
            setMessage("Done Successfully")
            dispatch(getComplainsByUser(user, "Complain")); // Refresh history
        }
        else if (error) {
            setLoader(false)
            setShowPopup(true)
            setMessage("Network Error")
        }
    }, [status, error, dispatch, user])

    // Fetch Complaints History
    const { complainsList } = useSelector((state) => state.complain);

    useEffect(() => {
        dispatch(getComplainsByUser(user, "Complain"));
    }, [dispatch, user]);

    return (
        <>
            <Container maxWidth={false} sx={{ mt: 4, mb: 4 }}>
                <Box sx={{ display: 'flex', gap: 4, flexDirection: { xs: 'column', md: 'row' } }}>
                    <Box sx={{ flex: 1 }}>
                        <FormCard elevation={3}>
                            <Typography variant="h4" sx={{ mb: 3, fontWeight: 'bold', color: 'var(--text-primary)', textAlign: 'center' }}>
                                Submit Complaint
                            </Typography>
                            <Typography variant="body1" sx={{ mb: 4, color: 'var(--text-secondary)', textAlign: 'center' }}>
                                We're here to help. Please describe your concern below.
                            </Typography>
                            <form onSubmit={submitHandler}>
                                <Stack spacing={3}>
                                    <TextField
                                        fullWidth
                                        label="Select Date"
                                        type="date"
                                        value={date}
                                        onChange={(event) => setDate(event.target.value)}
                                        required
                                        InputLabelProps={{
                                            shrink: true,
                                        }}
                                    />
                                    <TextField
                                        fullWidth
                                        label="Write your complaint"
                                        variant="outlined"
                                        value={complaint}
                                        onChange={(event) => {
                                            setComplaint(event.target.value);
                                        }}
                                        required
                                        multiline
                                        rows={6}
                                    />
                                    <SubmitButton
                                        fullWidth
                                        size="large"
                                        variant="contained"
                                        type="submit"
                                        disabled={loader}
                                    >
                                        {loader ? <CircularProgress size={24} color="inherit" /> : "Submit Complaint"}
                                    </SubmitButton>
                                </Stack>
                            </form>
                        </FormCard>
                    </Box>
                    <Box sx={{ flex: 1 }}>
                        <FormCard elevation={3}>
                            <Typography variant="h5" sx={{ mb: 3, fontWeight: 'bold', color: 'var(--text-primary)', textAlign: 'center' }}>
                                My Complaints History
                            </Typography>
                            {/* Simple List or Table */}
                            <Stack spacing={2} sx={{ maxHeight: '420px', overflowY: 'auto', pr: 1 }}>
                                {Array.isArray(complainsList) && complainsList.length > 0 ? complainsList.map((c, index) => (
                                    <Paper key={index} elevation={1} sx={{ p: 2, bgcolor: '#f9f9f9' }}>
                                        <Typography variant="subtitle2" color="textSecondary">
                                            {new Date(c.date).toLocaleDateString()} - <span style={{ color: c.status === "Done" ? "green" : "orange" }}>{c.status}</span>
                                        </Typography>
                                        <Typography variant="body1" sx={{ mt: 1 }}>
                                            {c.complaint}
                                        </Typography>
                                        {c.relatedAdminResponse && (
                                            <Box sx={{ mt: 2, p: 1, bgcolor: '#e3f2fd', borderRadius: 1 }}>
                                                <Typography variant="caption" color="primary">Admin Response:</Typography>
                                                <Typography variant="body2">{c.relatedAdminResponse}</Typography>
                                            </Box>
                                        )}
                                    </Paper>
                                )) : <Typography align="center">No previous complaints.</Typography>}
                            </Stack>
                        </FormCard>
                    </Box>
                </Box>
            </Container>
            <Popup message={message} setShowPopup={setShowPopup} showPopup={showPopup} />
        </>
    );
};

export default StudentComplain;

const FormCard = styled(Paper)`
    padding: 3rem;
    border-radius: var(--border-radius-xl);
    background: var(--bg-paper);
    border: 1px solid var(--border-color);
`;

const SubmitButton = styled.button`
    && {
        background: var(--gradient-primary);
        color: white;
        font-weight: bold;
        padding: 12px 24px;
        border-radius: var(--border-radius-md);
        text-transform: none;
        font-size: 1rem;
        box-shadow: var(--shadow-md);
        transition: all 0.3s ease;
        border: none;
        cursor: pointer;

        &:hover {
            box-shadow: var(--shadow-lg);
            transform: translateY(-2px);
            filter: brightness(1.1);
        }

        &:disabled {
            opacity: 0.6;
            cursor: not-allowed;
            transform: none;
        }
    }
`;