import React,{useEffect,useState} from 'react';
import Avatar from '@material-ui/core/Avatar';
import Button from '@material-ui/core/Button';
import CssBaseline from '@material-ui/core/CssBaseline';
import {Link,useHistory} from "react-router-dom";
import Paper from '@material-ui/core/Paper';
import Box from '@material-ui/core/Box';
import Grid from '@material-ui/core/Grid';
import AccountBalanceIcon from '@material-ui/icons/AccountBalance';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import firebase from '../../config/firebase'
import CircularProgress from '@material-ui/core/CircularProgress';


const useStyles = makeStyles((theme) => ({
  root: {
    height: '100vh',
  },
  image: {
    backgroundImage: 'url(cover.png)',
    backgroundRepeat: 'no-repeat',
    backgroundColor:
      theme.palette.type === 'light' ? theme.palette.grey[50] : theme.palette.grey[900],
    backgroundSize: 'cover',
    backgroundPosition: 'center',
  },
  paper: {
    margin: theme.spacing(60, 4),
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  avatar: {
      width:70,
      height:70,
    margin: theme.spacing(2),
    backgroundColor: theme.palette.primary.main,
  },
  form: {
    width: '100%', // Fix IE 11 issue.
    marginTop: theme.spacing(1),
  },
  submit: {
    margin: theme.spacing(1, 0, 1),
  },
  loader:{
      margin:"0 auto"
  }
}));

export default function Home(props) {
  const classes = useStyles();
  const history = useHistory();
  const [loading,setLoading] = useState(true)


//Check if a user is already logged In. If user is seller, then go to seller dashboard, otherwise go to buyer dashboard. If user is not logged in. Stay on Homepage
  useEffect(()=>{
    firebase.auth().onAuthStateChanged(function(user) {
      if (user) {
        firebase.database().ref(`users/Buyer/${user.uid}`).once("value").then((snapshot)=>{
          if(snapshot.exists()){
            if(snapshot.val().approved){
              if(!snapshot.val().blocked){
            props.setBuyerAuthTrue()
            history.push("/buyerdashboard")
          }
          else{
            firebase.auth().signOut()
            history.push("/")
          }
            }
            else{
              history.push("/signinasbuyer")
            }
          }
          else{
            firebase.database().ref(`users/Seller/${user.uid}`).once("value").then((snapshot)=>{
              if(snapshot.exists()){
                if(snapshot.val().approved){
                  if(!snapshot.val().blocked){
                    props.setSellerAuthTrue()
                    history.push("/sellerdashboard")
                  }
                  else{
                    firebase.auth().signOut()
                    history.push("/")
                  }
              }
              else{
                history.push("/signinasseller")
              }
              }
              else{
                firebase.database().ref(`users/Admin/${user.uid}`).once("value").then((snapshot)=>{
                  if(snapshot.exists()){
                    props.setAdminAuthTrue()
                    history.push("/admin")
                  }
                })
              }
            })
          }
        })
      }
    });
  },[])

 

  useEffect(()=>{
    setTimeout(() => {
      setLoading(false)
    }, 2000);
  },[])


  return (
      <>
      {loading ?  <Grid
  container
  spacing={0}
  direction="column"
  alignItems="center"
  justify="center"
  style={{ minHeight: '100vh',textAlign:"center" }}
>
<Grid item xs={3}>
<CircularProgress className={classes.loader}/>
<Typography component="h1" variant="h5">
    Loading...
</Typography>
  </Grid> 
 
</Grid>
      : 
    <Grid container component="main" className={classes.root}>
      <CssBaseline />
      <Grid item xs={false} sm={4} md={7} className={classes.image} />
      <Grid item xs={12} sm={8} md={5} component={Paper} elevation={6} square>
        <div className={classes.paper}>
          <Avatar className={classes.avatar}>
            <AccountBalanceIcon fontSize="large"/>
          </Avatar>
          <Typography component="h1" variant="h5">
            Welcome To Auction App
          </Typography>
          <form className={classes.form} noValidate>
            <Link to="/signinasseller"><Button
              type="submit"
              fullWidth
              variant="contained"
              color="primary"
              className={classes.submit}
            >
              Sign In As Seller
            </Button></Link>
            <Link to="/signinasbuyer"><Button
              type="submit"
              fullWidth
              variant="contained"
              color="primary"
              className={classes.submit}
            >
              Sign In As Buyer
            </Button></Link>
            <Link to="/signinasadmin"><Button
              type="submit"
              fullWidth
              variant="contained"
              color="primary"
              className={classes.submit}
            >
              Sign In As Admin
            </Button></Link>
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
            <Box mt={5}>
            </Box>
          </form>
        </div>
      </Grid>
    </Grid>}
    </>
  );
}