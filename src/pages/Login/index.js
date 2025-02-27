import React, { Component } from "react";

import {
  Avatar,
  Button,
  Container,
  CssBaseline,
  TextField,
  Typography,
} from "@material-ui/core";
import { withStyles } from "@material-ui/core/styles";
import LockOutlinedIcon from "@material-ui/icons/LockOutlined";

import Swal from "sweetalert2/src/sweetalert2.js";
import "@sweetalert2/theme-dark/dark.css";

import axios from "axios";

const styles = (theme) => ({
  paper: {
    marginTop: theme.spacing(8),
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  },
  avatar: {
    margin: theme.spacing(1),
    backgroundColor: theme.palette.secondary.main,
  },
  form: {
    width: "100%",
    marginTop: theme.spacing(1),
  },
  submit: {
    margin: theme.spacing(3, 0, 2),
  },
});

class Login extends Component {
  constructor(props) {
    super(props);
    this.state = {
      auth: "",
      error: "",
      page: false,
      password: "",
      signup: false,
      server: window.location.origin,
      username: "",
    };

    this.handleTempServerChange = this.handleTempServerChange.bind(this);
    this.handlePassChange = this.handlePassChange.bind(this);
    this.handleUserChange = this.handleUserChange.bind(this);
    this.handleServerSubmit = this.handleServerSubmit.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleSignup = this.handleSignup.bind(this);
    this.dismissError = this.dismissError.bind(this);
  }

  componentDidMount() {
    let { server } = this.state;
    axios.get(`${server}/api/v1/auth?rules=signup`).then((response) => {
      let data = response.data;
      if (data.code === 200) {
        localStorage.setItem("auth", "0");
        localStorage.setItem("server", server);
        sessionStorage.setItem("auth", "0");
        sessionStorage.setItem("server", server);
        this.props.history.push(data.content);
      } else if (data.content === true) {
        this.setState({ signup: true, page: true });
      } else if (data.content === false) {
        this.setState({ signup: false, page: true });
      }
    });
  }

  dismissError() {
    this.setState({ error: "" });
  }

  handleServerSubmit(evt) {
    evt.preventDefault();
    let { server } = this.state;
    if (!server) {
      return this.setState({ error: "Server is required" });
    }
    if (!server.startsWith("http")) {
      server = `https://${server}`;
    }
    axios
      .get(`${server}/api/v1/auth?rules=signup`)
      .then((response) => {
        let data = response.data;
        if (data.code === 200) {
          localStorage.setItem("auth", "0");
          localStorage.setItem("server", server);
          sessionStorage.setItem("auth", "0");
          sessionStorage.setItem("server", server);
          this.props.history.push(data.content);
        } else if (data.content === true) {
          this.setState({ server: server, signup: true, page: true });
        } else if (data.content === false) {
          this.setState({ server: server, signup: false, page: true });
        }
      })
      .catch((error) => {
        console.error(error);
        try {
          let data = response.data;
          Swal.fire({
            title: "Error!",
            text: data.message,
            icon: "error",
            confirmButtonText: "OK",
          });
        } catch {
          Swal.fire({
            title: "Error!",
            text: `You were unable to communicate with the server. Are you sure ${server} is the correct server?`,
            icon: "error",
            confirmButtonText: "OK",
          });
        }
      });
  }

  handleSubmit(evt) {
    evt.preventDefault();
    let { password, server, username } = this.state;

    axios
      .get(`${server}/api/v1/auth?u=${username}&p=${password}`)
      .then((response) => {
        let data = response.data;
        localStorage.setItem("server", server);
        sessionStorage.setItem("server", server);
        localStorage.setItem("auth", data.content.auth);
        sessionStorage.setItem("auth", data.content.auth);
        this.props.history.push("/");
      })
      .catch((error) => {
        console.error(error);
        try {
          let data = response.data;
          Swal.fire({
            title: "Error!",
            text: data.message,
            icon: "error",
            confirmButtonText: "OK",
          });
        } catch {
          Swal.fire({
            title: "Error!",
            text: `Something went wrong while communicating with the server ${server}`,
            icon: "error",
            confirmButtonText: "OK",
          });
        }
      });
    return this.setState({ error: "" });
  }

