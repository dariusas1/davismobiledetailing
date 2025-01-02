import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useNavigate } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { CircularProgress } from '@mui/material';

// Import AuthProvider and useAuth
import { AuthProvider, useAuth } from './contexts/AuthContext';

// Import components
import Navbar from './components/Navbar/Navbar';
import LoginForm from './components/auth/LoginForm';
import RegisterForm from './components/auth/RegisterForm';
import Home from './components/Home';
import Dashboard from './components/dashboard/UserDashboard';
import ServicesPage from './pages/ServicesPage/ServicesPage';
import About from './sections/About/About';
import Contact from './sections/Contact/Contact';

// Create custom theme
const theme = createTheme({
    palette: {
        primary: {
            main: '#000000', // Black
        },
        secondary: {
            main: '#FFD700', // Gold
        },
        background: {
            default: '#FFFFFF', // White
        }
    },
    typography: {
        fontFamily: 'Roboto, Arial, sans-serif',
    }
});

// Protected Route Component
const ProtectedRoute = ({ children }) => {
    const { isAuthenticated, loading } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        if (!loading && !isAuthenticated) {
            navigate('/auth/loginform');
        }
    }, [isAuthenticated, loading, navigate]);

    if (loading) {
        return <CircularProgress />;
    }

    return isAuthenticated ? children : null;
};

const App = () => {
    return (
        <ThemeProvider theme={theme}>
            <CssBaseline />
            <AuthProvider>
                <Router>
                    <Navbar />
                    <Routes>
                        <Route path="/" element={<Home />} />
                        <Route path="/auth/loginform" element={<LoginForm />} />
                        <Route path="/auth/registerform" element={<RegisterForm />} />
                        <Route path="/our-services" element={<ServicesPage />} />
                        <Route path="/book-now" element={<ServicesPage />} />
                        <Route path="/about" element={<About />} />
                        <Route path="/contact" element={<Contact />} />
                        <Route 
                            path="/dashboard" 
                            element={
                                <ProtectedRoute>
                                    <Dashboard />
                                </ProtectedRoute>
                            } 
                        />
                        {/* Add more routes as needed */}
                    </Routes>
                </Router>
            </AuthProvider>
        </ThemeProvider>
    );
};

export default App;
