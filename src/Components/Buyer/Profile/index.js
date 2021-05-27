import React, { useEffect, useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardActionArea from '@material-ui/core/CardActionArea';
import firebase from '../../../config/firebase'
import CardContent from '@material-ui/core/CardContent';
import Typography from '@material-ui/core/Typography';

//For Styles
const useStyles = makeStyles({
  card: {
    width: 500,
  },
  root: {
    display: "flex",
    justifyContent: "center",
    marginTop: 100
  },
  media: {
    height: 140,
  },
});

export default function Profile() {
  const classes = useStyles();
  const [profile, setProfile] = useState({})

  //Get Profile info from Database
  useEffect(() => {
    firebase.database().ref(`users/Buyer/${firebase.auth().currentUser.uid}`).on("value", (snapshot) => {
      if(snapshot.exists()){
      setProfile(snapshot.val())
    }
    })
  }, [])

  return (
    <div className={classes.root}>
      <Card className={classes.card}>
        <CardActionArea>
          <CardContent>
            <Typography variant="h5" component="h2">
              {profile.firstName} {profile.lastName}
            </Typography>
            <Typography gutterBottom variant="body2" color="textSecondary" component="p">
              @{profile.username}
            </Typography>

            <Typography variant="subtitle1" component="p">
              <b>Email:</b> {profile.email}
            </Typography>

            <Typography variant="subtitle1" component="p">
              <b>Account Type:</b> {profile.accounttype}
            </Typography>

            <Typography variant="subtitle1" component="p">
              <b>Phone No:</b> {profile.phnumber}
            </Typography>

            <Typography variant="subtitle1" component="p">
              <b>Wallet:</b> {profile.wallet}$
          </Typography>
          </CardContent>
        </CardActionArea>
      </Card>
    </div>
  );
}