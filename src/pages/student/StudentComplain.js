import { useEffect, useState } from 'react';
import { Box, CircularProgress, Stack, TextField, Typography, Container, Paper } from '@mui/material';
import Popup from '../../components/Popup';
import { addStuff } from '../../redux/userRelated/userHandle';
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
        }
        else if (error) {
            setLoader(false)
            setShowPopup(true)
            setMessage("Network Error")
        }
    }, [status, error])

    return (
        <>
            <Container maxWidth="sm" sx={{ mt: 4, mb: 4 }}>
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