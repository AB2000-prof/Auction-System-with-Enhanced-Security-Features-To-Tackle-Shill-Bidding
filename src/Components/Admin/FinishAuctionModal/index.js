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

  //End Auction Without selling the product to anyone
  const onSubmit = () => {
    firebase.database().ref(`products/${props.product.key}`).update({
      status: "Ended By Admin"
    })
    firebase.database().ref(`products/${props.product.key}`).on("value",snapshot=>{
      if(snapshot.exists()){
        var userIDs = []
        Object.values(snapshot.val().bids).map((bids)=>{
          if(!userIDs.includes(bids.madeBy)){
            userIDs.push(bids.madeBy)
          }
        })
        firebase.database().ref(`users/Seller/${props.product.uploadedBy}/notifications`).push({
          itemName: props.product.name,
          pid: props.product.key,
          time: Date(),
          type: "auction ended"
        })

        firebase.database()
        .ref('users/Seller')
        .child(props.product.uploadedBy)
        .child('newNotifications')
        .set(firebase.database.ServerValue.increment(1))


        userIDs.map((id,index)=>{ 
          firebase.database().ref(`users/Buyer/${id}/notifications`).push({
            itemName: props.product.name,
            pid: props.product.key,
            time: Date(),
            type: "auction ended"
          })
          firebase.database()
                .ref('users/Buyer')
                .child(id)
                .child('newNotifications')
                .set(firebase.database.ServerValue.increment(1))
        }
        )
        console.log(userIDs,"IDS")
      }
    })

    props.closeModal()
  }


  return (
    <div>
      <Modal isOpen={props.isOpen} centered unmountOnClose toggle={props.closeModal}>
        <ModalBody>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <Typography variant="subtitle1">Are you sure you want to finish auction for <b>{props.product.name}</b>? It won't be sold to anyone.</Typography>
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