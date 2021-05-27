
import React, { useEffect, useState } from 'react';
import { Modal, ModalHeader, ModalBody } from 'reactstrap';
import { makeStyles } from "@material-ui/core/styles";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import firebase from '../../../config/firebase'

//For Styles
const useStyles = makeStyles((theme) => ({
  table: {
    minWidth: 650
  },
  tablecontainer: {
    maxHeight: "70vh"
  }
}))


export default function BiddingLogModal(props) {


  const classes = useStyles();
  var modal = props.modal
  const toggle = () => props.setModal(!modal);
  const [logProducts, setLogProducts] = useState([])
  const [dummyState, setDummyState] = useState(1)

  //Get Products on which the user has bid, Then get bids of selected buyer on that product
  useEffect(() => {
    var allProducts = []
    if (props.modal) {
      firebase.database().ref(`/users/Buyer/${props.user.key}/bidOn`).once("value", (snapshot) => {
        if (snapshot.exists()) {

          var allProductsFromDatabase = Object.values(snapshot.val())

          allProductsFromDatabase.map((v, i) => {
            firebase.database().ref(`products/${v}`).once("value", (product) => {
              var allBids = product.val().bids
              var product = product.val()
              allProducts.unshift(product)
              console.log(allProducts)
              setLogProducts(allProducts)
              setDummyState(i)
            })
          })
        }
      })

    }
  }, [])


  return (
    <Modal size="lg" centered isOpen={modal} toggle={toggle}>
      <ModalHeader toggle={toggle}>Bidding Log of {props.user.username}</ModalHeader>
      <ModalBody>
        <TableContainer className={classes.tablecontainer}>
          <Table className={classes.table} aria-label="simple table">
            <TableHead>
              <TableRow>
                <TableCell>Product</TableCell>
                <TableCell align="right">Original Price</TableCell>
                <TableCell align="right">Bid Amount</TableCell>
                <TableCell align="right">Increase in %</TableCell>
              </TableRow>
            </TableHead>
            <TableBody className={classes.tablecontainer}>
              {logProducts.map((product, i) => {
                return (
                  product.bids && product.bids.map((v, j) => {
                    return (
                      <>
                        {v.madeBy == props.user.key &&
                          <TableRow key={j}>
                            <TableCell>{product.name}</TableCell>
                            <TableCell align="right">{product.initialPrice}$</TableCell>
                            <TableCell align="right">{v.amount}$</TableCell>
                            <TableCell align="right">{j == product.bids.length - 1 ? ((v.amount / (product.initialPrice / 100)) - 100).toFixed(2) + "%" : ((v.amount / (product.bids[j + 1].amount / 100)) - 100).toFixed(2) + "%"}</TableCell>
                          </TableRow>
                        }
                      </>
                    )
                  })
                )


              })}
            </TableBody>
          </Table>
        </TableContainer>
      </ModalBody>
    </Modal>
  )
}