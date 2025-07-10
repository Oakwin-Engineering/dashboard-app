import { createTheme } from '@mui/material/styles';

// A clean, professional, and light theme.
const theme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#1976d2', // Standard MUI blue
    },
    secondary: {
      main: '#dc004e', // Standard MUI pink
    },
    background: {
      default: '#f4f6f8', // A very light grey for the background
      paper: '#ffffff',   // White for paper elements
    },
    text: {
      primary: '#000000',
      secondary: '#6c757d',
    },
  },
  shape: {
    borderRadius: 2, // Even sharper corners for a sleeker look
  },
  typography: {
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
    h5: {
      fontWeight: 600,
    },
  },
  components: {
    MuiAppBar: {
      styleOverrides: {
        root: {
          backgroundColor: '#ffffff',
          color: '#000000',
          boxShadow: '0 1px 4px rgba(0,0,0,0.1)',
        },
      },
    },
    MuiDrawer: {
        styleOverrides: {
            paper: {
                backgroundColor: '#ffffff',
                borderRight: '1px solid #e0e0e0'
            }
        }
    },
    MuiTableContainer: {
        styleOverrides: {
            root: {
                boxShadow: '0 1px 4px rgba(0,0,0,0.1)',
                border: '1px solid #e0e0e0'
            }
        }
    },
    MuiTableCell: {
        styleOverrides: {
            root: {
                padding: '6px 8px', // Further reduced padding for a more compact table
                borderBottom: '1px solid #e0e0e0'
            },
            head: {
                fontWeight: '600',
                backgroundColor: '#f5f5f5' // Light grey header for subtle contrast
            }
        }
    },
    MuiPaper: {
        styleOverrides: {
            root: {
                boxShadow: '0 1px 4px rgba(0,0,0,0.1)', // A more subtle shadow
            }
        }
    }
  },
});

export default theme;
