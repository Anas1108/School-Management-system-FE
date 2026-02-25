import React, { useEffect, useState } from 'react';
import { useNavigate } from "react-router-dom";
import { useSelector } from 'react-redux';
import axios from 'axios';
import { Box, Typography, Container, Tooltip, TextField, InputAdornment, IconButton } from '@mui/material';
import { ActionIconButtonPrimary } from '../../../components/buttonStyles';
import TableTemplate from '../../../components/TableTemplate';
import SearchIcon from '@mui/icons-material/Search';
import VisibilityOutlinedIcon from '@mui/icons-material/VisibilityOutlined';
import AddIcon from '@mui/icons-material/Add';
import CustomLoader from '../../../components/CustomLoader';

const ShowFamilies = () => {
    const navigate = useNavigate();
    const { currentUser } = useSelector(state => state.user);
    const [families, setFamilies] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchFamilies = async () => {
            try {
                const response = await axios.get(`${process.env.REACT_APP_BASE_URL}/Families/${currentUser._id}`);
                setFamilies(response.data);
                setLoading(false);
            } catch (err) {
                console.error(err);
                setLoading(false);
            }
        };
        if (currentUser) {
            fetchFamilies();
        }
    }, [currentUser]);

    const familyColumns = [
        { id: 'familyName', label: 'Family Name', minWidth: 170 },
        { id: 'fatherName', label: 'Father Name', minWidth: 170 },
        { id: 'fatherPhone', label: 'Father Phone', minWidth: 100 },
        { id: 'studentsCount', label: 'Students', minWidth: 100 },
    ];

    const filteredFamilies = families.filter(family =>
        family.familyName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        family.fatherName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        family.fatherPhone?.includes(searchTerm)
    );

    const familyRows = filteredFamilies.map((family) => {
        return {
            familyName: family.familyName,
            fatherName: family.fatherName,
            fatherPhone: family.fatherPhone,
            studentsCount: family.students ? family.students.length : 0,
            id: family._id,
        };
    });

    const FamilyButtonHaver = ({ row }) => {
        return (
            <Tooltip title="View" arrow>
                <ActionIconButtonPrimary onClick={() => navigate("/Admin/families/family/" + row.id)}>
                    <VisibilityOutlinedIcon />
                </ActionIconButtonPrimary>
            </Tooltip>
        );
    };

    return (
        <Container maxWidth={false} sx={{ mt: 0, mb: 2 }}>
            <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, justifyContent: 'space-between', alignItems: { xs: 'stretch', md: 'center' }, mb: 1, gap: 2 }}>
                <Typography variant="h4" component="h1" sx={{ fontWeight: 'bold', color: 'var(--text-primary)' }}>
                    Families
                </Typography>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    <TextField
                        placeholder="Search families..."
                        variant="outlined"
                        size="small"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        InputProps={{
                            endAdornment: (
                                <InputAdornment position="end">
                                    <IconButton>
                                        <SearchIcon />
                                    </IconButton>
                                </InputAdornment>
                            ),
                            style: {
                                borderRadius: 'var(--border-radius-md)',
                                backgroundColor: 'var(--bg-paper)',
                            }
                        }}
                        sx={{ width: '260px' }}
                    />
                    <Tooltip title="Add Family">
                        <IconButton
                            onClick={() => navigate('/Admin/addfamily')}
                            sx={{
                                bgcolor: 'var(--color-primary-600)', color: 'white',
                                '&:hover': { bgcolor: 'var(--color-primary-700)' },
                                borderRadius: 'var(--border-radius-md)'
                            }}
                        >
                            <AddIcon />
                        </IconButton>
                    </Tooltip>
                </Box>
            </Box>
            {loading ? <CustomLoader /> :
                <>
                    {families.length > 0 ?
                        <TableTemplate buttonHaver={FamilyButtonHaver} columns={familyColumns} rows={familyRows} />
                        :
                        <Typography variant="h6" sx={{ mt: 2, textAlign: 'center' }}>No Families Found</Typography>
                    }
                </>
            }
        </Container>
    );
};

export default ShowFamilies;
