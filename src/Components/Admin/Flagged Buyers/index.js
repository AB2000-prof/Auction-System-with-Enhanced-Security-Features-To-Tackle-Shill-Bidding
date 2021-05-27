import React, { useEffect, useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import Table from "@material-ui/core/Table";
import Button from "@material-ui/core/Button";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import Paper from "@material-ui/core/Paper";
import SearchBar from "material-ui-search-bar";
import Container from '@material-ui/core/Container';
import firebase from '../../../config/firebase'
import { Typography } from "@material-ui/core";

const useStyles = makeStyles((theme) => ({
  table: {
    minWidth: 650
  },
  searchBar: {
    marginTop: 30,
    marginBottom: 60
  },
  root: {
    paddingTop: theme.spacing(20),
    paddingBottom: theme.spacing(20),
  }
}))

export default function FlaggedBuyers() {
  const classes = useStyles();
  const [flaggedBuyers, setFlaggedBuyers] = useState([])
  const [dummyState, setDummyState] = useState(1)

  //Get All Flagged Bids and Then get buyer's information and product information.
  useEffect(() => {
    var allFlaggedBuyers = []
    firebase.database().ref("shillBids/buyer").once("value", snapshot => {
      if (snapshot.exists()) {
        Object.values(snapshot.val()).map((v, i) => {
          if (v.type == "buyer") {
            var buyer;
            firebase.database().ref(`products/${v.productID}`).once("value", product => {
              firebase.database().ref(`users/Buyer/${v.userId}`).once("value", user => {
                buyer = {
                  username: user.val().username,
                  productName: product.val().name,
                  lastIp: user.val().lastIp,
                  productsBidOn: user.val().bidOn ? user.val().bidOn.length : 0,
                  totalBids: user.val().totalBids ? user.val().totalBids : 0,
                  wins: user.val().wins ? user.val().wins : 0
                }
                allFlaggedBuyers.push(buyer)
                setFlaggedBuyers(allFlaggedBuyers)
                setDummyState(i)
              })
            })
          }
        })
      }
    })
  }, [])

  return (
    <div>
      <Container className={classes.root} maxWidth="xl">
        {flaggedBuyers.length == 0 ?
          <Typography variant="h5" className="text-center">No Buyers Flagged Yet</Typography>
          : <Paper>
            <TableContainer>
              <Table className={classes.table} aria-label="simple table">
                <TableHead>
                  <TableRow>
                    <TableCell>User Name</TableCell>
                    <TableCell align="right">Flagged On Product</TableCell>
                    <TableCell align="right">Last IP Address</TableCell>
                    <TableCell align="right">Products Bid On</TableCell>
                    <TableCell align="right">Total Bids</TableCell>
                    <TableCell align="right">Total Wins</TableCell>
                    <TableCell align="right">Winning Ratio</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {flaggedBuyers.map((row, i) => (
                    <TableRow key={i}>
                      <TableCell component="th" scope="row">
                        {row.username}
                      </TableCell>
                      <TableCell align="right">{row.productName}</TableCell>
                      <TableCell align="right">{row.lastIp}</TableCell>
                      <TableCell align="right">{row.productsBidOn}</TableCell>
                      <TableCell align="right">{row.totalBids}</TableCell>
                      <TableCell align="right">{row.wins}</TableCell>
                      <TableCell align="right">{row.wins+"/"}{row.productsBidOn}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Paper>}
      </Container>
    </div>
  )
}