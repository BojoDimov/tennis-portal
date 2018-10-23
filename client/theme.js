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
    MuiTypography: {
      caption: {
        fontStyle: 'italic'
      },
      body2: {
        color: '#629900'
      }
    }
  }
});

// MuiExpansionPanel: {
//   root: {
//     backgroundColor: '#3672DB',
//       color: 'white',
//         borderColor: '#3672DB'
//   }
// },
// MuiExpansionPanelDetails: {
//   root: {
//     backgroundColor: 'whitesmoke',
//       borderColor: '#3672DB'
//   }
// },
// MuiTypography: {
//   body2: {
//     color: 'white'
//   }
// }