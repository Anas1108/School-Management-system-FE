import React, { useEffect, useState } from "react";
import { Button, TextField, Grid, Box, Typography, CircularProgress, Container, Paper } from "@mui/material";
import { useNavigate, useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { updateUser } from '../../../redux/userRelated/userHandle';
import { getNoticeDetails } from '../../../redux/noticeRelated/noticeHandle';
import { underControl } from '../../../redux/userRelated/userSlice';
import Popup from '../../../components/Popup';
import styled from 'styled-components';

const EditNotice = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const params = useParams();

    const { id } = params;

    const [title, setTitle] = useState("");
    const [details, setDetails] = useState("");
    const [date, setDate] = useState("");

    const { status, response, error } = useSelector(state => state.user);
    const { noticeDetails, loading: noticeLoading } = useSelector((state) => state.notice);

    const address = "Notice";

    const [showPopup, setShowPopup] = useState(false);
    const [message, setMessage] = useState("");
    const [loader, setLoader] = useState(false);

    useEffect(() => {
        dispatch(getNoticeDetails(id, "Notice"));
    }, [dispatch, id]);

    useEffect(() => {
        if (noticeDetails) {
            setTitle(noticeDetails.title || "");
            setDetails(noticeDetails.details || "");
            if (noticeDetails.date) {
                const itemDate = new Date(noticeDetails.date);
                if (itemDate.toString() !== "Invalid Date") {
                    setDate(itemDate.toISOString().substring(0, 10));
                }
            }
        }
    }, [noticeDetails]);

    const submitHandler = (event) => {
        event.preventDefault();
        setLoader(true);
        const fields = { title, details, date };
        dispatch(updateUser(fields, id, address));
    };

    useEffect(() => {
        if (status === 'added') {
            navigate("/Admin/notices");
            dispatch(underControl());
            setLoader(false);
        } else if (status === 'error') {
            setMessage("Network Error");
            setShowPopup(true);
            setLoader(false);
        }
    }, [status, navigate, error, response, dispatch]);

    if (noticeLoading) {
        return (
            <Box display="flex" justifyContent="center" alignItems="center" height="50vh">
                <CircularProgress />
            </Box>
        );
    }

    return (
        <Container maxWidth="md" sx={{ mt: 4, mb: 4 }}>
            <StyledPaper elevation={3}>
                <Typography variant="h4" sx={{ mb: 3, fontWeight: 'bold', color: 'var(--text-primary)' }}>
                    Edit Notice
                </Typography>
                <form onSubmit={submitHandler}>
                    <Grid container spacing={3}>
                        <Grid item xs={12}>
                            <TextField
                                fullWidth
                                label="Title"
                                variant="outlined"
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                                required
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                fullWidth
                                label="Details"
                                variant="outlined"
                                multiline
                                rows={4}
                                value={details}
                                onChange={(e) => setDetails(e.target.value)}
                                required
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                fullWidth
                                label="Date"
                                variant="outlined"
                                type="date"
                                InputLabelProps={{
                                    shrink: true,
                                }}
                                value={date}
                                onChange={(e) => setDate(e.target.value)}
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
                                        'Update Notice'
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

export default EditNotice;

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
