import { createTheme } from '@mui/material/styles';

export const responsiveTheme = createTheme({
    breakpoints: {
        values: {
            xs: 0,
            sm: 600,
            md: 960,
            lg: 1280,
            xl: 1920
        }
    },
    components: {
        MuiTextField: {
            styleOverrides: {
                root: {
                    '@media (max-width:600px)': {
                        marginBottom: '10px'
                    }
                }
            }
        },
        MuiButton: {
            styleOverrides: {
                root: {
                    '@media (max-width:600px)': {
                        fontSize: '0.8rem',
                        padding: '8px 12px'
                    }
                }
            }
        },
        MuiPaper: {
            styleOverrides: {
                root: {
                    '@media (max-width:600px)': {
                        padding: '16px',
                        margin: '8px'
                    }
                }
            }
        }
    },
    typography: {
        fontFamily: 'Roboto, Arial, sans-serif',
        h4: {
            '@media (max-width:600px)': {
                fontSize: '1.5rem'
            }
        },
        h6: {
            '@media (max-width:600px)': {
                fontSize: '1.1rem'
            }
        }
    }
});
