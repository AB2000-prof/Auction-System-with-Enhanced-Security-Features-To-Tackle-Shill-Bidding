import React, { useState, Fragment, useEffect } from 'react';
import { Link } from "react-router-dom";
import { makeStyles } from '@material-ui/core/styles';
import Popover from '@material-ui/core/Popover';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import IconButton from '@material-ui/core/IconButton';
import MenuIcon from '@material-ui/icons/Menu';
import Badge from '@material-ui/core/Badge';
import NotificationsIcon from '@material-ui/icons/Notifications';
import AccountCircle from '@material-ui/icons/AccountCircle';
import Notifications from '../Notifications'
import firebase from '../../../config/firebase'


const drawerWidth = 240;

//For Styles
const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1
  },
  flex: {
    flex: 1
  },
  drawerPaper: {
    position: "relative",
    width: drawerWidth
  },
  menuButton: {
    marginLeft: -12,
    marginRight: 20
  },
  toolbarMargin: theme.mixins.toolbar,
  aboveDrawer: {
    zIndex: theme.zIndex.drawer + 1
  }
}))

const MyToolbar = ({ title, onMenuClick }) => {

  const [anchorEl, setAnchorEl] = React.useState(null);
  const classes = useStyles()
  const [noOfNotifications, setNoOfNotifications] = React.useState(0)

  //Get No Of New Notifications and update them in ui   
  useEffect(() => {
    firebase.database().ref(`users/Seller/${firebase.auth().currentUser.uid}`).on("value", (snapshot) => {
      if(snapshot.exists()){
      if (snapshot.val().newNotifications){
        setNoOfNotifications(snapshot.val().newNotifications)
      }
      }
    })
  }, [anchorEl])

  //Set No Of New Notifications to 0 Since user has clicked notifications button and seen them.
  const handleClick = (event) => {
    firebase.database().ref(`users/Seller/${firebase.auth().currentUser.uid}`).update({
      newNotifications: 0
    })
    setNoOfNotifications(0)
    setAnchorEl(event.currentTarget);
  };

  //Close Notifications Modal
  const handleClose = () => {
    setAnchorEl(null);
  };

  const open = Boolean(anchorEl);
  const id = open ? 'simple-popover' : undefined;

  return (
    <Fragment>
      <AppBar className={classes.aboveDrawer}>
        <Toolbar>
          <IconButton
            className={classes.menuButton}
            color="inherit"
            aria-label="Menu"
            onClick={onMenuClick}
          >
            <MenuIcon />
          </IconButton>
          <Typography
            variant="h6"
            color="inherit"
            className={classes.flex}
          >
            {title}
          </Typography>
          <div className={classes.grow}>
            <IconButton color="inherit" onClick={handleClick}>
              <Badge badgeContent={noOfNotifications} invisible={noOfNotifications ? false : true} color="secondary">
                <NotificationsIcon />
              </Badge>
            </IconButton>
            <Link to="/sellerdashboard/profile">
              <IconButton
                edge="end"
                aria-label="account of current user"
                aria-haspopup="true"
                // onClick={handleProfileMenuOpen}
                color="secondary"
              >
                <AccountCircle />
              </IconButton>
            </Link>
          </div>
        </Toolbar>
      </AppBar>
      <Popover
        id={id}
        open={open}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'center',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'center',
        }}
      >
        <Notifications onClose={handleClose} />
      </Popover>
    </Fragment>
  )
}

export default MyToolbar;
