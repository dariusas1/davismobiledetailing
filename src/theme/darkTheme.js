import { createTheme } from '@mui/material/styles';

// Precision Detailing Color Palette
const COLORS = {
  BLACK: '#000000',
  GOLD: '#FFD700',
  DARK_GOLD: '#DAA520',
  DARKER_GOLD: '#B8860B',
  DARK_GRAY: '#121212',
  LIGHT_GRAY: '#1E1E1E',
  GRAY: '#333333',
  WHITE: '#FFFFFF',
  SOFT_WHITE: '#E0E0E0'
};

const darkTheme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: COLORS.GOLD,
      light: COLORS.DARK_GOLD,
      dark: COLORS.DARKER_GOLD,
      contrastText: COLORS.BLACK
    },
    secondary: {
      main: COLORS.DARK_GOLD,
      light: COLORS.GOLD,
      dark: COLORS.BLACK,
      contrastText: COLORS.WHITE
    },
    background: {
      default: COLORS.BLACK,
      paper: COLORS.DARK_GRAY
    },
    text: {
      primary: COLORS.SOFT_WHITE,
      secondary: COLORS.GOLD,
      disabled: COLORS.LIGHT_GRAY
    },
    action: {
      active: COLORS.GOLD,
      hover: 'rgba(255, 215, 0, 0.1)',
      selected: 'rgba(255, 215, 0, 0.2)',
      disabled: COLORS.LIGHT_GRAY,
      disabledBackground: COLORS.DARK_GRAY
    },
    divider: COLORS.DARK_GOLD
  },
  typography: {
    fontFamily: ['Roboto', 'Helvetica', 'Arial', 'sans-serif'].join(','),
    h1: {
      color: COLORS.GOLD,
      fontWeight: 700,
      transition: 'color 0.3s ease'
    },
    h2: {
      color: COLORS.GOLD,
      fontWeight: 600,
      transition: 'color 0.3s ease'
    },
    h3: {
      color: COLORS.SOFT_WHITE,
      transition: 'color 0.3s ease'
    },
    body1: {
      color: COLORS.SOFT_WHITE
    },
    body2: {
      color: COLORS.SOFT_WHITE
    }
  },
  components: {
    MuiCssBaseline: {
      styleOverrides: `
        body {
          background-color: ${COLORS.BLACK};
          color: ${COLORS.SOFT_WHITE};
          scrollbar-width: thin;
          scrollbar-color: ${COLORS.GOLD} ${COLORS.BLACK};
        }
        
        *::-webkit-scrollbar {
          width: 8px;
        }
        
        *::-webkit-scrollbar-track {
          background: ${COLORS.BLACK};
        }
        
        *::-webkit-scrollbar-thumb {
          background-color: ${COLORS.GOLD};
          border-radius: 20px;
          border: 2px solid ${COLORS.BLACK};
        }
        
        *::-webkit-scrollbar-thumb:hover {
          background-color: ${COLORS.DARK_GOLD};
        }
      `
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          backgroundColor: COLORS.BLACK,
          boxShadow: `0 2px 4px rgba(255, 215, 0, 0.1)`,
          transition: 'all 0.3s ease'
        }
      }
    },
    MuiButton: {
      styleOverrides: {
        root: {
          transition: 'all 0.3s ease',
          textTransform: 'none',
          borderRadius: 8,
          '&:hover': {
            backgroundColor: COLORS.DARK_GOLD,
            transform: 'scale(1.03)',
            boxShadow: `0 0 10px ${COLORS.GOLD}`
          }
        },
        containedPrimary: {
          backgroundColor: COLORS.GOLD,
          color: COLORS.BLACK,
          '&:hover': {
            backgroundColor: COLORS.DARK_GOLD
          }
        },
        outlinedPrimary: {
          borderColor: COLORS.GOLD,
          color: COLORS.GOLD,
          '&:hover': {
            backgroundColor: 'rgba(255, 215, 0, 0.1)',
            borderColor: COLORS.DARK_GOLD
          }
        }
      }
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          '& label': {
            color: COLORS.SOFT_WHITE,
            transition: 'color 0.3s ease'
          },
          '& label.Mui-focused': {
            color: COLORS.GOLD
          },
          '& .MuiInput-underline:after': {
            borderBottomColor: COLORS.GOLD
          },
          '& .MuiOutlinedInput-root': {
            '& fieldset': {
              borderColor: COLORS.LIGHT_GRAY,
              transition: 'border-color 0.3s ease'
            },
            '&:hover fieldset': {
              borderColor: COLORS.GOLD
            },
            '&.Mui-focused fieldset': {
              borderColor: COLORS.GOLD
            }
          }
        }
      }
    },
    MuiCard: {
      styleOverrides: {
        root: {
          backgroundColor: COLORS.DARK_GRAY,
          transition: 'transform 0.3s ease, box-shadow 0.3s ease',
          '&:hover': {
            transform: 'scale(1.02)',
            boxShadow: `0 8px 16px rgba(255, 215, 0, 0.2)`
          }
        }
      }
    },
    MuiCircularProgress: {
      styleOverrides: {
        root: {
          color: COLORS.GOLD
        }
      }
    }
  },
  transitions: {
    duration: {
      shortest: 150,
      shorter: 200,
      short: 250,
      standard: 300,
      complex: 375,
      enteringScreen: 225,
      leavingScreen: 195
    },
    easing: {
      sharp: 'cubic-bezier(0.4, 0, 0.6, 1)',
      standard: 'cubic-bezier(0.4, 0, 0.2, 1)',
      smooth: 'cubic-bezier(0.25, 0.1, 0.25, 1)'
    }
  }
});

export default darkTheme;
