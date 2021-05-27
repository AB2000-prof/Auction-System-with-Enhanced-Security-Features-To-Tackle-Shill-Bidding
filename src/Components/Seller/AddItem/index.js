import React, { useEffect, useRef, useState } from 'react';
import Button from '@material-ui/core/Button';
import CssBaseline from '@material-ui/core/CssBaseline';
import TextField from '@material-ui/core/TextField';
import FormControl from '@material-ui/core/FormControl';
import InputLabel from '@material-ui/core/InputLabel';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import firebase from '../../../config/firebase'
import Typography from '@material-ui/core/Typography';
import Grid from '@material-ui/core/Grid';
import { makeStyles } from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';
import CustomUploadButton from 'react-firebase-file-uploader/lib/CustomUploadButton';
import LinearProgress from '@material-ui/core/LinearProgress';
import { Alert } from 'reactstrap'
import './style.scss'
import { useHistory } from 'react-router';

//For Styles
const useStyles = makeStyles((theme) => ({
  paper: {
    marginTop: theme.spacing(8),
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  avatar: {
    margin: theme.spacing(1),
    backgroundColor: theme.palette.secondary.main,
  },
  form: {
    width: '100%', // Fix IE 11 issue.
    marginTop: theme.spacing(1),
  },
  submit: {
    margin: theme.spacing(3, 0, 2),
  },
  input: {
    display: 'none',
  },
  upload: {
    marginTop: 20,
  },
  progressbar: {
    marginTop: 10
  }
}));

export default function AddItem() {
  const classes = useStyles();
  const history = useHistory()
  const [pics, setPics] = useState([])
  const [urls, setUrls] = useState([])
  const [isUploading, setIsUploading] = useState(false)
  const [isUploaded, setIsUploaded] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(0)
  const [formData, setFormData] = useState({})
  const [errors, setErrors] = useState([])
  const [dummyState, setDummyState] = useState()

  //To handle and save changes in add product form
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  //Start uploading picture
  const handleUploadStart = (e) => {
    setIsUploading(true)
    setUploadProgress(0)
  }


  //Update Progress state to update progress bar 
  const handleProgress = progress => {
    setUploadProgress(progress)
  }


  //handle any error during upload  
  const handleUploadError = error => {
    setIsUploading(false)
  };

  //Save url after upload success  
  const handleUploadSuccess = async filename => {
    const downloadURL = await firebase
      .storage()
      .ref("images")
      .child(filename)
      .getDownloadURL();

    var allPics = pics
    allPics.push(filename)
    var allUrls = urls
    allUrls.push(downloadURL)
    setPics(allPics)
    setUrls(allUrls)
    setUploadProgress(100)
    setIsUploading(false)
    setIsUploaded(true)
    setDummyState(Math.floor(Math.random() * 100))
  };


  //Validate form data and then send to database  
  const onSubmit = () => {
    console.log(urls, "url")
    var allErrors = []
    if (!formData.name) {
      allErrors.push("Name Is Required")
    }
    else if (!formData.description) {
      allErrors.push("Description Is Required")
    }
    else if (!formData.price) {
      allErrors.push("Price Is Required")
    }
    else if (!formData.time) {
      allErrors.push("Time Is Required")
    }
    else if (!formData.condition) {
      allErrors.push("Condition Is Required")
    }
    else if (urls.length == 0) {
      allErrors.push("One Or More Pictures are Required")
    }
    else {
      if (formData.name.length < 6) {
        allErrors.push("Name Should be of More Than 5 Characters")
      }
      else if (formData.description.length < 50) {
        allErrors.push("Description Should Be Atleast 50 Characters")
      }
      else if (formData.price < 0 || formData.price > 1000000000) {
        allErrors.push("Price Should Be In Range Of 0 and 1,000,000,000")
      }
      else if (formData.time < 1 || formData.time > 3600) {
        allErrors.push("Time Should Be In Range Of 0 and 3600 minutes")
      }
      else {
        firebase.database().ref("products").push({
          name: formData.name,
          description: formData.description,
          initialPrice: formData.price,
          bidPrice: formData.price,
          condition: formData.condition,
          urls: urls,
          uploadedBy: firebase.auth().currentUser.uid,
          timeStamp: Date(),
          status: "active",
          time: formData.time
        })
        history.push("/")
      }
    }

    setErrors(allErrors)
    setTimeout(() => {
      setErrors([])
    }, 4000);

  }

  //Function to remove element from array
  function arrayRemove(arr, value) {
    return arr.filter(function (ele) {
      return ele != value;
    });
  }


  //Remove Image on Pressing Cross Button
  const removeImage = (url) => {
    var allUrls = urls
    allUrls = arrayRemove(allUrls, url);
    setUrls(allUrls)
  }




  return (
    <Container component="main" maxWidth="xs">
      <CssBaseline />
      <div className={classes.paper}>
        <Typography component="h1" variant="h5">
          Add A Product
        </Typography>
        <div className={classes.form}>
          <TextField
            variant="outlined"
            margin="normal"
            required
            fullWidth
            id="name"
            label="Product Name"
            name="name"
            autoComplete="name"
            autoFocus
            onChange={handleChange}
          />
          <TextField
            variant="outlined"
            margin="normal"
            required
            fullWidth
            name="description"
            multiline
            label="Description"
            id="description"
            autoComplete="description"
            rows={10}
            onChange={handleChange}
          />
          <TextField
            variant="outlined"
            margin="normal"
            required
            fullWidth
            id="price"
            label="Starting Price In $"
            name="price"
            autoComplete="price"
            autoFocus
            type="number"
            onChange={handleChange}
          />
          <TextField
            variant="outlined"
            margin="normal"
            required
            fullWidth
            id="time"
            label="Time In minutes (0-3600)"
            name="time"
            autoComplete="time"
            autoFocus
            type="number"
            onChange={handleChange}
          />

          <FormControl fullWidth variant="outlined" className={classes.formControl}>
            <InputLabel id="demo-simple-select-outlined-label">Condition</InputLabel>
            <Select
              labelId="demo-simple-select-outlined-label"
              id="demo-simple-select-outlined"
              value={formData.condition}
              onChange={handleChange}
              label="Condition"
              name="condition"
            >
              <MenuItem value={"New"}>New</MenuItem>
              <MenuItem value={"Used"}>Used</MenuItem>
            </Select>
          </FormControl>
          {isUploading ? <div className="text-center mt-3">
            <Typography variant="h5">Uploading...</Typography>
            <LinearProgress className={classes.progressbar} variant="determinate" value={uploadProgress} />
          </div>
            :
            <CustomUploadButton
              accept="image/*"
              storageRef={firebase.storage().ref('images')}
              onUploadStart={handleUploadStart}
              onUploadError={handleUploadError}
              onUploadSuccess={handleUploadSuccess}
              onProgress={handleProgress}
              multiple
              className="upload-btn"
            >
              UPLOAD PICTURES
  </CustomUploadButton>}

          <br />
          {urls.map((downloadURL, i) => {
            return (
              <div class="img-wrap" key={downloadURL}>
                <span className="close" onClick={() => removeImage(downloadURL)}>&times;</span>
                <img src={downloadURL} className="displayImg" />
              </div>
            )
          })}

          {
            errors.map((error, index) => (
              <Grid item key={index} xs={12}>
                <Alert color="danger">
                  {error}
                </Alert>
              </Grid>
            ))
          }

          <Button
            type="submit"
            fullWidth
            variant="contained"
            color="primary"
            className={classes.submit}
            onClick={onSubmit}
          >
            Add Product
          </Button>
        </div>
      </div>
    </Container>
  );
}