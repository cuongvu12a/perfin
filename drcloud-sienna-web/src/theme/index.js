import { createTheme } from '@mui/material';

const theme = createTheme({
  palette: {
    textPrimary: {
      main: '#15233E'
    },
    textSecondary: {
      main: '#F96363'
    },
    primary: {
      main: '#4A98E2'
    },
    secondary: {
      main: '#00B268'
    },
    white: {
      main: '#FFFFFF'
    },
    divider: {
      main: '#dddddd4d'
    },
    grey: {
      700: '#999999'
    }
  },
  typography: {
    h2: {
      fontWeight: 700,
      fontSize: 24,
      letterSpacing: '-0.06px'
    },
    h3: {
      fontWeight: 700,
      fontSize: 20,
      letterSpacing: '-0.06px'
    },
    h4: {
      fontWeight: 600,
      fontSize: 16,
      letterSpacing: '-0.05px',
      lineHeight: '15.6px'
    },
    h5: {
      fontWeight: 400,
      fontSize: 16,
      letterSpacing: '-0.05px'
    },
    h6: {
      fontWeight: 400,
      fontSize: 14,
      letterSpacing: '-0.05px'
    },
    p: {
      fontWeight: 400,
      fontSize: 12,
      letterSpacing: '-0.05px'
    },
    button: {
      fontWeight: 700,
      fontSize: 20,
      textTransform: 'none'
    },
    buttonStep: {
      fontWeight: 700,
      fontSize: 18,
      textTransform: 'none'
    }
  }
});

export default theme;
