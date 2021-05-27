
import React, { useEffect, useState } from 'react';
import { Modal, ModalHeader, ModalBody } from 'reactstrap';
import { makeStyles } from "@material-ui/core/styles";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import Paper from "@material-ui/core/Paper";
import Typography from "@material-ui/core/Typography";

//For Styles
const useStyles = makeStyles((theme) => ({
  table: {
    minWidth: 650
  },
  tablecontainer: {
    maxHeight: "70vh"
  }
}))


//Show Bidding Log Of The Selected Product
export default function BiddingLogModal(props) {
  const classes = useStyles();
  var modal = props.modal
  const toggle = () => props.setModal(!modal);

  return (
    <Modal size="lg" centered isOpen={modal} toggle={toggle}>
      <ModalHeader toggle={toggle}>Bidding Log of {props.product.productName}</ModalHeader>
      <ModalBody>
        <TableContainer className={classes.tablecontainer} component={Paper}>
          {props.product.bids.length == 0 ?
            <Typography variant="body1" className="my-3 text-center">There are no bids placed yet</Typography>
            :
            <Table className={classes.table} aria-label="simple table">
              <TableHead>
                <TableRow>
                  <TableCell>Bidder ID</TableCell>
                  <TableCell align="right">Amount</TableCell>
                  <TableCell align="right">Increase in %</TableCell>
                </TableRow>
              </TableHead>

              <TableBody>
                {props.product.bids.map((row, i) => (
                  <TableRow key={i}>
                    <TableCell>{row.madeBy}</TableCell>
                    <TableCell align="right" className={classes.price}>{row.amount}$</TableCell>
                    <TableCell align="right">{i == props.product.bids.length - 1 ? ((row.amount / (props.product.initialPrice / 100)) - 100).toFixed(2) + "%" : ((row.amount / (props.product.bids[i + 1].amount / 100)) - 100).toFixed(2) + "%"}</TableCell>
                  </TableRow>
                ))}
              </TableBody>

            </Table>}
        </TableContainer>
      </ModalBody>
    </Modal>
  )
}