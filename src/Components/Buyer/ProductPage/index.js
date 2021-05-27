import React, { useEffect, useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import Grid from '@material-ui/core/Grid';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import { useSelector } from 'react-redux'
import { Link } from 'react-router-dom'
import Carousel from 'react-material-ui-carousel'
import Button from '@material-ui/core/Button';
import MakeBidModal from '../MakeBidModal'
import firebase from '../../../config/firebase'
import { useDispatch } from 'react-redux'
import { setCurrentProduct } from '../../../redux/action'
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';


//For Styles
const useStyles = makeStyles({
  root: {
    display: "flex",
    justifyContent: "center",
    marginTop: 100
  },
  card: {
    display: 'flex',
    maxWidth: 1000,
  },
  table: {
    minWidth: 650,
    maxWidth: 1000
  },
  cardDetails: {
    flex: 1,
  },
  cardMedia: {
    width: 160,
  },
  price: {
    color: "#4b8b3b",
    fontWeight: "600"
  },
  container: {
    maxWidth: 1000,
    marginTop: 50
  },
  main: {
    display: "flex",
    justifyContent: "center",
  },
  title: {
    marginTop: 20,
    textAlign: "center",
    fontWeight: "700"
  },
  price: {
    color: "#4b8b3b",
    fontWeight: "600"
  }
});

function Item(props) {
  return (
    <div style={{ backgroundImage: `url(${props.item})`, width: "500px", height: "300px", backgroundRepeat: 'no-repeat', backgroundSize: "cover" }}></div>
  )
}


export default function FeaturedPost(props) {
  const classes = useStyles();
  const product = useSelector(state => state.setCurrentProduct)
  const [uploadedBy, setUploadedBy] = useState("")
  const [isOpen, setIsOpen] = useState(false)
  const [bids, setBids] = useState([])
  const [cards,setCards] = useState(false)
  const dispatch = useDispatch();


  //Get the username of user who uploaded the product. Get list of all bids on the selected product from database
  useEffect(() => {
    firebase.database().ref(`users/Seller/${product.uploadedBy}`).on("value", (snapshot) => {
      if(snapshot.exists()){
      setUploadedBy(snapshot.val().username)
    }
    })

    firebase.database().ref(`products/${product.key}`).on("value", (snapshot) => {
      if (snapshot.val().bids) {
        var allBids = []
        var bids = Object.values(snapshot.val().bids)
        bids.map((v, i) => {
          var newObj = {
            madeBy: v.madeBy,
            amount: v.amount,
            increase: i == bids.length - 1 ? ((v.amount / (product.initialPrice / 100)) - 100).toFixed(2) : ((v.amount / (bids[i + 1].amount / 100)) - 100).toFixed(2),
          }
          allBids.push(newObj)
        })
        setBids(allBids)
      }
    })
  }, [isOpen, product])


  //Close make bid Modal and update the page with new values from database
  const closeModal = () => {
    setTimeout(() => {
      firebase.database().ref(`products/${product.key}`).on("value", (snapshot) => {
        var newObj = {
          name: snapshot.val().name,
          description: snapshot.val().description,
          initialPrice: snapshot.val().initialPrice,
          bidPrice: snapshot.val().bidPrice,
          condition: snapshot.val().condition,
          uploadedBy: snapshot.val().uploadedBy,
          key: snapshot.key,
          urls: snapshot.val().urls,
          timeRemaining: snapshot.val().status == "active" ? (snapshot.val().time - ((new Date() - Date.parse(snapshot.val().timeStamp)) / 1000 / 60)).toFixed(1) : null
        }
        dispatch(setCurrentProduct(newObj))
      })
    }, 1000);

    setIsOpen(false)
  }


  useEffect(()=>{
    onWindowResize()
    window.addEventListener('resize', onWindowResize)

    return _ => {
      window.removeEventListener('resize', onWindowResize)   
}
  })

  useEffect(()=>{
    onWindowResize()
  },[])

  
  const onWindowResize=()=>{
    if(window.innerWidth>768){
      setCards(true)
    }
    else{
      setCards(false)
    }
  }


  return (
    <div>
      <Grid item xs={12} className={classes.root}>
        <Card className={cards && classes.card}>
          <Carousel>
            {
              product.urls.map((item, i) => <Item key={i} item={item} />)
            }
          </Carousel>
          <div className={classes.cardDetails}>
            <CardContent>
              <Typography component="h2" variant="h5">
                {product.name}
              </Typography>
              <Typography variant="body1">
                <b>Uploaded By:</b> {uploadedBy}
              </Typography>
              <Typography variant="subtitle1" className={classes.price}>
                {product.initialPrice}$
              </Typography>
              <Typography variant="subtitle1" className={classes.price}>
                Max Bid: {product.bidPrice}$
              </Typography>
              <Typography gutterBottom variant="subtitle1" paragraph={product.timeRemaining ? false : true}>
                <b>Condition:</b> {product.condition}
              </Typography>
              {product.timeRemaining && <Typography variant="subtitle1" paragraph>
              <b>Time Remaining:</b> {product.timeRemaining > 60 ? (product.timeRemaining/60).toFixed(1)+" Hours" : product.timeRemaining+" Minutes"}
              </Typography>}
              <Typography variant="subtitle1" paragraph style={{ wordBreak: "break-all" }}>
                <b>Description:</b><br />{product.description}
              </Typography>
              <Button variant="contained" onClick={() => setIsOpen(true)} color="primary">
                Make A Bid
</Button>
              <MakeBidModal isOpen={isOpen} product={product} closeModal={closeModal} bids={bids} />
            </CardContent>
          </div>

        </Card>

      </Grid>
      <Grid item xs={12} className={classes.main}>

        <TableContainer className={classes.container} component={Paper}>
          <Typography gutterBottom variant="h5" className={classes.title}>Bids On This Product</Typography>
          <div style={{ width: "100%", borderTop: "1px solid gray", marginTop: "20px", opacity: 0.2 }}></div>
          {bids.length == 0 ?
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
                {bids.map((row, i) => (
                  <TableRow key={i}>
                    <TableCell>{row.madeBy == firebase.auth().currentUser.uid ? "Me" : row.madeBy}</TableCell>
                    <TableCell align="right" className={classes.price}>{row.amount}$</TableCell>
                    <TableCell align="right">{row.increase}%</TableCell>
                  </TableRow>
                ))}
              </TableBody>

            </Table>}
        </TableContainer>
      </Grid>
    </div>
  );
}
