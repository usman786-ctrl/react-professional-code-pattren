import { createMuiTheme } from '@material-ui/core/styles';
import green from '@material-ui/core/colors/green';
import { blue } from '@material-ui/core/colors';

const theme = createMuiTheme({
  palette: {  
    primary: blue,
    secondary: green,
  },
  status: {
    danger: 'orange',
  },
});

export default theme;