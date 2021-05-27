import React, { useEffect, useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import Table from "@material-ui/core/Table";
import Button from "@material-ui/core/Button";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import Paper from "@material-ui/core/Paper";
import SearchBar from "material-ui-search-bar";
import Container from '@material-ui/core/Container';
import Typography from '@material-ui/core/Typography';
import { Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';
import firebase from '../../../config/firebase'
import BiddingLogModal from '../BiddingLogModal/index'
import AddMoneyModal from '../AddMoneyModal'

//For styles, resizing accordingly
const useStyles = makeStyles((theme) => ({
  table: {
    minWidth: 650,
    overflow:"scroll"
  },
  searchBar: {
    marginTop: 30,
    marginBottom: 60
  },
  root: {
    paddingTop: theme.spacing(8),
    paddingBottom: theme.spacing(8),
  }
}))


export default function AllBuyers() {

  const [search, setSearch] = useState("")
  const [buyers, setBuyers] = useState([])
  const [currentRow, setCurrentRow] = useState({})
  const classes = useStyles();
  const [logModal, setLogModal] = useState(false)
  const [moneyModal, setMoneyModal] = useState(false)
  const [modal, setModal] = useState(false);
  const toggle = () => setModal(!modal);


  //Get Info Of All Buyers from Database
  useEffect(() => {
    firebase.database().ref("users/Buyer").on("value", (snapshot) => {
      if(snapshot.exists()){
      var allBuyers = Object.values(snapshot.val())
      var allKeys = Object.keys(snapshot.val())
      allBuyers.map((v, i) => {
        v.key = allKeys[i]
      })
      setBuyers(allBuyers)
    }
    })
  }, [])

  //Approve Buyer Account
  const approveAccount = (id) => {
    firebase.database().ref("users/Buyer").child(id).update({
      approved: true
    })
  }

  //Delete Buyer Account
  const deleteAccount = (id) => {
    console.log(id,"idsadasd")
    firebase.database().ref("shillBids/buyer").on("value",snapshot=>{
      if(snapshot.exists()){
          firebase.database().ref("shillBids").child("buyer").orderByChild("userId").equalTo(id).on("value",snapshot=>{
            if(snapshot.exists()){
              Object.keys(snapshot.val()).map((v)=>{
                firebase.database().ref(`shillBids/buyer/${v}`).remove()
              })
            }
          })
      }
  })


   
    // firebase.database().ref("complaints").orderByChild("addedBy").equalTo(id.username)

    firebase.database().ref(`users/Buyer/${id}`).once("value",snapshot=>{
      if(snapshot.exists()){
        firebase.database().ref("complaints").orderByChild("addedBy").equalTo(snapshot.val().username).on("value",snapshot=>{
          if(snapshot.exists()){
            Object.keys(snapshot.val()).map((v)=>{
              firebase.database().ref(`complaints/${v}`).remove()
            })
            firebase.database().ref("users/Buyer").child(id).remove()
          }
        })
      }
    })
    toggle()
  }

  //Save selected account in state to show bidding log and in delete modal
  const selectAccount = (row) => {
    setCurrentRow(row)
    toggle()
  }

  //View bidding log of the selected user
  const viewBiddingLog = (row) => {
    setCurrentRow(row)
    setLogModal(true)
  }

  const viewMoneyModal = (row) => {
    setCurrentRow(row)
    setMoneyModal(true)
  }

  //Block Buyer Account
  const blockAccount = (id) => {
    firebase.database().ref("users/Buyer").child(id).update({
      blocked: true
    })
  }

  //Unblock Buyer Account
  const unBlockAccount = (id) => {
    firebase.database().ref("users/Buyer").child(id).update({
      blocked: false
    })
  }

  //Open or close bidding log modal
  const toggleLogModal = (state) => {
    setLogModal(state)
  }

  const toggleMoneyModal = (state) => {
    setMoneyModal(state)
  }

  return (
    <Container className={classes.root} maxWidth="xl">
         {buyers.length > 0 ?
      <Paper>
        <SearchBar
          className={classes.searchBar}
          value={search}
          onChange={(newValue) => setSearch(newValue.toLowerCase())}
          placeholder="Search By Username"
        />
        <TableContainer>
          <Table className={classes.table} aria-label="simple table">
            <TableHead>
              <TableRow>
                <TableCell>User Name</TableCell>
                <TableCell align="right">Email</TableCell>
                <TableCell align="right">Name</TableCell>
                <TableCell align="right">Phone No</TableCell>
                <TableCell align="right">Last IP Address</TableCell>
                <TableCell align="right">Wallet</TableCell>
                <TableCell align="right">Transfer Money</TableCell>
                <TableCell align="right">Bidding Log</TableCell>
                <TableCell align="right">Approval Status</TableCell>
                <TableCell align="right">Delete</TableCell>
                <TableCell align="right">Block</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>

              {buyers.filter(function (el) {
                var name = el.username.toLowerCase()
                return name.includes(search)
              }).map((row, i) => (
                <TableRow key={i}>
                  <TableCell component="th" scope="row">
                    {row.username}
                  </TableCell>
                  <TableCell align="right">{row.email}</TableCell>
                  <TableCell align="right">{row.firstName} {row.lastName}</TableCell>
                  <TableCell align="right">{row.phnumber}</TableCell>
                  <TableCell align="right">{row.lastIp}</TableCell>
                  <TableCell align="right">{row.wallet}</TableCell>
                  <TableCell align="right"><Button variant="contained" color="primary" onClick={() => viewMoneyModal(row)}>Transfer</Button></TableCell>
                  <TableCell align="right"><Button variant="contained" color="primary" onClick={() => viewBiddingLog(row)}>View</Button></TableCell>
                  <TableCell align="right">{row.approved ? "Approved" : <Button onClick={() => approveAccount(row.key)} variant="contained" color="primary">Approve</Button>}</TableCell>
                  <TableCell align="right"><Button variant="contained" color="secondary" onClick={() => selectAccount(row)}>Delete</Button></TableCell>
                  <TableCell align="right">{row.blocked ? <Button onClick={() => unBlockAccount(row.key)} variant="contained" color="primary">UnBlock</Button> : <Button onClick={() => blockAccount(row.key)} variant="contained" color="secondary">Block</Button>}</TableCell>
                </TableRow>

              ))}
            </TableBody>
          </Table>
        </TableContainer>
        <Modal isOpen={modal} toggle={toggle} centered>
          <ModalHeader toggle={toggle}>Delete User</ModalHeader>
          <ModalBody>
            User <b>{currentRow.firstName} {currentRow.lastName}</b> will be deleted along with all their data on site. Are you sure you want to delete this user?
        </ModalBody>
          <ModalFooter>
            <Button variant="contained" color="primary" onClick={() => deleteAccount(currentRow.key)}>Yes</Button>{' '}
            <Button variant="contained" color="secondary" onClick={toggle}>No</Button>
          </ModalFooter>
        </Modal>
        {logModal && <BiddingLogModal modal={logModal} setModal={toggleLogModal} user={currentRow} />}
        {moneyModal && <AddMoneyModal modal={moneyModal} setModal={toggleMoneyModal} user={currentRow}/>}
      </Paper>
      :
      <Typography variant="h5" className="text-center mt-5">There are no buyers yet</Typography>}
    </Container>
  );
}