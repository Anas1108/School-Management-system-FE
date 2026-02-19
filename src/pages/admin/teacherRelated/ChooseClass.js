import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Box, Button, Typography, Tooltip } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { getAllSclasses } from '../../../redux/sclassRelated/sclassHandle';
import { ActionIconButtonPrimary } from '../../../components/buttonStyles';
import TableTemplate from '../../../components/TableTemplate';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import CustomLoader from '../../../components/CustomLoader';

const ChooseClass = ({ situation }) => {
    const navigate = useNavigate()
    const dispatch = useDispatch();

    const { sclassesList, loading, error, getresponse } = useSelector((state) => state.sclass);
    const { currentUser } = useSelector(state => state.user)

    useEffect(() => {
        dispatch(getAllSclasses(currentUser._id, "Sclass"));
    }, [currentUser._id, dispatch]);

    if (error) {
        console.log(error)
    }

    const navigateHandler = (classID) => {
        if (situation === "Teacher") {
            navigate("/Admin/teachers/choosesubject/" + classID)
        }
        else if (situation === "Subject") {
            navigate("/Admin/addsubject/" + classID)
        }
    }

    const sclassColumns = [
        { id: 'name', label: 'Class Name', minWidth: 170 },
    ]

    const sclassRows = sclassesList && sclassesList.length > 0 && sclassesList.map((sclass) => {
        return {
            name: sclass.sclassName,
            id: sclass._id,
        };
    })

    const SclassButtonHaver = ({ row }) => {
        return (
            <>
                <Tooltip title="Choose" arrow>
                    <ActionIconButtonPrimary
                        onClick={() => navigateHandler(row.id)}>
                        <ArrowForwardIcon />
                    </ActionIconButtonPrimary>
                </Tooltip>
            </>
        );
    };

    return (
        <Box sx={{ mt: 2, mb: 2 }}>
            <Typography variant="h6" gutterBottom component="div">
                Choose a class
            </Typography>
            {loading ?
                <CustomLoader />
                :
                <>
                    {getresponse ?
                        <Box sx={{ display: 'flex', justifyContent: 'flex-end', marginTop: '16px' }}>
                            <Button variant="contained" onClick={() => navigate("/Admin/addclass")}>
                                Add Class
                            </Button>
                        </Box>
                        :
                        <>
                            {Array.isArray(sclassesList) && sclassesList.length > 0 &&
                                <TableTemplate buttonHaver={SclassButtonHaver} columns={sclassColumns} rows={sclassRows} />
                            }
                        </>}
                </>
            }
        </Box>
    )
}

export default ChooseClass