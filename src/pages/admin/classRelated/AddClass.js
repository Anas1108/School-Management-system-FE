import React, { useEffect, useState } from "react";
import { Button, CircularProgress, Stack, TextField, Container, Paper, Typography } from "@mui/material";
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { addStuff } from '../../../redux/userRelated/userHandle';
import { underControl } from '../../../redux/userRelated/userSlice';
import Popup from "../../../components/Popup";
import styled from "styled-components";

const AddClass = () => {
    const [sclassName, setSclassName] = useState("");

    const dispatch = useDispatch()
    const navigate = useNavigate()

    const userState = useSelector(state => state.user);
    const { status, currentUser, response, error, tempDetails } = userState;

    const adminID = currentUser._id
    const address = "Sclass"

    const [loader, setLoader] = useState(false)
    const [message, setMessage] = useState("");
    const [showPopup, setShowPopup] = useState(false);

    const fields = {
        sclassName,
        adminID,
    };

    const submitHandler = (event) => {
        event.preventDefault()
        setLoader(true)
        dispatch(addStuff(fields, address))
    };

    useEffect(() => {
        if (status === 'added' && tempDetails) {
            navigate("/Admin/classes/class/" + tempDetails._id)
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
    }, [status, navigate, error, response, dispatch, tempDetails]);

    return (
        <Container maxWidth="sm" sx={{ mt: 4, mb: 4 }}>
            <StyledPaper elevation={3}>
                <Typography variant="h4" sx={{ mb: 3, fontWeight: 'bold', color: 'var(--text-primary)', textAlign: 'center' }}>
                    Add New Class
                </Typography>
                <form onSubmit={submitHandler}>
                    <Stack spacing={3}>
                        <TextField
                            label="Class Name"
                            variant="outlined"
                            fullWidth
                            value={sclassName}
                            onChange={(event) => {
                                setSclassName(event.target.value);
                            }}
                            required
                        />
                        <SubmitButton
                            fullWidth
                            size="large"
                            variant="contained"
                            type="submit"
                            disabled={loader}
                        >
                            {loader ? <CircularProgress size={24} color="inherit" /> : "Create Class"}
                        </SubmitButton>
                        <Button variant="outlined" onClick={() => navigate(-1)}>
                            Go Back
                        </Button>
                    </Stack>
                </form>
            </StyledPaper>
            <Popup message={message} setShowPopup={setShowPopup} showPopup={showPopup} />
        </Container>
    )
}

export default AddClass

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
        padding: 12px;
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