import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom.js';
import { ThemeProvider } from '@mui/material/styles.js';
import CssBaseline from '@mui/material/CssBaseline.js';
import theme from './theme.js';
import HomePage from './pages/Home/Home.js';
import AboutPage from './pages/AboutPage/AboutPage.js';
import ServicesPage from './pages/ServicesPage/ServicesPage.js';
import ContactPage from './pages/ContactPage/ContactPage.js';
import BookingPage from './pages/BookingPage/BookingPage.js';
import DashboardPage from './pages/DashboardPage/DashboardPage.js';
import AdminDashboard from './pages/AdminDashboard/AdminDashboard.js';
import AdminLoginPage from './pages/AdminLoginPage/AdminLoginPage.js';
import AuthPage from './pages/AuthPage/AuthPage.js';
import PasswordChangePage from './pages/PasswordChangePage/PasswordChangePage.js';
import NotFoundPage from './pages/NotFoundPage/NotFoundPage.js';
import Navbar from './components/Navbar/Navbar.js';
import Footer from './components/Footer/Footer.js';
import { AuthProvider } from './contexts/AuthContext.js';
import PrivateRoute from './components/PrivateRoute/PrivateRoute.js';
import { ConfigProvider } from './contexts/ConfigContext.js';
import { DashboardProvider } from './contexts/DashboardContext.js';

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <ConfigProvider>
        <AuthProvider>
          <DashboardProvider>
            <Router>
              <Navbar />
              <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/about" element={<AboutPage />} />
                <Route path="/services" element={<ServicesPage />} />
                <Route path="/contact" element={<ContactPage />} />
                <Route path="/booking" element={<BookingPage />} />
                <Route
                  path="/dashboard"
                  element={
                    <PrivateRoute>
                      <DashboardPage />
                    </PrivateRoute>
                  }
                />
                <Route
                  path="/admin"
                  element={
                    <PrivateRoute adminOnly>
                      <AdminDashboard />
                    </PrivateRoute>
                  }
                />
                <Route path="/admin-login" element={<AdminLoginPage />} />
                <Route path="/auth" element={<AuthPage />} />
                <Route path="/password-change" element={<PasswordChangePage />} />
                <Route path="*" element={<NotFoundPage />} />
              </Routes>
              <Footer />
            </Router>
          </DashboardProvider>
        </AuthProvider>
      </ConfigProvider>
    </ThemeProvider>
  );
}

export default App;
