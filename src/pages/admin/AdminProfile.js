import { useSelector } from 'react-redux';
import { Paper, Box, Typography, Avatar, Container, Grid } from '@mui/material';
import styled from 'styled-components';

const AdminProfile = () => {
    const { currentUser } = useSelector((state) => state.user);

    return (
        <Container maxWidth="md" sx={{ mt: 4, mb: 4 }}>
            <Paper elevation={3} sx={{
                p: 4,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                borderRadius: 'var(--border-radius-xl)',
                background: 'var(--bg-paper)',
                border: '1px solid var(--border-color)'
            }}>
                <Avatar
                    sx={{
                        width: 120,
                        height: 120,
                        mb: 3,
                        bgcolor: 'var(--color-primary-600)',
                        fontSize: '3rem'
                    }}
                >
                    {currentUser.name ? currentUser.name[0].toUpperCase() : 'A'}
                </Avatar>

                <Typography variant="h4" component="h1" gutterBottom sx={{ fontWeight: 'bold', color: 'var(--text-primary)' }}>
                    {currentUser.name}
                </Typography>

                <Typography variant="h6" color="textSecondary" gutterBottom sx={{ mb: 4 }}>
                    Admin
                </Typography>

                <Grid container spacing={3} justifyContent="center" sx={{ maxWidth: '600px' }}>
                    <Grid item xs={12} sm={6}>
                        <InfoItem>
                            <Label>Email</Label>
                            <Value>{currentUser.email}</Value>
                        </InfoItem>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <InfoItem>
                            <Label>School Name</Label>
                            <Value>{currentUser.schoolName}</Value>
                        </InfoItem>
                    </Grid>
                </Grid>
            </Paper>
        </Container>
    )
}

export default AdminProfile;

const InfoItem = styled(Box)`
    background-color: var(--bg-body);
    padding: 1.5rem;
    border-radius: var(--border-radius-lg);
    border: 1px solid var(--border-color);
    height: 100%;
    transition: transform 0.2s;
    
    &:hover {
        transform: translateY(-2px);
    }
`;

const Label = styled(Typography)`
    && {
        color: var(--text-tertiary);
        font-size: 0.875rem;
        margin-bottom: 0.5rem;
        text-transform: uppercase;
        letter-spacing: 1px;
        font-weight: 600;
    }
`;

const Value = styled(Typography)`
    && {
        color: var(--text-primary);
        font-size: 1.1rem;
        font-weight: 500;
    }
`;
