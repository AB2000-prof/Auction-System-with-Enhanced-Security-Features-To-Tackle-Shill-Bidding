import { Paper, Typography, Button, Container, Grid } from '@material-ui/core'
import { makeStyles } from '@material-ui/core/styles';
import React, { useState } from 'react'
import firebase from '../../../config/firebase'
import { useSelector } from 'react-redux'
import { Link } from 'react-router-dom'
import { Alert } from 'reactstrap'

//For Styles
const useStyles = makeStyles((theme) => ({
    paper: {
        marginTop: theme.spacing(20),
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        padding: 20
    },
    avatar: {
        margin: theme.spacing(1),
        backgroundColor: theme.palette.primary.main,
    },
    form: {
        width: '100%', // Fix IE 11 issue.
        marginTop: theme.spacing(1),
    },
    submit: {
        margin: theme.spacing(3, 0, 2),
    },
    price: {
        color: "#4b8b3b"
    }
}));

export default function Checkout() {
    const classes = useStyles()
    const product = useSelector(state => state.setCurrentProduct)
    const [confirmed, setConfirmed] = useState(false)
    const [errors, setErrors] = useState([])


    //Check if user has enough money in their wallet. If yes, buy the product and remove the notification.
    const onConfirm = () => {
        var allErrors = []
        firebase.database().ref(`users/Buyer/${firebase.auth().currentUser.uid}`).once("value", (snapshot) => {
            if(snapshot.exists()){
            if (snapshot.val().wallet > product.bidPrice) {
                firebase.database().ref(`users/Buyer/${firebase.auth().currentUser.uid}`).child('wallet').set(firebase.database.ServerValue.increment(product.bidPrice * -1))
                firebase.database().ref(`users/Buyer/${firebase.auth().currentUser.uid}/notifications/${product.notificationIndex}`).remove()
                setConfirmed(true)
            }
            else {
                allErrors.push("You don't have enough balance in your wallet. Please contact admin")
            }
            }
        })
        setErrors(allErrors)
        setTimeout(() => {
            setErrors([])
        }, 4000);
    }

    return (
        <div>
            <Container component="main" maxWidth="xs">
                <Paper className={classes.paper}>
                    {confirmed ?
                        <div>
                            <Typography variant="h5">Congratulations, you have bought {product.name} for {product.bidPrice}$</Typography>
                            <Typography variant="subtitle1">Thanks for your purchase</Typography>
                            <Link to="/buyerdashboard"><Button className={classes.submit} variant="contained" color="primary" fullWidth>Go To Homepage</Button></Link>
                        </div>
                        : <div>
                            <Typography variant="h5">Congratulations, you have won the bid for {product.name}</Typography>
                            <Typography variant="subtitle1">Press the button below to Confirm your purchase for <b className={classes.price}>{product.bidPrice}$</b></Typography>
                            <Button className={classes.submit} variant="contained" color="primary" fullWidth onClick={onConfirm}>Confirm</Button>
                        </div>}
                    {
                        errors.map((error, index) => (
                            <Grid item key={index} xs={12}>
                                <Alert color="danger">
                                    {error}
                                </Alert>
                            </Grid>
                        ))
                    }
                </Paper>
            </Container>
        </div>
    )
}