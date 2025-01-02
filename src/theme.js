import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    mode: 'dark',
    background: {
      default: '#000000',
      paper: '#121212'
    },
    primary: {
      main: '#FFD700', // Gold color
    },
    secondary: {
      main: '#FFFFFF', // White
    },
  },
  typography: {
    fontFamily: 'Roboto, Arial, sans-serif',
    color: '#FFFFFF'
  },
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        body: {
          backgroundColor: '#000000',
          color: '#FFFFFF'
        }
      }
    }
  }
});

export default theme;
