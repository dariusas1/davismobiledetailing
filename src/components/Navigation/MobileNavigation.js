import React, { useState } from 'react';
import { 
  Drawer, 
  List, 
  ListItem, 
  ListItemText, 
  IconButton, 
  Box, 
  Typography 
} from '@mui/material';
import { styled } from '@mui/material/styles';
import { Link } from 'react-router-dom';
import MenuIcon from '@mui/icons-material/Menu';
import CloseIcon from '@mui/icons-material/Close';
import { motion } from 'framer-motion';

const MobileNavigationWrapper = styled(Box)(({ theme }) => ({
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  padding: theme.spacing(2),
  backgroundColor: theme.palette.background.default,
  boxShadow: `0 2px 4px rgba(255, 215, 0, 0.1)`,
  position: 'fixed',
  top: 0,
  left: 0,
  right: 0,
  zIndex: 1000
}));

const LogoTypography = styled(Typography)(({ theme }) => ({
  color: theme.palette.primary.main,
  fontWeight: 700
}));

const MobileDrawer = styled(Drawer)(({ theme }) => ({
  '& .MuiDrawer-paper': {
    backgroundColor: theme.palette.background.default,
    width: '80%',
    maxWidth: 300
  }
}));

const NavigationListItem = styled(ListItem)(({ theme }) => ({
  color: theme.palette.primary.main,
  transition: 'all 0.3s ease',
  '&:hover': {
    backgroundColor: 'rgba(255, 215, 0, 0.1)',
    transform: 'scale(1.05)'
  }
}));

const MobileNavigation = () => {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  const navigationItems = [
    { label: 'Home', path: '/' },
    { label: 'Services', path: '/services' },
    { label: 'Booking', path: '/booking' },
    { label: 'Contact', path: '/contact' }
  ];

  const toggleDrawer = (open) => (event) => {
    if (event.type === 'keydown' && (event.key === 'Tab' || event.key === 'Shift')) {
      return;
    }
    setIsDrawerOpen(open);
  };

  return (
    <>
      <MobileNavigationWrapper>
        <LogoTypography variant="h6">
          Precision Detailing
        </LogoTypography>
        <IconButton 
          color="primary" 
          onClick={toggleDrawer(true)}
          aria-label="open navigation menu"
        >
          <MenuIcon />
        </IconButton>
      </MobileNavigationWrapper>

      <MobileDrawer
        anchor="right"
        open={isDrawerOpen}
        onClose={toggleDrawer(false)}
      >
        <Box
          sx={{ width: '100%', height: '100%', backgroundColor: 'background.default' }}
          role="presentation"
          onClick={toggleDrawer(false)}
          onKeyDown={toggleDrawer(false)}
        >
          <Box sx={{ 
            display: 'flex', 
            justifyContent: 'space-between', 
            alignItems: 'center', 
            padding: 2 
          }}>
            <LogoTypography variant="h6">
              Precision Detailing
            </LogoTypography>
            <IconButton 
              color="primary" 
              onClick={toggleDrawer(false)}
              aria-label="close navigation menu"
            >
              <CloseIcon />
            </IconButton>
          </Box>

          <List>
            {navigationItems.map((item, index) => (
              <motion.div
                key={item.path}
                initial={{ opacity: 0, x: -50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ 
                  delay: index * 0.1, 
                  type: "spring", 
                  stiffness: 100 
                }}
              >
                <NavigationListItem 
                  button 
                  component={Link} 
                  to={item.path}
                >
                  <ListItemText 
                    primary={item.label} 
                    primaryTypographyProps={{ 
                      color: 'primary',
                      variant: 'body1'
                    }} 
                  />
                </NavigationListItem>
              </motion.div>
            ))}
          </List>
        </Box>
      </MobileDrawer>
    </>
  );
};

export default MobileNavigation;
