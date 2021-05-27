import { Typography, Grid, TextField, Button } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import React, { useState } from 'react';
import firebase from '../../../config/firebase'
import { Modal, ModalHeader, ModalBody, Alert } from 'reactstrap';


//For Styles
const useStyles = makeStyles((theme) => ({
  submit: {
    margin: theme.spacing(3, 0, 2),
  },
  text: {
    color: "gray",
    marginLeft: 10
  }
}))

const MakeBidModal = (props) => {
  const classes = useStyles()
  var bidPrice = parseInt(props.product.bidPrice)
  var initialPrice = parseInt(props.product.initialPrice)
  const [bid, setBid] = useState(0)
  const [errors, setErrors] = useState([])

  //Handle change of bid input and save in state
  const handleChange = (e) => {
    setBid(e.target.value)
  }

  //Check if user has enough money to make the bid and then make the bid. Otherwise throw error. Also send notification to the seller
  const onSubmit = () => {
    var allErrors = []
    if (!bid) {
      allErrors.push("Bid Amount Is Required")
    }
    else {
      if ((bid < bidPrice + ((props.bids.length > 0 ? props.bids[0].amount : initialPrice) / 100 * 2)) || (bid > bidPrice + ((props.bids.length > 0 ? props.bids[0].amount : initialPrice) / 100 * 10))) {
        allErrors.push(`Enter between ${bidPrice + ((props.bids.length > 0 ? props.bids[0].amount : initialPrice) / 100 * 2)}$ and ${bidPrice + ((props.bids.length > 0 ? props.bids[0].amount : initialPrice) / 100 * 10)}$`)
      }
      else {
        firebase.database().ref(`users/Buyer/${firebase.auth().currentUser.uid}`).once("value", (user) => {
          if(user.exists()){
          if (user.val().wallet > bid) {
            var allBids = []
            var allNotifications = []
            allBids.push({
              amount: bid,
              madeBy: firebase.auth().currentUser.uid
            })
            firebase.database().ref(`products/${props.product.key}`).once("value", (snapshot) => {
              if (snapshot.val().bids) {
                var bidsFromDatabase = Object.values(snapshot.val().bids)
                detectShillBidByBuyer(bidsFromDatabase)
                detectShillBidByTime(snapshot)

                bidsFromDatabase.map((v) => {
                  allBids.push(v)
                })
                firebase.database().ref(`products/${props.product.key}`).update({
                  bids: allBids,
                  bidPrice: bid
                })
                firebase.database().ref(`users/Buyer/${firebase.auth().currentUser.uid}`).once("value", (user) => {
                  if (user.val().bidOn) {
                    var allBidsOn = []
                    var bidOnFromDatabase = Object.values(user.val().bidOn)
                    if (!bidOnFromDatabase.includes(props.product.key)) {
                      allBidsOn.push(props.product.key)
                      bidOnFromDatabase.map((v) => {
                        allBidsOn.push(v)
                      })
                      firebase.database().ref(`users/Buyer/${firebase.auth().currentUser.uid}`).update({
                        bidOn: allBidsOn
                      })
                    }

                  }
                  else {
                    console.log("bib")
                    var allBidsOn = []
                    allBidsOn.push(props.product.key)
                    firebase.database().ref(`users/Buyer/${firebase.auth().currentUser.uid}`).update({
                      bidOn: allBidsOn,
                    })
                  }
                })
              }
              else {
                detectShillBidByBuyerWithoutBids()

                firebase.database().ref(`users/Buyer/${firebase.auth().currentUser.uid}`).once("value", (user) => {
                  if (user.val().bidOn) {
                    var allBidsOn = []
                    var bidOnFromDatabase = Object.values(user.val().bidOn)
                    if (!bidOnFromDatabase.includes(props.product.key)) {
                      allBidsOn.push(props.product.key)
                      bidOnFromDatabase.map((v) => {
                        allBidsOn.push(v)
                      })
                      firebase.database().ref(`users/Buyer/${firebase.auth().currentUser.uid}`).update({
                        bidOn: allBidsOn
                      })
                    }

                  }
                  else {
                    console.log("bib")
                    var allBidsOn = []
                    allBidsOn.push(props.product.key)
                    firebase.database().ref(`users/Buyer/${firebase.auth().currentUser.uid}`).update({
                      bidOn: allBidsOn,
                    })
                  }
                })
                firebase.database().ref(`products/${props.product.key}`).update({
                  bids: allBids,
                  bidPrice: bid
                })
              }



              firebase.database().ref(`users/Seller/${props.product.uploadedBy}/notifications`).push({
                uid: firebase.auth().currentUser.uid,
                itemName: props.product.name,
                pid: props.product.key,
                time: Date(),
                type: "normal"
              })

              firebase.database()
                .ref('users/Seller')
                .child(props.product.uploadedBy)
                .child('newNotifications')
                .set(firebase.database.ServerValue.increment(1))
              firebase.database()
                .ref('users/Buyer')
                .child(firebase.auth().currentUser.uid)
                .child('totalBids')
                .set(firebase.database.ServerValue.increment(1))
            })
            props.closeModal()
          }
          else {
            allErrors.push("You don't have enough balance in your wallet")
          }
        }
        })

      }
    }
    setErrors(allErrors)
    setTimeout(() => {
      setErrors([])
    }, 4000);
  }

  //Detect shill bid by time. If amount has increased by 50% in first quarter or 100% in second quarter or 150% in third quarter or 200% in 4th quarter, flag it and send to admin
  const detectShillBidByTime = (snapshot) => {
    var quarterTime = snapshot.val().time / 4
    var timeSpent = (new Date() - Date.parse(snapshot.val().timeStamp)) / 1000 / 60
    if (timeSpent < quarterTime) {
      var percentageIncrease = (bid / (snapshot.val().initialPrice / 100)) - 100
      if (percentageIncrease > 50) {
        firebase.database().ref(`/shillBids/time`).orderByChild("productID").equalTo(props.product.key).once("value", (snapshot) => {
          if (!snapshot.exists()) {
            firebase.database().ref("shillBids/time").push({
              productID: props.product.key,
              type: "time",
              quarter: "1st"
            })
          }
        })
      }
    }
    else if (timeSpent < quarterTime * 2) {
      var percentageIncrease = (bid / (snapshot.val().initialPrice / 100)) - 100
      if (percentageIncrease > 100) {
        firebase.database().ref(`/shillBids/time`).orderByChild("productID").equalTo(props.product.key).once("value", (snapshot) => {
          if (!snapshot.exists()) {
            firebase.database().ref("shillBids/time").push({
              productID: props.product.key,
              type: "time",
              quarter: "2nd"
            })
          }
        })
      }
    }
    else if (timeSpent < quarterTime * 3) {
      var percentageIncrease = (bid / (snapshot.val().initialPrice / 100)) - 100
      if (percentageIncrease > 150) {
        firebase.database().ref(`/shillBids/time`).orderByChild("productID").equalTo(props.product.key).once("value", (snapshot) => {
          if (!snapshot.exists()) {
            firebase.database().ref("shillBids/time").push({
              productID: props.product.key,
              type: "time",
              quarter: "3rd"
            })
          }
        })
      }
    }
    else if (timeSpent < quarterTime * 4) {
      var percentageIncrease = (bid / (snapshot.val().initialPrice / 100)) - 100
      if (percentageIncrease > 200) {
        firebase.database().ref(`/shillBids/time`).orderByChild("productID").equalTo(props.product.key).once("value", (snapshot) => {
          if (!snapshot.exists()) {
            firebase.database().ref("shillBids/time").push({
              productID: props.product.key,
              type: "time",
              quarter: "4th"
            })
          }
        })
      }
    }
  }

  //If a buyer puts 4 or more bids which have more than 8% increase, flag that buyer and send to admin. Also send notification to seller
  const detectShillBidByBuyer = (bidsFromDatabase) => {
    var lastAmount = bidsFromDatabase[0].amount
    var currentAmount = bid
    var percentageIncrease = (currentAmount / (lastAmount / 100)) - 100
    if (percentageIncrease > 8) {
      firebase.database().ref(`/users/Buyer/${firebase.auth().currentUser.uid}/shillAttempts`).orderByChild("productID").equalTo(props.product.key).once("value", (snapshot) => {
        if (snapshot.exists()) {
          if (!Object.values(snapshot.val())[0].shillBidder) {
            console.log(snapshot.val()[0], "ahaha")
            if (Object.values(snapshot.val())[0].shillCount > 2) {
              firebase.database().ref("shillBids/buyer").push({
                productID: props.product.key,
                userId: firebase.auth().currentUser.uid,
                type: "buyer"
              })
              firebase.database()
                .ref('/users/Buyer/')
                .child(firebase.auth().currentUser.uid)
                .child('shillAttempts')
                .child(Object.keys(snapshot.val())[0])
                .update({ shillBidder: true })

              firebase.database().ref(`users/Seller/${props.product.uploadedBy}/notifications`).push({
                uid: firebase.auth().currentUser.uid,
                itemName: props.product.name,
                pid: props.product.key,
                time: Date(),
                type: "shill"
              })

              firebase.database()
                .ref('users/Seller')
                .child(props.product.uploadedBy)
                .child('newNotifications')
                .set(firebase.database.ServerValue.increment(1))
            }
            firebase.database()
              .ref('/users/Buyer/')
              .child(firebase.auth().currentUser.uid)
              .child('shillAttempts')
              .child(Object.keys(snapshot.val())[0])
              .update({ shillCount: firebase.database.ServerValue.increment(1) })
          }
        }
        else {
          firebase.database().ref(`/users/Buyer/${firebase.auth().currentUser.uid}/shillAttempts`).push({
            productID: props.product.key,
            shillCount: 1
          })
        }
      })

    }
  }

  //If a buyer puts 4 or more bids which have more than 8% increase, flag that buyer and send to admin. Also send notification to seller. 
  const detectShillBidByBuyerWithoutBids = () => {
    var lastAmount = initialPrice
    var currentAmount = bid
    var percentageIncrease = (currentAmount / (lastAmount / 100)) - 100
    if (percentageIncrease > 8) {
      firebase.database().ref(`/users/Buyer/${firebase.auth().currentUser.uid}/shillAttempts`).orderByChild("productID").equalTo(props.product.key).once("value", (snapshot) => {
        if (snapshot.exists()) {
          firebase.database()
            .ref('/users/Buyer/')
            .child(firebase.auth().currentUser.uid)
            .child('shillAttempts')
            .child(Object.keys(snapshot.val())[0])
            .update({ shillCount: firebase.database.ServerValue.increment(1) })
        }
        else {
          firebase.database().ref(`/users/Buyer/${firebase.auth().currentUser.uid}/shillAttempts`).push({
            productID: props.product.key,
            shillCount: 1
          })
        }
      })

    }
  }


  return (
    <div>
      <Modal isOpen={props.isOpen} centered unmountOnClose toggle={props.closeModal}>
        <ModalHeader>
          <Typography variant="h5">Make A Bid</Typography>
        </ModalHeader>
        <ModalBody>
          <Grid container spacing={2}>
            <Typography className={classes.text} variant="body1">Current Bid: {bidPrice}$</Typography>
            <Grid item xs={12}>
              <TextField
                variant="outlined"
                required
                fullWidth
                id="bid"
                label="Bid"
                name="bid"
                onChange={handleChange}
              />
            </Grid>
            <Typography variant="body1" className={classes.text}>
              Enter between {bidPrice + ((props.bids.length > 0 ? props.bids[0].amount : initialPrice) / 100 * 2)}$ and {bidPrice + ((props.bids.length > 0 ? props.bids[0].amount : initialPrice) / 100 * 10)}$
                        </Typography>
            {
              errors.map((error, index) => (
                <Grid item key={index} xs={12}>
                  <Alert color="danger">
                    {error}
                  </Alert>
                </Grid>
              ))
            }
            <Button
              type="submit"
              fullWidth
              variant="contained"
              color="primary"
              className={classes.submit}
              onClick={onSubmit}
            >
              Make A Bid
          </Button>
          </Grid>
        </ModalBody>
      </Modal>
    </div>
  );
}

export default MakeBidModal;