import React, { useState } from 'react';
import {
    Box,
    Grid,
    Paper,
    Tabs,
    Tab,
    Typography,
    useTheme
} from '@mui/material';
import {
    Dashboard as DashboardIcon,
    People as PeopleIcon,
    Assignment as AssignmentIcon,
    Assessment as AssessmentIcon,
    Settings as SettingsIcon,
    List as ListIcon
} from '@mui/icons-material';
import LoggingDashboard from '../LoggingDashboard/LoggingDashboard';

const TabPanel = ({ children, value, index, ...other }) => (
    <div
        role="tabpanel"
        hidden={value !== index}
        id={`dashboard-tabpanel-${index}`}
        aria-labelledby={`dashboard-tab-${index}`}
        {...other}
    >
        {value === index && <Box p={3}>{children}</Box>}
    </div>
);

const Dashboard = () => {
    const theme = useTheme();
    const [activeTab, setActiveTab] = useState(0);

    const handleTabChange = (event, newValue) => {
        setActiveTab(newValue);
    };

    return (
        <Box>
            <Paper sx={{ width: '100%' }}>
                <Tabs
                    value={activeTab}
                    onChange={handleTabChange}
                    variant="scrollable"
                    scrollButtons="auto"
                    aria-label="dashboard tabs"
                >
                    <Tab
                        icon={<DashboardIcon />}
                        label="Overview"
                        iconPosition="start"
                    />
                    <Tab
                        icon={<PeopleIcon />}
                        label="Customers"
                        iconPosition="start"
                    />
                    <Tab
                        icon={<AssignmentIcon />}
                        label="Bookings"
                        iconPosition="start"
                    />
                    <Tab
                        icon={<AssessmentIcon />}
                        label="Analytics"
                        iconPosition="start"
                    />
                    <Tab
                        icon={<ListIcon />}
                        label="Logs"
                        iconPosition="start"
                    />
                    <Tab
                        icon={<SettingsIcon />}
                        label="Settings"
                        iconPosition="start"
                    />
                </Tabs>
            </Paper>

            <TabPanel value={activeTab} index={0}>
                <Typography variant="h4" gutterBottom>
                    Dashboard Overview
                </Typography>
                {/* Add overview content */}
            </TabPanel>

            <TabPanel value={activeTab} index={1}>
                <Typography variant="h4" gutterBottom>
                    Customer Management
                </Typography>
                {/* Add customer management content */}
            </TabPanel>

            <TabPanel value={activeTab} index={2}>
                <Typography variant="h4" gutterBottom>
                    Booking Management
                </Typography>
                {/* Add booking management content */}
            </TabPanel>

            <TabPanel value={activeTab} index={3}>
                <Typography variant="h4" gutterBottom>
                    Analytics
                </Typography>
                {/* Add analytics content */}
            </TabPanel>

            <TabPanel value={activeTab} index={4}>
                <LoggingDashboard />
            </TabPanel>

            <TabPanel value={activeTab} index={5}>
                <Typography variant="h4" gutterBottom>
                    Settings
                </Typography>
                {/* Add settings content */}
            </TabPanel>
        </Box>
    );
};

export default Dashboard; 