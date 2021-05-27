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
import BiddingLogModal from '../ProductBiddingLogModal'

//For Styles
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
  const [currentRow, setCurrentRow] = useState({})
  const [logModal, setLogModal] = useState(false)
  const [dummyState, setDummyState] = useState(1)

  //Get All Flagged Bids and then get product information.
  useEffect(() => {
    var allFlaggedProducts = []
    firebase.database().ref("shillBids/time").once("value", snapshot => {
      if (snapshot.exists()) {
        Object.values(snapshot.val()).map((v, i) => {
          if (v.type == "time") {
            var products;
            firebase.database().ref(`products/${v.productID}`).once("value", product => {
              products = {
                productName: product.val().name,
                noOfBids: product.val().bids ? product.val().bids.length : 0,
                initialPrice: product.val().initialPrice,
                bidPrice: product.val().bidPrice,
                uploadedBy: product.val().uploadedBy,
                quarter: v.quarter,
                bids: product.val().bids
              }
              allFlaggedProducts.push(products)
              setFlaggedBuyers(allFlaggedProducts)
              setDummyState(i)
            })
          }
        })
      }
    })
  }, [])

  const viewBiddingLog = (row) => {
    setCurrentRow(row)
    setLogModal(true)
  }

  const toggleLogModal = (state) => {
    setLogModal(state)
  }

  return (
    <div>
      <Container className={classes.root} maxWidth="xl">
        {flaggedBuyers.length == 0 ?
          <Typography variant="h5" className="text-center">No Products Flagged Yet</Typography>
          : <Paper>
            <TableContainer>
              <Table className={classes.table} aria-label="simple table">
                <TableHead>
                  <TableRow>
                    <TableCell>Product Name</TableCell>
                    <TableCell>Initial Price</TableCell>
                    <TableCell>Max Bid</TableCell>
                    <TableCell align="right">No Of Bids</TableCell>
                    <TableCell align="right">Uploaded By</TableCell>
                    <TableCell align="right">Quarter</TableCell>
                    <TableCell align="right">Bids Log</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {flaggedBuyers.map((row, i) => (
                    <TableRow key={i}>
                      <TableCell component="th" scope="row">
                        {row.productName}
                      </TableCell>
                      <TableCell>{row.initialPrice}$</TableCell>
                      <TableCell>{row.bidPrice}$</TableCell>
                      <TableCell align="right">{row.noOfBids}</TableCell>
                      <TableCell align="right">{row.uploadedBy}</TableCell>
                      <TableCell align="right">{row.quarter}</TableCell>
                      <TableCell align="right"><Button variant="contained" color="primary" onClick={() => viewBiddingLog(row)}>View</Button></TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Paper>}
        {logModal && <BiddingLogModal modal={logModal} setModal={toggleLogModal} product={currentRow} />}
      </Container>
    </div>
  )
}