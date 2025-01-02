import React from 'react';
import { Container, Typography, Box, Grid } from '@mui/material';
import { styled } from '@mui/system';
import aboutImage from '../../assets/images/hero-background.mp4';

const AboutSection = styled(Box)(({ theme }) => ({
  padding: theme.spacing(8, 0),
  backgroundColor: theme.palette.background.paper,
}));

const AboutPage = () => {
  return (
    <AboutSection>
      <Container maxWidth="lg">
        <Grid container spacing={6} alignItems="center">
          <Grid item xs={12} md={6}>
            <img 
              src={aboutImage} 
              alt="About Precision Detailing" 
              style={{ 
                width: '100%', 
                borderRadius: '16px',
                boxShadow: '0 4px 20px rgba(0,0,0,0.1)'
              }} 
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <Typography 
              variant="h3" 
              gutterBottom 
              sx={{ 
                fontWeight: 'bold',
                color: 'primary.main'
              }}
            >
              About Precision Detailing
            </Typography>
            <Typography variant="body1" paragraph>
              At Precision Detailing, we are passionate about providing the highest quality 
              automotive detailing services. With years of experience and a commitment to 
              excellence, we transform vehicles to their showroom condition.
            </Typography>
            <Typography variant="body1" paragraph>
              Our team of skilled professionals uses state-of-the-art equipment and premium 
              products to ensure every detail is perfect. From basic washes to full ceramic 
              coatings, we offer a range of services tailored to your vehicle's needs.
            </Typography>
            <Typography variant="body1" paragraph>
              We pride ourselves on our attention to detail, customer service, and the 
              satisfaction of seeing our clients drive away with a smile. Your vehicle 
              deserves the best, and that's exactly what we deliver.
            </Typography>
          </Grid>
        </Grid>
      </Container>
    </AboutSection>
  );
};

export default AboutPage;
