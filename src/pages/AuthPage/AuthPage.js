import React, { useState } from 'react';
import { 
    Container, 
    Grid, 
    Paper, 
    Tabs, 
    Tab, 
    Box 
} from '@mui/material';
import LoginForm from '../../components/Auth/LoginForm';
import RegisterForm from '../../components/Auth/RegisterForm';

const AuthPage = () => {
    const [activeTab, setActiveTab] = useState(0);

    const handleTabChange = (event, newValue) => {
        setActiveTab(newValue);
    };

    return (
        <Container maxWidth="xs" sx={{ mt: 8 }}>
            <Paper elevation={6} sx={{ p: 4 }}>
                <Tabs 
                    value={activeTab} 
                    onChange={handleTabChange} 
                    variant="fullWidth"
                    textColor="primary"
                    indicatorColor="primary"
                >
                    <Tab label="Login" />
                    <Tab label="Register" />
                </Tabs>

                <Box sx={{ mt: 3 }}>
                    {activeTab === 0 && <LoginForm />}
                    {activeTab === 1 && <RegisterForm />}
                </Box>
            </Paper>
        </Container>
    );
};

export default AuthPage;
