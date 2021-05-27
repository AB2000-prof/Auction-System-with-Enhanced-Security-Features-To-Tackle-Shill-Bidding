import React, { useState, Fragment, useEffect } from 'react';
import Button from '@material-ui/core/Button';
import firebase from '../../../config/firebase'
import { withStyles } from '@material-ui/core/styles';
import {useHistory} from 'react-router-dom'
import MyToolbar from '../Toolbar'
import MyDrawer from '../Sidebar'


const drawerWidth = 240;

//For Styles
const styles = theme => ({
    root: {
      flexGrow: 1,
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
  });

function Dashboard({ classes, variant }) {
    const [drawer, setDrawer] = useState(false);
    const [title, setTitle] = useState('');
    const [username,setUserName] = useState("")
    const history = useHistory();


      //Get User info from database and set Title of The Page
    useEffect(()=>{
        firebase.database().ref(`users/Seller/${firebase.auth().currentUser.uid}`).once("value",(snapshot)=>{
          if(snapshot.exists()){
            setUserName(snapshot.val().firstName+" "+snapshot.val().lastName)
          }
        })
        var url = history.location.pathname
        if(url=="/sellerdashboard/additem"){
          setTitle("Add A Product")
        }
        else if(url=="/sellerdashboard"){
          setTitle("All Products")
        }
        else if(url=="/sellerdashboard/profile"){
          setTitle("Profile")
        }
        else if(url=="/sellerdashboard/product"){
          setTitle("Product Page")
        }
    })
  
     //Open or close drawer
    const toggleDrawer = () => {
      setDrawer(!drawer);
    };
  
    //Change Title on change of page
    const onItemClick = title => () => {
      setTitle(title);
      setDrawer(variant === 'temporary' ? false : drawer);
      setDrawer(!drawer);
    };
  
    return (
      <div className={classes.root}>
        <MyToolbar title={title} onMenuClick={toggleDrawer} />
        <MyDrawer
        username={username}
          history={history}
          open={drawer}
          onClose={toggleDrawer}
          onItemClick={onItemClick}
          variant={variant}
        />
      </div>
    );
  }

  export default withStyles(styles)(Dashboard);