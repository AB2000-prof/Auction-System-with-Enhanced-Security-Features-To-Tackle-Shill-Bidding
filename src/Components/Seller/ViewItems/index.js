import React, { useEffect, useState } from 'react';
import Button from '@material-ui/core/Button'
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import CardMedia from '@material-ui/core/CardMedia';
import CssBaseline from '@material-ui/core/CssBaseline';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';
import firebase from '../../../config/firebase'
import { Link,useHistory } from 'react-router-dom';
import { useDispatch } from 'react-redux'
import { setCurrentProduct } from '../../../redux/action'
import publicIp from "public-ip";

//For Styles
const useStyles = makeStyles((theme) => ({
    icon: {
        marginRight: theme.spacing(2),
    },
    heroContent: {
        backgroundColor: theme.palette.background.paper,
        padding: theme.spacing(8, 0, 6),
    },
    heroButtons: {
        marginTop: theme.spacing(4),
    },
    cardGrid: {
        paddingTop: theme.spacing(8),
        paddingBottom: theme.spacing(8),
    },
    card: {
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
    },
    cardMedia: {
        paddingTop: '56.25%', // 16:9
    },
    cardContent: {
        flexGrow: 1,
    },
    price:{
        color:"#4b8b3b",
        fontWeight:"600"
    },
    sold:{
        color:"red"
    }
}));

const getClientIp = async () => await publicIp.v4({
    fallbackUrls: [ "https://ifconfig.co/ip" ]
  });

const cards = [1, 2, 3, 4, 5, 6, 7, 8, 9];

export default function ViewItems() {
    const classes = useStyles();
    const history = useHistory();
    const dispatch = useDispatch();
    const [products, setProducts] = useState([])
    const [keys, setKeys] = useState([])


//Get Products from database that are uploaded by the user. Update IP of Seller
    useEffect(() => {

        getClientIp().then((result)=>{
            firebase.database().ref("/users/Seller").child(firebase.auth().currentUser.uid).update({
                lastIp:result
            })
        })

        firebase.database().ref("/products").orderByChild("uploadedBy").equalTo(firebase.auth().currentUser.uid).on("value", (snapshot) => {  
            if(snapshot.exists()){
            var keys = Object.keys(snapshot.val())
            var array = Object.values(snapshot.val())
            var newArray = []
            array.map((v,i)=>{
                var newObj;
                if(v.status=="active"){
                if(!((new Date()-Date.parse(v.timeStamp))/1000/60<v.time)){
                    firebase.database().ref(`/products/${keys[i]}`).update({
                        status:"Time Ended"
                    })
                    newObj = {
                        name:v.name,
                        description:v.description,
                        initialPrice:v.initialPrice,
                        bidPrice:v.bidPrice,
                        condition:v.condition,
                        key:keys[i],
                        urls:v.urls,
                        status:"Time Ended"
                    }
                }
                else{
                    newObj = {
                        name:v.name,
                        description:v.description,
                        initialPrice:v.initialPrice,
                        bidPrice:v.bidPrice,
                        condition:v.condition,
                        key:keys[i],
                        urls:v.urls,
                        timeRemaining:(v.time-((new Date()-Date.parse(v.timeStamp))/1000/60)).toFixed(1),
                        status:v.status
                    }
                }
            }
            else{
                newObj = {
                    name:v.name,
                    description:v.description,
                    initialPrice:v.initialPrice,
                    bidPrice:v.bidPrice,
                    condition:v.condition,
                    key:keys[i],
                    urls:v.urls,
                    status:v.status
                }
            }
             
                newArray.push(newObj)
            })
            setProducts(newArray)
        }
        })   
    },[])

//Save Product info in redux and go to product page
    const goToProductPage = (card,i) => {
        dispatch(setCurrentProduct(card))
        history.push(`/sellerdashboard/product`)
    }




    return (
        <React.Fragment>
            <CssBaseline />
            <main>
                {/* Hero unit */}
                <div className={classes.heroContent}>
                    <Container maxWidth="sm">
                        <Typography component="h1" variant="h2" align="center" color="textPrimary" gutterBottom>
                            All Products
            </Typography>
                        <Typography variant="h5" align="center" color="textSecondary" paragraph>
                            Here you can see all the products that you have uploaded for auction
            </Typography>
                    </Container>
                </div>
                <Container className={classes.cardGrid} maxWidth="md">
                    {/* End hero unit */}
                    {!products[0] ?
                    <div className="text-center">
                        <Typography variant="h6">
                            You haven't added any products yet. Click the button below to add your first product
                        </Typography>
                        <Link to="/sellerdashboard/additem">
                        <Button className="mt-4" variant="contained" color="primary">
                        Add A Product
                        </Button>
                        </Link>
                    </div>
                    :
                    <Grid container spacing={4}>
                        {products.map((card, i) => {
                            return(
                            <Grid item key={i} xs={12} sm={6} md={4}>
                                <Card className={classes.card}>
                                    <CardMedia
                                        className={classes.cardMedia}
                                        image={card.urls[0]}
                                        title={card.name}
                                    />
                                    <CardContent className={classes.cardContent}>
                                        <Typography variant="h5" component="h2">
                                            {card.name}
                                        </Typography>
                                        <Typography gutterBottom variant="body1" component="p" className={classes.price}>
                                            {card.initialPrice}$
                                        </Typography >
                                        <Typography gutterBottom variant="body1" component="p">
                                            Status: <b className={card.status==="active" ? classes.price : classes.sold}>{card.status}</b>
                                        </Typography >
                                        <Typography>
                                        <b>Description:</b> {card.description.substring(0, 50)}{"..."}
                                        </Typography>
                                    </CardContent>
                                    <CardActions>
                                        <Button onClick={() => goToProductPage(card,i)} size="small" color="primary">
                                            View
                    </Button>
                                    </CardActions>
                                </Card>
                            </Grid>
                            )
                        })
                    }
                    </Grid>}
                </Container>
            </main>
        </React.Fragment>
    );
}