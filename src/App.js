import logo from './logo.svg';
import './App.css';
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Redirect,
  useHistory,
} from "react-router-dom";
import Home from './Components/Home'
import SignInAsBuyer from './Components/Signin/SignInAsBuyer.js'
import SignInAsSeller from './Components/Signin/SignInAsSeller'
import SignInAsAdmin from './Components/Signin/SignInAsAdmin'
import SignUp from './Components/Signup'
import ForgotPassword from './Components/ForgotPassword'
import SellerDashboard from './Components/Seller/Dashboard'
import BuyerDashboard from './Components/Buyer/Dashboard'
import AdminDashboard from './Components/Admin/Dashboard'
import { useState, useEffect } from 'react';
import { Provider } from 'react-redux'
import store from './redux'



//Route to prevent users from accessing without logging in
function PrivateRoute({ component: Component, authed, ...rest }) {
  return (
    <Route
      {...rest}
      render={(props) => authed === true
        ? <Component {...props} />
        : <Redirect to={{ pathname: '/', state: { from: props.location } }} />}
    />
  )
}




function App(props) {
  const [buyerAuthed, setBuyerAuthed] = useState(false)
  const [sellerAuthed, setSellerAuthed] = useState(false)
  const [adminAuthed, setAdminAuthed] = useState(false)
  const history = useHistory



  return (
    <Router history={history}>
      <Switch>
        <Provider store={store}>
          <Route exact path="/">
            <Home setBuyerAuthTrue={() => setBuyerAuthed(true)} setSellerAuthTrue={() => setSellerAuthed(true)} setAdminAuthTrue={() => setAdminAuthed(true)} />
          </Route>
          <Route exact path="/signup">
            <SignUp />
          </Route>
          <Route exact path="/signinasbuyer">
            <SignInAsBuyer setAuthTrue={() => setBuyerAuthed(true)} />
          </Route>
          <Route exact path="/signinasseller">
            <SignInAsSeller setAuthTrue={() => setSellerAuthed(true)} />
          </Route>
          <Route exact path="/signinasadmin">
            <SignInAsAdmin setAuthTrue={() => setAdminAuthed(true)} />
          </Route>
          <Route exact path="/forgotpassword">
            <ForgotPassword />
          </Route>
          <PrivateRoute authed={sellerAuthed} path='/sellerdashboard' component={SellerDashboard} />
          <PrivateRoute authed={buyerAuthed} path='/buyerdashboard' component={BuyerDashboard} />
          <PrivateRoute authed={adminAuthed} path='/admin' component={AdminDashboard} />
        </Provider>
      </Switch>
    </Router>
  );
}

export default App;
