import { Typography, Grid, TextField, Button } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import React, { useEffect, useState } from 'react';
import firebase from '../../../config/firebase'
import { Modal, ModalHeader, ModalBody, Alert } from 'reactstrap';


//For Styles
const useStyles = makeStyles((theme) => ({
  submit: {
    margin: theme.spacing(0, 0, 2),
  },
  text: {
    color: "gray",
    marginLeft: 10
  },
  price: {
    color: "#4b8b3b",
    fontWeight: "600"
  }
}))

const FinishAuctionModal = (props) => {
  const classes = useStyles()
  var bidPrice = parseInt(props.product.bidPrice)
  var initialPrice = parseInt(props.product.initialPrice)
  const [bid, setBid] = useState(0)
  const [errors, setErrors] = useState([])

  //Set status of product to sold and send notification to the highest bidder. If no bids are there, end it without selling to anyone
  const onSubmit = () => {
    if (props.bids.length > 0) {
      var allNotifications = []
      firebase.database().ref(`products/${props.product.key}`).update({
        status: "sold"
      })

      firebase.database().ref(`users/Seller/${firebase.auth().currentUser.uid}`).once("value", (user) => {
        if(user.exists()){
        firebase.database().ref(`users/Buyer/${props.bids[0].madeBy}/notifications`).push({
            uid: firebase.auth().currentUser.uid,
            username: user.val().username,
            itemName: props.product.name,
            pid: props.product.key,
            time: Date(),
            type:"normal"
          })
          firebase.database()
            .ref('users/Buyer')
            .child(props.bids[0].madeBy)
            .child('newNotifications')
            .set(firebase.database.ServerValue.increment(1))
          firebase.database()
            .ref('users/Buyer')
            .child(props.bids[0].madeBy)
            .child('wins')
            .set(firebase.database.ServerValue.increment(1))
        }    
      })
    }
    else {
      firebase.database().ref(`products/${props.product.key}`).update({
        status: "Ended by Seller"
      })
    }

    props.closeModal()
  }


  return (
    <div>
      <Modal isOpen={props.isOpen} centered unmountOnClose toggle={props.closeModal}>
        <ModalBody>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              {props.bids.length > 0 ? <Typography variant="subtitle1">Are you sure you want to finish auction by selling <b>{props.product.name}</b> to <b>{props.bids[0] && props.bids[0].madeBy}</b> for <b className={classes.price}>{bidPrice}$ </b>?</Typography>
                : <Typography variant="subtitle1">There Are No Bids Placed Yet. The product won't be sold to anyone. Are you sure you want to end this auction?</Typography>}
            </Grid>
            <Button
              type="submit"
              fullWidth
              variant="contained"
              color="primary"
              className={classes.submit}
              onClick={onSubmit}
            >
              Yes
          </Button>
            <Button
              type="submit"
              fullWidth
              variant="contained"
              color="secondary"
              className={classes.submit}
              onClick={props.closeModal}
            >
              No
          </Button>
          </Grid>
        </ModalBody>
      </Modal>
    </div>
  );
}

export default FinishAuctionModal;