  handleSignup() {
    let { password, server, username } = this.state;
    if (!username) {
      return this.setState({ error: "Username is required" });
    }
    if (!password) {
      return this.setState({ error: "Password is required" });
    }

    axios
      .get(`${server}/api/v1/signup?u=${username}&p=${password}`)
      .then((response) => {
        let data = response.data;
        localStorage.setItem("server", server);
        sessionStorage.setItem("server", server);
        localStorage.setItem("auth", data.content.auth);
        sessionStorage.setItem("auth", data.content.auth);
        this.props.history.push("/");
      })
      .catch((error) => {
        console.error(error);
        let data = error.response;
        try {
          Swal.fire({
            title: "Error!",
            text: data.message,
            icon: "error",
            confirmButtonText: "OK",
          });
        } catch {
          Swal.fire({
            title: "Error!",
            text: `Something went wrong while communicating with the server ${server}`,
            icon: "error",
            confirmButtonText: "OK",
          });
        }
      });
    return this.setState({ error: "" });
  }

  handleTempServerChange(evt) {
    this.setState({
      server: evt.target.value,
    });
  }

  handleUserChange(evt) {
    this.setState({
      username: evt.target.value,
    });
  }

  handlePassChange(evt) {
    this.setState({
      password: evt.target.value,
    });
  }

  render() {
    let { error, password, page, server, username } = this.state;
    const { classes } = this.props;

    return !page ? (
      <Container component="main" maxWidth="xs">
        <CssBaseline />
        <div className={classes.paper}>
          <Avatar className={classes.avatar}>
            <LockOutlinedIcon />
          </Avatar>
          <Typography variant="h5">Sign in</Typography>
          <form
            className={classes.form}
            onSubmit={this.handleServerSubmit}
            noValidate
          >
            {error && (
              <div style={{}}>
                <h3 data-test="error" onClick={this.dismissError}>
                  <button onClick={this.dismissError}>✖</button>
                  {error}
                </h3>
              </div>
            )}
            <TextField
              variant="outlined"
              margin="normal"
              required
              fullWidth
              id="server"
              label="Server"
              name="server"
              autoComplete="server"
              onChange={this.handleTempServerChange}
              value={server}
              autoFocus
            />
            <Button
              type="submit"
              fullWidth
              variant="contained"
              color="primary"
              className={classes.submit}
            >
              Next
            </Button>
          </form>
        </div>
      </Container>
    ) : (
      <Container component="main" maxWidth="xs">
        <CssBaseline />
        <div className={classes.paper}>
          <Avatar className={classes.avatar}>
            <LockOutlinedIcon />
          </Avatar>
          <Typography variant="h5">Sign in</Typography>
          <form
            className={classes.form}
            onSubmit={this.handleSubmit}
            noValidate
          >
            {error && (
              <div style={{}}>
                <h3 data-test="error" onClick={this.dismissError}>
                  <button onClick={this.dismissError}>✖</button>
                  {error}
                </h3>
              </div>
            )}
            <TextField
              variant="outlined"
              margin="normal"
              required
              fullWidth
              id="server"
              label="Server"
              name="server"
              autoComplete="server"
              onChange={this.handleTempServerChange}
              value={server}
              autoFocus
              disabled
            />
            <TextField
              variant="outlined"
              margin="normal"
              required
              fullWidth
              id="username"
              label="Username"
              name="username"
              autoComplete="username"
              onChange={this.handleUserChange}
              value={username}
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
              autoComplete="current-password"
              onChange={this.handlePassChange}
              value={password}
            />
            <Button
              type="submit"
              fullWidth
              variant="contained"
              color="primary"
              className={classes.submit}
            >
              Sign In
            </Button>
            {this.state.signup ? (
              <div className="Signup" style={{ textAlign: "center" }}>
                <Button
                  type="button"
                  onClick={this.handleSignup}
                  fullWidth
                  variant="contained"
                  color="primary"
                  className={classes.submit}
                >
                  Sign Up
                </Button>
                <Typography variant="body1">
                  Be aware that the owner of this server can view your
                  credentials!
                </Typography>
              </div>
            ) : (
              <div className="Signup"></div>
            )}
          </form>
        </div>
      </Container>
    );
  }
}

export default withStyles(styles, { withTheme: true })(Login);
