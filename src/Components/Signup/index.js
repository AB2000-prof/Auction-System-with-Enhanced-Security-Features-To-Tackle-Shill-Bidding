import React, { useState } from 'react';
import Avatar from '@material-ui/core/Avatar';
import Button from '@material-ui/core/Button';
import CssBaseline from '@material-ui/core/CssBaseline';
import TextField from '@material-ui/core/TextField';
import MenuItem from '@material-ui/core/MenuItem';
import InputLabel from '@material-ui/core/InputLabel';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
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
        marginTop: theme.spacing(3),
    },
    submit: {
        margin: theme.spacing(3, 0, 2),
    },
    formControl: {
        minWidth: '100%',
    },
}));
// Functional Components
export default function SignUp(props) {
    const history = useHistory()
    const classes = useStyles();
    const [formData, setFormData] = useState({})
    const [errors, setErrors] = useState([])
    const [dummyState, setDummyState] = useState("")

    //To handle and save changes in signup form
    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value })
    }

    //To Validate and Submit Details to Database
    const onSubmit = () => {
        var allErrors = []

        if (!formData.firstName) {
            allErrors.push("First Name Is Required")
        }
        else if (!formData.lastName) {
            allErrors.push("Last Name Is Required")
        }
        else if (!formData.email) {
            allErrors.push("Email Is Required")
        }
        else if (!formData.username) {
            allErrors.push("Username Is Required")
        }
        else if (!formData.phnumber) {
            allErrors.push("Phone Number Is Required")
        }
        else if (!formData.password) {
            allErrors.push("Password Is Required")
        }
        else if (!formData.accounttype) {
            allErrors.push("Account Type Is Required")
        }

        else {
            if (!/^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/.test(formData.email)) {
                allErrors.push("Please Enter Email In Correct Format")
            }
            else if (formData.password.length < 6) {
                allErrors.push("Length of Password Should Be 6 Or More Characters ")
            }
            else {
                firebase.database().ref(`users/${formData.accounttype}`).orderByChild("username").equalTo(formData.username).once("value").then(function (snapshot) {
                    if (!snapshot.exists()) {
                        signUp()
                    }
                    else {
                        allErrors.push("A User Already Exists with this Username")
                        setDummyState("sss")
                    }
                })

            }
        }

        setErrors(allErrors)
        setDummyState("ss")
        setTimeout(() => {
            setErrors([])
        }, 3000);
    }


    //Create the account and save account details to database
    const signUp = () => {
        firebase.auth().createUserWithEmailAndPassword(formData.email, formData.password)
            .then((userCredential) => {
                firebase.database().ref(`/users/${formData.accounttype}/${userCredential.user.uid}`).set({
                    firstName: formData.firstName,
                    lastName: formData.lastName,
                    email: formData.email,
                    phnumber: formData.phnumber,
                    accounttype: formData.accounttype,
                    username: formData.username,
                    wallet:50000,
                    approved:false,
                    blocked:false
                })
                if (formData.accounttype == "Seller") {
                    firebase.auth().signOut();
                    history.push("/signinasseller")
                }
                else if (formData.accounttype == "Buyer") {
                    firebase.auth().signOut();
                    history.push("/signinasbuyer")
                }
              
            })
            .catch((error) => {
                var errorCode = error.code;
                var errorMessage = error.message;
                var allErrors = []
                allErrors.push(errorMessage)
                setErrors(allErrors)
                // ..
            });
    }



    return (
        <Container component="main" maxWidth="xs">
            <CssBaseline />
            <div className={classes.paper}>
                <Avatar className={classes.avatar}>
                    <LockOutlinedIcon />
                </Avatar>
                <Typography component="h1" variant="h5">
                    Sign up
        </Typography>
                <div className={classes.form}>
                    <Grid container spacing={2}>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                autoComplete="fname"
                                name="firstName"
                                variant="outlined"
                                required
                                fullWidth
                                id="firstName"
                                label="First Name"
                                autoFocus
                                onChange={handleChange}
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                variant="outlined"
                                required
                                fullWidth
                                id="lastName"
                                label="Last Name"
                                name="lastName"
                                autoComplete="lname"
                                onChange={handleChange}
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                variant="outlined"
                                required
                                fullWidth
                                id="email"
                                label="Email Address"
                                name="email"
                                autoComplete="email"
                                onChange={handleChange}
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                variant="outlined"
                                required
                                fullWidth
                                id="username"
                                label="Username"
                                name="username"
                                autoComplete="username"
                                onChange={handleChange}
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                variant="outlined"
                                required
                                fullWidth
                                id="phnumber"
                                label="Phone Number"
                                name="phnumber"
                                onChange={handleChange}
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                variant="outlined"
                                required
                                fullWidth
                                name="password"
                                label="Password"
                                type="password"
                                id="password"
                                autoComplete="current-password"
                                onChange={handleChange}
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <FormControl variant="outlined" className={classes.formControl}>
                                <InputLabel id="demo-simple-select-outlined-label">Account Type</InputLabel>
                                <Select
                                    labelId="demo-simple-select-outlined-label"
                                    id="demo-simple-select-outlined"
                                    value={formData.accounttype}
                                    onChange={handleChange}
                                    label="Account Type"
                                    name="accounttype"
                                >
                                    <MenuItem value={"Seller"}>Seller</MenuItem>
                                    <MenuItem value={"Buyer"}>Buyer</MenuItem>
                                </Select>
                            </FormControl>
                        </Grid>

                        {
                            errors.map((error, index) => (
                                <Grid item key={index} xs={12}>
                                    <Alert color="danger">
                                        {error}
                                    </Alert>
                                </Grid>
                            ))
                        }

                    </Grid>
                    <Button
                        type="submit"
                        fullWidth
                        variant="contained"
                        color="primary"
                        className={classes.submit}
                        onClick={onSubmit}
                    >
                        Sign Up
          </Button>
                    <Grid container justify="flex-end">
                        <Grid item>
                            <Link to="/">
                                Already have an account? Sign in
              </Link>
                        </Grid>
                    </Grid>
                </div>
            </div>
            <Box mt={5}>
              
            </Box>
        </Container>
    );
}