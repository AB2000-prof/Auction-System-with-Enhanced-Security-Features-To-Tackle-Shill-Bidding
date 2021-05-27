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
import Typography from '@material-ui/core/Typography';
import Container from '@material-ui/core/Container';
import { Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';
import firebase from '../../../config/firebase'

//For Styles
const useStyles = makeStyles((theme) => ({
  table: {
    minWidth: 650
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
  const [sellers, setSellers] = useState([])
  const [currentRow, setCurrentRow] = useState({})
  const classes = useStyles();
  const [modal, setModal] = useState(false);
  const toggle = () => setModal(!modal);
  const [dummyState, setDummyState] = useState(1)

  //Get Info Of All Sellers    
  useEffect(() => {
    firebase.database().ref("users/Seller").on("value", (snapshot) => {
      if(snapshot.exists()){
      var allSellers = Object.values(snapshot.val())
      var allKeys = Object.keys(snapshot.val())
      allSellers.map((v, i) => {
        firebase.database().ref("/products").orderByChild("uploadedBy").equalTo(allKeys[i]).on("value", (snapshot) => {
          if(snapshot.exists()){
          v.noOfProducts = Object.keys(snapshot.val()).length
          v.key = allKeys[i]
          setSellers(allSellers)
          setDummyState(i)
        }
        else{
          v.noOfProducts = 0
          v.key = allKeys[i]
          setSellers(allSellers)
          setDummyState(i)
        }
        })
      })
    }
    })
  }, [])


  //Approve Seller Account
  const approveAccount = (id) => {
    firebase.database().ref("users/Seller").child(id).update({
      approved: true
    })
  }

  //Delete Seller Account
  const deleteAccount = (id) => {
    firebase.database().ref("users/Seller").child(id).remove()
    firebase.database().ref("/products").orderByChild("uploadedBy").equalTo(id).on("value", (snapshot) => {  
      if(snapshot.exists()){
        Object.keys(snapshot.val()).map((v,i)=>{
          firebase.database().ref(`shillBids/time`).orderByChild("productID").equalTo(v).on("value",snapshot=>{
            if(snapshot.exists()){
              Object.keys(snapshot.val()).map((s,i)=>{
                firebase.database().ref(`shillBids/time`).child(s).remove()
              })
            }
          })
          firebase.database().ref("/products").child(v).remove()
        })
      }
    })
    toggle()
  }

  //Select Account for Delete Modal
  const selectAccount = (row) => {
    setCurrentRow(row)
    toggle()
  }

  //Block Seller Account
  const blockAccount = (id) => {
    firebase.database().ref("users/Seller").child(id).update({
      blocked: true
    })
  }

  //Unblock Seller Account
  const unBlockAccount = (id) => {
    firebase.database().ref("users/Seller").child(id).update({
      blocked: false
    })
  }

  return (
    <Container className={classes.root} maxWidth="xl">
         {sellers.length > 0 ?
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
                <TableCell align="right">No of Products</TableCell>
                <TableCell align="right">Approval Status</TableCell>
                <TableCell align="right">Delete</TableCell>
                <TableCell align="right">Block</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>

              {sellers.filter(function (el) {
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
                  <TableCell align="right">{row.noOfProducts}</TableCell>
                  <TableCell align="right">{row.approved ? "Approved" : <Button onClick={() => approveAccount(row.key)} variant="contained" color="primary">Approve Now</Button>}</TableCell>
                  <TableCell align="right"><Button variant="contained" color="secondary" onClick={() => selectAccount(row)}>Delete</Button></TableCell>
                  <TableCell align="right">{row.blocked ? <Button onClick={() => unBlockAccount(row.key)} variant="contained" color="primary">UnBlock</Button> : <Button onClick={() => blockAccount(row.key)} variant="contained" color="secondary">Block</Button>}</TableCell>                    </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
        <Modal isOpen={modal} toggle={toggle} centered>
          <ModalHeader toggle={toggle}>Delete User</ModalHeader>
          <ModalBody>
            User <b>{currentRow.firstName} {currentRow.lastName}</b> will be deleted along with all their products on site. Are you sure you want to delete this user?
        </ModalBody>
          <ModalFooter>
            <Button variant="contained" color="primary" onClick={() => deleteAccount(currentRow.key)}>Yes</Button>{' '}
            <Button variant="contained" color="secondary" onClick={toggle}>No</Button>
          </ModalFooter>
        </Modal>
      </Paper>
      :
      <Typography variant="h5" className="text-center mt-5">There are no sellers yet</Typography>}
    </Container>
  );
}