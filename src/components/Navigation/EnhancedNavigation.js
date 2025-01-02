/* eslint-disable no-unused-vars */
import React, { useState } from 'react';
import { 
  AppBar, 
  Toolbar, 
  Typography, 
  Button, 
  Box, 
  IconButton 
} from '@mui/material';
import { styled } from '@mui/material/styles';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

const NavigationWrapper = styled(AppBar)(({ theme }) => ({
  backgroundColor: theme.palette.background.default,
  boxShadow: `0 2px 4px rgba(255, 215, 0, 0.1)`,
  transition: 'all 0.3s ease'
}));

const NavigationButton = styled(Button)(({ theme }) => ({
  color: theme.palette.primary.main,
  margin: theme.spacing(0, 1),
  transition: 'all 0.3s ease',
  '&:hover': {
    backgroundColor: 'rgba(255, 215, 0, 0.1)',
    transform: 'scale(1.05)',
    color: theme.palette.primary.light
  }
}));

const LogoTypography = styled(Typography)(({ theme }) => ({
  flexGrow: 1,
  fontWeight: 700,
  color: theme.palette.primary.main,
  transition: 'all 0.3s ease',
  '&:hover': {
    transform: 'scale(1.05)',
    color: theme.palette.primary.light
  }
}));

const MotionBox = motion(Box);

const EnhancedNavigation = () => {
  const [hoveredItem, setHoveredItem] = useState(null);

  const navigationItems = [
    { label: 'Home', path: '/' },
    { label: 'Services', path: '/services' },
    { label: 'Booking', path: '/booking' },
    { label: 'Contact', path: '/contact' }
  ];

  return (
    <NavigationWrapper position="static">
      <Toolbar>
        <LogoTypography variant="h6">
          Precision Detailing
        </LogoTypography>
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          {navigationItems.map((item, index) => (
            <MotionBox
              key={item.path}
              initial={{ opacity: 0.7, scale: 1 }}
              whileHover={{ 
                opacity: 1, 
                scale: 1.05,
                transition: { duration: 0.2 }
              }}
            >
              <NavigationButton
                component={Link}
                to={item.path}
                onMouseEnter={() => setHoveredItem(index)}
                onMouseLeave={() => setHoveredItem(null)}
              >
                {item.label}
                {hoveredItem === index && (
                  <motion.div
                    style={{
                      position: 'absolute',
                      bottom: 0,
                      left: 0,
                      right: 0,
                      height: '3px',
                      backgroundColor: '#FFD700'
                    }}
                    initial={{ width: 0 }}
                    animate={{ width: '100%' }}
                    transition={{ duration: 0.3 }}
                  />
                )}
              </NavigationButton>
            </MotionBox>
          ))}
        </Box>
      </Toolbar>
    </NavigationWrapper>
  );
};

export default EnhancedNavigation;
