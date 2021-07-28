import { useState } from 'react';
import axios, { AxiosResponse } from 'axios';
import config from '../../config/keys';
import Button from '@material-ui/core/Button';
import CssBaseline from '@material-ui/core/CssBaseline';
import TextField from '@material-ui/core/TextField';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';
import Link from '@material-ui/core/Link';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';
import Logo from '../../images/moneypot_logo_white.jpeg';
import Moneypot from '../../images/moneypot_name_white.jpeg';
import "./session.css";

const useStyles = makeStyles((theme) => ({
  paper: {
    marginTop: theme.spacing(8),
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  avatar: {
    margin: theme.spacing(1),
    backgroundColor: theme.palette.secondary.main,
  },
  form: {
    width: '100%', // Fix IE 11 issue.
    marginTop: theme.spacing(1),
  },
  submit: {
    margin: theme.spacing(3, 0, 2),
  },
}));

export default function Login() {
  const classes = useStyles();
  const [email, setEmail] = useState<string>("")
  const [error, setError] = useState<string>("")
  const [password, setPassword] = useState<string>("")

  const login = () => {
    axios.post(`${config.API_URL}/login`, {
      email,
      password
    }, {
      withCredentials: true
    }).then((res : AxiosResponse) => {
       window.location.href = "/"
    }, (res) => {
      setError("User not found")
    })
  }
  
  return (
    <Container className="session-container" component="main" maxWidth="xs">
      <CssBaseline />
      <div className={classes.paper}>
        <Link className = "session-logo" href="/">
          <img className="moneypot-logo" src={Logo} alt="Moneypot Logo"/>
          <img className="moneypot-name" src={Moneypot} alt="Moneypot Name"/>
        </Link><br></br>
        <Typography component="h1" variant="h5">
          Sign in
        </Typography>
        <h3 className="error-message">{error}</h3>
        <form className={classes.form} noValidate>
          <TextField
            onChange={e => setEmail(e.target.value)}
            variant="outlined"
            margin="normal"
            required
            fullWidth
            id="email"
            label="Email Address"
            name="email"
            autoComplete="email"
            autoFocus
          />
          <TextField
            onChange={e => setPassword(e.target.value)}
            variant="outlined"
            margin="normal"
            required
            fullWidth
            name="password"
            label="Password"
            type="password"
            id="password"
            autoComplete="current-password"
          />
          <FormControlLabel
            control={<Checkbox value="remember" color="primary" />}
            label="Remember me"
          />
          <Button
            onClick={login}
            fullWidth
            variant="contained"
            color="primary"
            className={classes.submit}
          >
            Sign In
          </Button>
          <Grid container>
            <Grid item xs>
            </Grid>
            <Grid item><br></br>
              <Link href="/register" variant="body1">
                {"Don't have an account? Sign Up"}
              </Link>
            </Grid>
          </Grid>
        </form>
      </div>
    </Container>
  );
}