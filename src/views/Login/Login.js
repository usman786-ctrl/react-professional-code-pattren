import React from 'react';
import Button from '@material-ui/core/Button';
import CssBaseline from '@material-ui/core/CssBaseline';
import TextField from '@material-ui/core/TextField';
import Box from '@material-ui/core/Box';
import Container from '@material-ui/core/Container';
import styles from "./Login.styles";
import { withStyles } from '@material-ui/styles';
import { API_ROOT, URI, API_CONSTANTS } from '../../config/config'
import { httpProcessor } from "../../actions/app";
import logo from "../../assets/logo.png"
import { CircularProgress, Backdrop } from '@material-ui/core';

class Login extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      loginId: '',
      password: '',
      loginError: '',
      passwordError: '',
      loginFieldHadInput: false,
      passwordFieldHadInput: false,
      error: '',
      isLoading: false
    }
  }

  componentDidMount() {
    const userDetails = localStorage.getItem('userDetails');

    if (userDetails) {
      this.props.history.push('/');
    }
  }

  handleLogIn(e) {
    e.preventDefault();

    this.setState({
      error: '',
      loginError: '',
      passwordError: '',
      loginFieldHadInput: false,
      passwordFieldHadInput: false
    }, this.logInUser);
  }

  logInUser() {
    if (this.isValidLogin()) {
      const payload = {
        LoginID: this.state.loginId,
        Password: this.state.password,
      }

      this.setState({
        isLoading: true
      });

      httpProcessor(API_ROOT + URI.LOGIN_USER, {
        method: 'POST',
        body: JSON.stringify(payload)
      })
        .then(async data => {
          if (data) {
            localStorage
              .setItem('userDetails', JSON.stringify(data))
            // this.props.updateUserAuthenticationState(true);
            // this.props.updateAppError("");
            // await new Promise()
            this.props.history.push('/');
          }

          this.setState({
            isLoading: false
          });
        })
        .catch((err) => {
          if (err) {
            if (err.ErrorCode === "YCP0428" || err.ErrorCode === "YCP0084") {
              this.setState({
                error: "Invalid login credentials",
                password: ''
              });
            } else {
              this.setState({
                error: API_CONSTANTS.COMMON_ERROR,
                password: ''
              });
            }
          }

          this.setState({
            isLoading: false
          });
        })
    }
  }

  isValidLogin() {
    let isValid = true;

    if (this.state.loginId == '') {
      isValid = false;

      this.setState({
        loginError: "Login field is required!",
      });
    }

    if (this.state.password == '') {
      isValid = false;

      this.setState({
        passwordError: "Password field is required!",
      });
    }

    return isValid;
  }

  handleLoginFocus() {
    if (this.state.password == '' && this.state.passwordFieldHadInput) {
      this.setState({
        passwordError: "Password field is required!",
      });
    }
  }

  handleLoginChange(loginId) {
    this.setState({
      loginId: loginId,
      loginError: '',
      error: '',
      loginFieldHadInput: true
    });
  }

  handlePasswordFocus() {
    if (this.state.loginId == '' && this.state.loginFieldHadInput) {
      this.setState({
        loginError: "Login field is required!",
      });
    }
  }

  handlePasswordChange(password) {
    this.setState({
      password: password,
      passwordError: '',
      error: '',
      passwordFieldHadInput: true
    });
  }

  handleBodyPress() {
    this.handleLoginFocus();
    this.handlePasswordFocus();
  }

  render() {
    const { classes } = this.props;
    return (
      <div style={{ backgroundColor: "white" }}>

        <Container component="main" maxWidth="xs" className={classes.container}>
          <CssBaseline />
          
          <div className={classes.paper} style={{ marginTop: 0 }}>
          <div style={{ textAlign: "center" }}>
            <img src={logo} style={{ width: "70%" }} />
          </div>
            
            <form className={classes.form}>

              <TextField
                variant="outlined"
                margin="normal"
                required
                fullWidth
                id="loginid"
                label="Login ID"
                name="loginid"
                autoComplete="loginid"
                autoFocus
                onChange={e => this.handleLoginChange(e.target.value)}
                onFocus={() => this.handleLoginFocus()}
                error={!!this.state.loginError}
                helperText={this.state.loginError}
                value={this.state.loginId}
              />

              <TextField
                variant="outlined"
                margin="normal"
                required
                fullWidth
                name="password"
                label="Password"
                type="password"
                id="password"
                autoComplete="password"
                onFocus={() => this.handlePasswordFocus()}
                onChange={e => this.handlePasswordChange(e.target.value)}
                error={!!this.state.passwordError}
                helperText={this.state.passwordError}
                value={this.state.password}
              />

              {this.state.error ? (
                <Box color="error.main" align="center">
                  {this.state.error}
                </Box>
              ) : null}

              <Button
                type="submit"
                fullWidth
                variant="contained"
                color="primary"
                className={classes.submit}
                onClick={e => this.handleLogIn(e)}
                onSubmit={e => this.handleLogIn(e)}
              >
                Log In
              </Button>
            </form>
          </div>

          <Box 
          mt={18} 
          align="center"
          fullWidth
           style={{ 
            background: 'green',
            color:'white'
            }} >
            <div>All Rights Reserved</div>
            <div>Heba Systems Licensed</div>
            <div>2019</div>
          </Box>

        </Container>
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            height: "100vh"
          }}
        >
          <Backdrop className={classes.backdrop} open={this.state.isLoading}>
            <CircularProgress color="primary" />
          </Backdrop>
        </div>
        
      </div>
    );
  }
}

export default withStyles(styles)(Login);