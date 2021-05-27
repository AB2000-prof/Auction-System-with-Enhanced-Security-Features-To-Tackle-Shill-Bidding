import React, { useEffect, useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import Grid from '@material-ui/core/Grid';
import Card from '@material-ui/core/Card';
import Container from '@material-ui/core/Container';
import CardContent from '@material-ui/core/CardContent';
import SearchBar from "material-ui-search-bar";
import firebase from '../../../config/firebase'

//For Styles
const useStyles = makeStyles((theme) => ({
  card: {
    display: 'flex',
    marginBottom: 20
  },
  cardDetails: {
    flex: 1,
  },
  cardMedia: {
    width: 160,
  },
  root: {
    paddingTop: theme.spacing(15),
    paddingBottom: theme.spacing(15),
  },
  searchBar: {
    marginTop: 30,
    marginBottom: 60
  },
}))


export default function Complaints() {

  const [complaints, setComplaints] = useState([])
  const [search, setSearch] = useState("")

  //Get All Complaints from Database
  useEffect(() => {
    firebase.database().ref("complaints").on("value", (snapshot) => {
      if (snapshot.exists()) {
        setComplaints(Object.values(snapshot.val()))
      }
    })
  }, [])

  const classes = useStyles();

  return (
    <Container className={classes.root} maxWidth="md">
      {complaints.length > 0 ?
        <div>
          <SearchBar
            className={classes.searchBar}
            value={search}
            onChange={(newValue) => setSearch(newValue.toLowerCase())}
            placeholder="Search By Buyer's Username"
          />

          {complaints.filter(function (el) {
            var name = el.addedBy.toLowerCase()
            return name.includes(search)
          }).map((v, i) => {
            return (
              <Card className={classes.card} key={i}>
                <div className={classes.cardDetails}>
                  <CardContent>
                    <Typography variant="subtitle1">
                      <b>Added By:</b> {v.addedBy}
                    </Typography>
                    <Typography variant="subtitle1">
                      <b>Against:</b> {v.username}
                    </Typography>
                    <Typography variant="subtitle1" paragraph>
                      <b>Description:</b> {v.description}
                    </Typography>
                  </CardContent>
                </div>
              </Card>
            )
          })
          }
        </div>
        :
        <Typography variant="h5" className="text-center">There are no complaints yet</Typography>
      }
    </Container>
  )
}