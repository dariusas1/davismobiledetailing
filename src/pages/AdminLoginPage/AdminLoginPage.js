import React, { useState, useContext } from 'react';
import { 
    Container, 
    Typography, 
    TextField, 
    Button, 
    Paper, 
    Box 
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { AppContext } from '../../App';
import AuthService from '../../services/authService';
import { toast } from 'react-toastify';

const AdminLoginPage = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const { setUser } = useContext(AppContext);
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        try {
            const adminUser = await AuthService.loginAdmin(username, password);
            setUser(adminUser);
            navigate('/admin');
        } catch (error) {
            toast.error('Login failed. Please check your credentials.');
        }
    };

    return (
        <Container maxWidth="xs" sx={{ mt: 10 }}>
            <Paper elevation={6} sx={{ p: 4 }}>
                <Typography variant="h4" align="center" gutterBottom>
                    Admin Login
                </Typography>
                <form onSubmit={handleLogin}>
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                        <TextField 
                            label="Username" 
                            type="text"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            required
                            fullWidth
                        />
                        <TextField 
                            label="Password" 
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            fullWidth
                        />
                        <Button 
                            type="submit" 
                            variant="contained" 
                            color="primary"
                            fullWidth
                        >
                            Login
                        </Button>
                    </Box>
                </form>
            </Paper>
        </Container>
    );
};

export default AdminLoginPage;
