import React, { useState } from 'react';
import Avatar from '@material-ui/core/Avatar';
import Button from '@material-ui/core/Button';
import CssBaseline from '@material-ui/core/CssBaseline';
import TextField from '@material-ui/core/TextField';
import { Link, useHistory } from "react-router-dom";
import Grid from '@material-ui/core/Grid';
import Box from '@material-ui/core/Box';
import LockOutlinedIcon from '@material-ui/icons/LockOutlined';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';
import { Alert } from 'reactstrap'
import firebase from '../../config/firebase'


const useStyles = makeStyles((theme) => ({
  paper: {
    marginTop: theme.spacing(8),
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  avatar: {
    margin: theme.spacing(1),
    backgroundColor: theme.palette.primary.main,
  },
  form: {
    width: '100%', // Fix IE 11 issue.
    marginTop: theme.spacing(1),
  },
  submit: {
    margin: theme.spacing(3, 0, 2),
  },
}));

export default function ForgotPassword() {
  const classes = useStyles()
  const [errors, setErrors] = useState([])
  const [email, setEmail] = useState("")
  const [emailSent, setEmailSent] = useState(false)


  //Validate email, if email is correct, send an email to reset password 
  const onSubmitEmail = () => {
    var allErrors = []
    if (email !== "") {
      if (!/^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/.test(email)) {
        allErrors.push("Please Enter Email In Correct Format")
      }
      else {
        firebase.auth().sendPasswordResetEmail(email)
        setEmailSent(true)
      }
    }
    else {
      allErrors.push("Email Is Required")
    }
    setErrors(allErrors)

    setTimeout(() => {
      setErrors([])
    }, 5000);
  }



  return (
    <Container component="main" maxWidth="xs">
      <CssBaseline />
      <div className={classes.paper}>
        <Avatar className={classes.avatar}>
          <LockOutlinedIcon />
        </Avatar>
        {emailSent ?
          <Typography component="h1" variant="h5">
            Check Your Email For Further Steps to Reset Your Password
      </Typography>
          :
          <div>
            <Typography component="h1" variant="h5" style={{ textAlign: "center" }}>
              Enter your Email to reset your password
        </Typography>
            <div className={classes.form}>
              <TextField
                variant="outlined"
                margin="normal"
                required
                fullWidth
                id="email"
                label="Email Address"
                name="email"
                autoComplete="email"
                autoFocus
                onChange={(e) => setEmail(e.target.value)}
              />
              {
                errors.map((error, index) => (
                  <Grid item key={index} xs={12}>
                    <Alert color="danger">
                      {error}
                    </Alert>
                  </Grid>
                ))
              }
              <Button
                type="submit"
                fullWidth
                variant="contained"
                color="primary"
                className={classes.submit}
                onClick={onSubmitEmail}
              >
                Send Email
          </Button>
            </div>

          </div>

        }
      </div>
    </Container>
  )
}