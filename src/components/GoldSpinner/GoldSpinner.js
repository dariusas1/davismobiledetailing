import React from 'react';
import { Box, CircularProgress } from '@mui/material';
import { styled } from '@mui/material/styles';

const GoldSpinnerWrapper = styled(Box)(({ theme }) => ({
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  height: '100%',
  width: '100%',
  position: 'fixed',
  top: 0,
  left: 0,
  backgroundColor: 'rgba(0, 0, 0, 0.7)',
  zIndex: 9999
}));

const StyledCircularProgress = styled(CircularProgress)(({ theme }) => ({
  color: theme.palette.primary.main, // Gold color
  '& .MuiCircularProgress-circle': {
    strokeLinecap: 'round',
    animation: 'gold-spinner-animation 1.4s ease-in-out infinite',
  },
  '@keyframes gold-spinner-animation': {
    '0%': {
      strokeDasharray: '1px, 200px',
      strokeDashoffset: '0px',
    },
    '50%': {
      strokeDasharray: '100px, 200px',
      strokeDashoffset: '-15px',
    },
    '100%': {
      strokeDasharray: '100px, 200px',
      strokeDashoffset: '-125px',
    }
  }
}));

const GoldSpinner = ({ fullScreen = true, size = 60 }) => {
  return (
    <GoldSpinnerWrapper>
      <StyledCircularProgress 
        size={size} 
        thickness={4} 
        variant="indeterminate"
      />
    </GoldSpinnerWrapper>
  );
};

export default GoldSpinner;
