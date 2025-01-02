/* eslint-disable no-unused-vars */
import React, { useState, useContext } from 'react';
import { 
    Container, 
    Typography, 
    Grid, 
    Paper, 
    Tabs, 
    Tab, 
    Box 
} from '@mui/material';
import { AppContext } from '../../App';
import ProjectManagement from '../../components/AdminComponents/ProjectManagement';
import BookingManagement from '../../components/AdminComponents/BookingManagement';
import UserManagement from '../../components/AdminComponents/UserManagement';
import PackageManagement from '../../components/AdminComponents/PackageManagement';

function TabPanel(props) {
    const { children, value, index, ...other } = props;

    return (
        <div
            role="tabpanel"
            hidden={value !== index}
            id={`admin-tabpanel-${index}`}
            aria-labelledby={`admin-tab-${index}`}
            {...other}
        >
            {value === index && (
                <Box sx={{ p: 3 }}>
                    {children}
                </Box>
            )}
        </div>
    );
}

const AdminDashboard = () => {
    const { user } = useContext(AppContext);
    const [tabValue, setTabValue] = useState(0);

    const handleTabChange = (event, newValue) => {
        setTabValue(newValue);
    };

    // Redirect if not admin
    if (!user || user.role !== 'admin') {
        return (
            <Container maxWidth="md" sx={{ mt: 10, textAlign: 'center' }}>
                <Typography variant="h4" color="error">
                    Access Denied
                </Typography>
                <Typography variant="body1">
                    You do not have permission to access this page.
                </Typography>
            </Container>
        );
    }

    return (
        <Container maxWidth="xl" sx={{ mt: 4 }}>
            <Typography variant="h4" gutterBottom>
                Admin Dashboard - Precision Detailing
            </Typography>
            
            <Paper elevation={3} sx={{ mb: 3 }}>
                <Tabs 
                    value={tabValue} 
                    onChange={handleTabChange} 
                    variant="fullWidth"
                    indicatorColor="primary"
                    textColor="primary"
                >
                    <Tab label="Projects" />
                    <Tab label="Bookings" />
                    <Tab label="Users" />
                    <Tab label="Packages" />
                </Tabs>
            </Paper>

            <TabPanel value={tabValue} index={0}>
                <ProjectManagement />
            </TabPanel>
            <TabPanel value={tabValue} index={1}>
                <BookingManagement />
            </TabPanel>
            <TabPanel value={tabValue} index={2}>
                <UserManagement />
            </TabPanel>
            <TabPanel value={tabValue} index={3}>
                <PackageManagement />
            </TabPanel>
        </Container>
    );
};

export default AdminDashboard;
