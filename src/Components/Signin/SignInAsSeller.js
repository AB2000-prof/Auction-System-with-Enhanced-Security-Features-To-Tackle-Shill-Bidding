
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



//For Styles
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
// Functional Components 
export default function SignIn(props) {
  const history = useHistory()
  const classes = useStyles();
  const [formData, setFormData] = useState({})
  const [errors, setErrors] = useState([])


  //To handle and save changes in signup form
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }


  //To Validate and Submit Details to Database
  const onSubmit = () => {
    var allErrors = []

    if (!formData.email) {
      allErrors.push("Email Is Required")
    }
    else if (!formData.password) {
      allErrors.push("Password Is Required")
    }
    else {
      if (!/^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/.test(formData.email)) {
        allErrors.push("Please Enter Email In Correct Format")
      }
      else if (formData.password.length < 6) {
        allErrors.push("Length of Password Should Be 6 Or More Characters ")
      }
      else {
        signIn()
      }
    }

    setErrors(allErrors)
    setTimeout(() => {
      setErrors([])
    }, 5000);
  }


  // Validate if a seller account with the entered email exists and is approved and isn't blocked and then login    
  const signIn = () => {
    var ref = firebase.database().ref("/users/Seller/");
    ref.orderByChild("email").equalTo(formData.email).once("value").then(function (snapshot) {
      var allErrors = []
      if (snapshot.exists() && Object.values(snapshot.val())[0].accounttype == "Seller") {
        if (Object.values(snapshot.val())[0].approved) {
          if (!Object.values(snapshot.val())[0].blocked) {
          firebase.auth().signInWithEmailAndPassword(formData.email, formData.password)
            .then((userCredential) => {
              // Signed in
              props.setAuthTrue()
              history.push("/sellerdashboard")
              // ...
            })
            .catch((error) => {
              var errorCode = error.code;
              var errorMessage = error.message;
              var allErrors = []
              allErrors.push(errorMessage)
              setErrors(allErrors)
              setTimeout(() => {
                setErrors([])
              }, 5000);
            });
          }
          else{
            var allErrors = []
            allErrors.push("Your Account Has Been Blocked By Admin")
            setErrors(allErrors)
            setTimeout(() => {
              setErrors([])
            }, 5000);
          }
        }
        else {
          allErrors.push("Your Account Hasn't Been Approved Yet")
          setErrors(allErrors)
          setTimeout(() => {
            setErrors([])
          }, 5000);
        }
      }
      else {
        allErrors.push("A Seller Account With This Email Does Not Exist!")
        setErrors(allErrors)
        setTimeout(() => {
          setErrors([])
        }, 5000);
      }
    }).catch((error) => {
      var allErrors = []
      allErrors.push(error.message)
      setErrors(allErrors)
      setTimeout(() => {
        setErrors([])
      }, 5000);
    })


  }





  return (
    <Container component="main" maxWidth="xs">
      <CssBaseline />
      <div className={classes.paper}>
        <Avatar className={classes.avatar}>
          <LockOutlinedIcon />
        </Avatar>
        <Typography component="h1" variant="h5">
          Sign in As Seller
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
            onChange={handleChange}
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
            onChange={handleChange}
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
            onClick={onSubmit}
          >
            Sign In
          </Button>
          <Grid container>
            <Grid item xs>
              <Link to="/forgotpassword">
                Forgot password?
              </Link>
            </Grid>
            <Grid item>
              <Link to="/signup">
                {"Don't have an account? Sign Up"}
              </Link>
            </Grid>
          </Grid>
        </div>
      </div>
      <Box mt={8}>
       
      </Box>
    </Container>
  );
}