import { createMuiTheme } from '@material-ui/core/styles';

export default createMuiTheme({
  palette: {
    primary: {
      main: '#828A00',
      // '#629900'
      contrastText: '#fff'
    },
    secondary: {
      // main: '#E87114',
      main: '#f47521',
      contrastText: '#fff'
    }
  },
  overrides: {
    MuiFormControl: {
      root: {
        marginTop: '.5rem'
      }
    },
    MuiDialog: {
      paper: {
        overflowY: 'visible'
      }
    },
    MuiTypography: {
      caption: {
        fontStyle: 'italic'
      },
      body2: {
        color: '#828A00'
      },
      display1: {
        color: '#828A00',
        display: 'inline',
        fontSize: '1.5rem',
        margin: '0 0.3rem'
      },
      display2: {
        fontSize: '1rem',
        color: '#828A00',
        fontWeight: 700
      },
      h4: {
        color: '#828A00'
      }
    },
    MuiCardActions: {
      root: {
        padding: 0
      }
    },
    MuiDrawer: {
      modal: {
        zIndex: 1200
      }
    }
  }
});