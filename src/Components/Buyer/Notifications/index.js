
import React, { useEffect, useState } from 'react'
import firebase from '../../../config/firebase'
import { Paper, Typography, makeStyles, CardActionArea, Button } from '@material-ui/core'
import { useDispatch } from 'react-redux'
import { setCurrentProduct } from '../../../redux/action'
import { useHistory } from 'react-router-dom'


//For Styles
const useStyles = makeStyles((theme) => ({

    root: {
        padding: 20,
        paddingTop: 0,
        width: 500
    },
    paper: {
        padding: 20,
    },
    actionarea: {
        marginTop: 20
    },
    button: {
        marginTop: 10,
        float: "right",
        marginBottom: 10
    }
}))


export default function Notifications(props) {
    const classes = useStyles()
    const [notifications, setNotifications] = useState([])
    const dispatch = useDispatch();
    const history = useHistory()

    //Get all notifications from database
    useEffect(() => {
        firebase.database().ref(`users/Buyer/${firebase.auth().currentUser.uid}`).on("value", (snapshot) => {
            if(snapshot.exists()){
            if (snapshot.val().notifications) {
                setNotifications(Object.values(snapshot.val().notifications).reverse())
            }
        }
        })
    })

    //Save Product info in redux state and go to Checkout page
    const goToCheckout = (pid, index) => {
        firebase.database().ref(`products/${pid}`).on("value", (snapshot) => {
            var newObj = {
                name: snapshot.val().name,
                description: snapshot.val().description,
                initialPrice: snapshot.val().initialPrice,
                bidPrice: snapshot.val().bidPrice,
                condition: snapshot.val().condition,
                uploadedBy: snapshot.val().uploadedBy,
                key: snapshot.key,
                urls: snapshot.val().urls,
                notificationIndex: notifications.length - index - 1
            }
            dispatch(setCurrentProduct(newObj))
            history.push("/buyerdashboard/checkout")
            props.onClose()
        })

    }

    //Delete all notifications from database
    const clearAll = () => {
        firebase.database().ref(`users/Buyer/${firebase.auth().currentUser.uid}/notifications`).remove()
        props.onClose()
        
    }

    return (
        <div className={classes.root}>
            {notifications.length > 0 && <Button className={classes.button} onClick={clearAll}>Clear All</Button>}
            {notifications.length == 0 ?
                <Typography variant="subtitle1" className="text-center mt-4">There are no notifications to show</Typography>
                :
                notifications.map((v, i) => {
                    return (
                        <>
                        {v.type=="normal" && <CardActionArea onClick={() => { goToCheckout(v.pid, i) }} key={i} className={classes.actionarea}>
                            <Paper className={classes.paper}>
                              <Typography variant="subtitle1">
                                    <b>{v.username}</b> has accepted your bid for <b>{v.itemName}.</b> Click to proceed.
          </Typography>
                            </Paper>
                        </CardActionArea>}

                        {v.type=="auction ended" && <CardActionArea key={i} className={classes.actionarea}>
                            <Paper className={classes.paper}>
                              <Typography variant="subtitle1">
                                    The auction for <b>{v.itemName}</b> has been ended by <b>Admin</b>
          </Typography>
                            </Paper>
                        </CardActionArea>}
                        </>
                    )
                })
            }
        </div>
    )
}