/* eslint-disable no-unused-vars */
import React, { useState } from 'react';
import { 
    Container, 
    Grid, 
    TextField, 
    Button, 
    Typography, 
    Box,
    MenuItem,
    FormControl,
    InputLabel,
    Select,
    Snackbar,
    Alert
} from '@mui/material';
import ContactService from '../../services/contactService';
import PhoneInput from 'react-phone-input-2';
import 'react-phone-input-2/lib/style.css';

const Contact = () => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        serviceType: '',
        message: ''
    });

    const [submitStatus, setSubmitStatus] = useState({
        open: false,
        success: false,
        message: ''
    });

    const [errors, setErrors] = useState({});

    const validateForm = () => {
        const newErrors = {};
        
        if (!formData.name.trim()) {
            newErrors.name = 'Name is required';
        }
        
        if (!formData.email.trim()) {
            newErrors.email = 'Email is required';
        } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
            newErrors.email = 'Email is invalid';
        }
        
        if (!formData.phone) {
            newErrors.phone = 'Phone number is required';
        }
        
        if (!formData.serviceType) {
            newErrors.serviceType = 'Service type is required';
        }
        
        if (!formData.message.trim()) {
            newErrors.message = 'Message is required';
        }
        
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
        
        // Clear specific error when user starts typing
        if (errors[name]) {
            setErrors(prev => ({
                ...prev,
                [name]: undefined
            }));
        }
    };

    const handlePhoneChange = (value) => {
        setFormData(prev => ({
            ...prev,
            phone: value
        }));
        
        if (errors.phone) {
            setErrors(prev => ({
                ...prev,
                phone: undefined
            }));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (!validateForm()) {
            return;
        }
        
        try {
            const response = await ContactService.submitContactForm(formData);
            
            setSubmitStatus({
                open: true,
                success: true,
                message: 'Your message has been sent successfully!'
            });

            // Reset form
            setFormData({
                name: '',
                email: '',
                phone: '',
                serviceType: '',
                message: ''
            });
        } catch (error) {
            setSubmitStatus({
                open: true,
                success: false,
                message: error.message || 'Failed to send message. Please try again.'
            });
        }
    };

    const handleCloseSnackbar = (event, reason) => {
        if (reason === 'clickaway') {
            return;
        }
        setSubmitStatus(prev => ({ ...prev, open: false }));
    };

    const serviceTypes = [
        'Basic Wash',
        'Premium Detailing', 
        'Full Ceramic Coating', 
        'Interior Detailing', 
        'Exterior Detailing', 
        'Paint Correction'
    ];

    return (
        <Container maxWidth="md" sx={{ mt: 8 }}>
            <Box 
                sx={{ 
                    border: '1px solid #e0e0e0', 
                    borderRadius: 2, 
                    p: 4,
                    boxShadow: 3,
                    backgroundColor: 'background.paper'
                }}
            >
                <Typography 
                    variant="h4" 
                    gutterBottom 
                    align="center"
                    sx={{ 
                        color: 'primary.main',
                        fontWeight: 'bold',
                        mb: 4
                    }}
                >
                    Contact Precision Detailing
                </Typography>
                
                <form onSubmit={handleSubmit}>
                    <Grid container spacing={3}>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                fullWidth
                                label="Name"
                                name="name"
                                value={formData.name}
                                onChange={handleChange}
                                required
                                error={!!errors.name}
                                helperText={errors.name}
                                variant="outlined"
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                fullWidth
                                label="Email"
                                name="email"
                                type="email"
                                value={formData.email}
                                onChange={handleChange}
                                required
                                error={!!errors.email}
                                helperText={errors.email}
                                variant="outlined"
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <PhoneInput
                                country={'us'}
                                value={formData.phone}
                                onChange={handlePhoneChange}
                                inputProps={{
                                    name: 'phone',
                                    required: true,
                                }}
                                specialLabel="Phone Number"
                                containerStyle={{ width: '100%' }}
                                inputStyle={{ 
                                    width: '100%', 
                                    height: '56px',
                                    borderColor: errors.phone ? 'red' : undefined
                                }}
                            />
                            {errors.phone && (
                                <Typography 
                                    variant="caption" 
                                    color="error"
                                    sx={{ ml: 2 }}
                                >
                                    {errors.phone}
                                </Typography>
                            )}
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <FormControl 
                                fullWidth 
                                variant="outlined" 
                                error={!!errors.serviceType}
                            >
                                <InputLabel>Service Type</InputLabel>
                                <Select
                                    name="serviceType"
                                    value={formData.serviceType}
                                    onChange={handleChange}
                                    label="Service Type"
                                    required
                                >
                                    {serviceTypes.map((service) => (
                                        <MenuItem key={service} value={service}>
                                            {service}
                                        </MenuItem>
                                    ))}
                                </Select>
                                {errors.serviceType && (
                                    <Typography 
                                        variant="caption" 
                                        color="error"
                                        sx={{ ml: 2 }}
                                    >
                                        {errors.serviceType}
                                    </Typography>
                                )}
                            </FormControl>
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                fullWidth
                                label="Your Message"
                                name="message"
                                multiline
                                rows={4}
                                value={formData.message}
                                onChange={handleChange}
                                required
                                error={!!errors.message}
                                helperText={errors.message}
                                variant="outlined"
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <Button
                                type="submit"
                                variant="contained"
                                color="primary"
                                fullWidth
                                size="large"
                                sx={{ 
                                    mt: 2,
                                    py: 1.5,
                                    fontWeight: 'bold',
                                    '&:hover': {
                                        backgroundColor: 'primary.dark'
                                    }
                                }}
                            >
                                Send Message
                            </Button>
                        </Grid>
                    </Grid>
                </form>
            </Box>

            <Snackbar
                open={submitStatus.open}
                autoHideDuration={6000}
                onClose={handleCloseSnackbar}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
            >
                <Alert 
                    onClose={handleCloseSnackbar}
                    severity={submitStatus.success ? 'success' : 'error'}
                    sx={{ width: '100%' }}
                >
                    {submitStatus.message}
                </Alert>
            </Snackbar>
        </Container>
    );
};

export default Contact;
