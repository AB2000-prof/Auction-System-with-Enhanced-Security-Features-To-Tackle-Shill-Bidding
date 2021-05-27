import { Paper, Typography, makeStyles, CardActionArea, Button } from '@material-ui/core'
import React, { useEffect, useState } from 'react'
import firebase from '../../../config/firebase'
import { useHistory } from 'react-router-dom';
import { useDispatch } from 'react-redux'
import { setCurrentProduct } from '../../../redux/action'


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
    const history = useHistory()
    const [notifications, setNotifications] = useState([])
    const dispatch = useDispatch();

    //Get all notifications from database
    useEffect(() => {
        firebase.database().ref(`users/Seller/${firebase.auth().currentUser.uid}`).once("value", (snapshot) => {
            if(snapshot.exists()){
            if (snapshot.val().notifications) {
                setNotifications(Object.values(snapshot.val().notifications).reverse())
            }
        }
        })
    }, [])

    //Save Product info in redux state and go to Product page
    const goToProductPage = (pid) => {
        firebase.database().ref(`products/${pid}`).on("value", (snapshot) => {
            var newObj = {
                name: snapshot.val().name,
                description: snapshot.val().description,
                initialPrice: snapshot.val().initialPrice,
                bidPrice: snapshot.val().bidPrice,
                condition: snapshot.val().condition,
                uploadedBy: snapshot.val().uploadedBy,
                key: pid,
                urls: snapshot.val().urls,
                status: snapshot.val().status
            }
            dispatch(setCurrentProduct(newObj))
            history.push("/sellerdashboard/product")
            props.onClose()
        })
    }


    //Delete all notifications from database
    const clearAll = () => {
        firebase.database().ref(`users/Seller/${firebase.auth().currentUser.uid}/notifications`).remove()
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

                        <CardActionArea onClick={() => { goToProductPage(v.pid) }} key={i} className={classes.actionarea}>
                            <Paper className={classes.paper}>
                                {v.type == "normal" && <Typography variant="subtitle1">
                                    <b>{v.uid}</b> has placed a bid on <b>{v.itemName}</b>
                                </Typography>}
                                {v.type == "shill" && <Typography variant="subtitle1">
                                    <b>{v.uid}</b> is possibly shill bidding on <b>{v.itemName}</b>
                                </Typography>}
                                {v.type == "auction ended" && <Typography variant="subtitle1">
                                The auction for <b>{v.itemName}</b> was ended by <b>Admin</b>
                                </Typography>}
                            </Paper>
                        </CardActionArea>
                    )
                })
            }
        </div>
    )
}