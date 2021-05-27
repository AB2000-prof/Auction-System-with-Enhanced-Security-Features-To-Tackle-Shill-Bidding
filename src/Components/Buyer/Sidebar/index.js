import React, { useState, Fragment } from 'react';
import clsx from 'clsx';
import { Router, Route, Link } from "react-router-dom";
import firebase from '../../../config/firebase'
import { withStyles } from '@material-ui/core/styles';
import Avatar from '@material-ui/core/Avatar';
import Drawer from '@material-ui/core/Drawer';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import AccountCircleIcon from '@material-ui/icons/AccountCircle';
import ViewComfyIcon from '@material-ui/icons/ViewComfy';
import ExitToAppIcon from '@material-ui/icons/ExitToApp';
import Home from "../Home";
import Profile from "../Profile";
import { ListItemIcon, Typography } from '@material-ui/core';
import AssignmentIcon from '@material-ui/icons/Assignment';
import ProductPage from '../ProductPage';
import Checkout from '../Checkout'
import AddComplaint from '../AddComplaint'


const drawerWidth = 240;
//For Styles
const styles = theme => ({
  root: {
    flexGrow: 1
  },
  flex: {
    flex: 1
  },
  drawerPaper: {
    position: "relative",
    width: drawerWidth,
  },
  menuButton: {
    marginLeft: -12,
    marginRight: 20
  },
  toolbarMargin: theme.mixins.toolbar,
  aboveDrawer: {
    zIndex: theme.zIndex.drawer + 1
  },
  welcome: {
    textAlign: "center",
  },
  avatar: {
    alignSelf: "center",
    margin: theme.spacing(2),
    backgroundColor: theme.palette.primary.main,
  },
});

//Drawer with router. All Routes inside Drawer defined
const MyDrawer = withStyles(styles)(
  ({ classes, variant, open, onClose, onItemClick, history, username }) => (
    <>
      <Drawer variant={variant} open={open} onClose={onClose}
        classes={{
          paper: classes.drawerPaper
        }}
      >
        <Avatar className={classes.avatar}>
          <AccountCircleIcon />
        </Avatar>
        <Typography className={classes.welcome} component="h1" variant="h5">
          Welcome {username}
        </Typography>
        <div style={{ width: "100%", borderTop: "1px solid gray", marginTop: "20px", opacity: 0.2 }}></div>
        <div
          className={clsx({
            [classes.toolbarMargin]: variant === 'persistent'
          })}
        />
        <List>
          <ListItem button component={Link} to="/" onClick={onItemClick('All Products')}>
            <ListItemIcon><ViewComfyIcon /></ListItemIcon>
            <ListItemText>Home</ListItemText>
          </ListItem>
          <ListItem button component={Link} to="/buyerdashboard/profile" onClick={onItemClick('Profile')}>
            <ListItemIcon><AccountCircleIcon /></ListItemIcon>
            <ListItemText>Profile</ListItemText>
          </ListItem>
          <ListItem button component={Link} to="/buyerdashboard/addcomplaint" onClick={onItemClick('Add Complaint')}>
            <ListItemIcon><AssignmentIcon /></ListItemIcon>
            <ListItemText>Add Complaint</ListItemText>
          </ListItem>
          <ListItem button onClick={() => { firebase.auth().signOut(); history.push("/") }}>
            <ListItemIcon><ExitToAppIcon /></ListItemIcon>
            <ListItemText>Logout</ListItemText>
          </ListItem>
        </List>
      </Drawer>
      <main className={classes.content}>
        <Route exact path="/buyerdashboard" component={Home} />
        <Route path="/buyerdashboard/profile" component={Profile} />
        <Route path="/buyerdashboard/product" component={ProductPage} />
        <Route path="/buyerdashboard/checkout" component={Checkout} />
        <Route path="/buyerdashboard/addcomplaint" component={AddComplaint} />
      </main>
    </>
  )
);

export default MyDrawer;