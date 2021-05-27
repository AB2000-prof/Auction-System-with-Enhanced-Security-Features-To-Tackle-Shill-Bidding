import firebase from '../../../config/firebase'
import React, { useState } from 'react';
import { Button, Grid } from '@material-ui/core';
import CssBaseline from '@material-ui/core/CssBaseline';
import TextField from '@material-ui/core/TextField';
import { Alert } from 'reactstrap'
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';
import { useHistory } from 'react-router-dom';


//For Styles
const useStyles = makeStyles((theme) => ({
  paper: {
    marginTop: theme.spacing(20),
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

export default function SignIn() {
  const classes = useStyles();
  const [formData, setFormData] = useState({})
  const [errors, setErrors] = useState([])
  const [dummyState, setDummyState] = useState("")
  const history = useHistory()


  //Save changes from form into state for submitting
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  //Validate all data. Throw error if any data is not correct. Otherwise send it to database
  const onSubmit = () => {
    var allErrors = []
    if (!formData.username) {
      allErrors.push("Username Is Required")
    }
    else if (!formData.description) {
      allErrors.push("Description of Complaint Is Required")
    }
    else {
      if (formData.description.length < 50) {
        allErrors.push("Description of Complaint Should Be 50 Or More Characters")
      }
      else {
        firebase.database().ref(`users/Seller`).orderByChild("username").equalTo(formData.username).once("value").then(function (snapshot) {
          if (!snapshot.exists()) {
            allErrors.push("There is no seller with the provided username")
            setDummyState("sss")
            setDummyState("")
          }
          else {
            firebase.database().ref(`users/Buyer/${firebase.auth().currentUser.uid}`).once("value", user => {
              firebase.database().ref(`complaints`).push({
                username: formData.username,
                description: formData.description,
                addedBy: user.val().username
              })
              history.push("/buyerdashboard")
            })
          }
        })
      }
    }

    setErrors(allErrors)
    setTimeout(() => {
      setErrors([])
    }, 4000);
  }

  return (
    <Container component="main" maxWidth="xs">
      <CssBaseline />
      <div className={classes.paper}>
        <Typography component="h1" variant="h5">
          Add Complaint
        </Typography>
        <div className={classes.form}>
          <TextField
            variant="outlined"
            margin="normal"
            required
            fullWidth
            id="username"
            label="Username of Seller"
            name="username"
            autoComplete="username"
            autoFocus
            onChange={handleChange}
          />
          <TextField
            variant="outlined"
            margin="normal"
            required
            fullWidth
            name="description"
            multiline
            label="Description"
            id="description"
            autoComplete="description"
            rows={10}
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
            Submit
          </Button>
        </div>
      </div>
    </Container>
  );
}