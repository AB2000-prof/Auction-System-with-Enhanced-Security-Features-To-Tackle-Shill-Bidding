How to run the Web Application: Must have Node.js installed locally.

 - Download the folder onto your system.
 - CD into the folder
 - Run 'Install Yarn' on terminal
 - Once Yarn has installed, run 'Yarn' to install the dependices.
 - Once 'Yarn' has completed installing, Please write the command ' Yarn run'
 - Once you write the command 'Yarn run' you will be provided with four options, Type in 'Start' into the terminal
 - The development server should start to load up, please give it at least 30-45 seconds before refreshing the page as it loads slowly since its a new system
 - The Page should load up with 3 Login Options
 - Buyer Account: Buyer@gmail.com  Password: BuyerTest  
 - Seller Account: Seller@gmail.com Password: SellerTest    
 - Admin Account: admin@gmail.com Password: 123456
 - Please bear in mind that they're case sensitive, In order to create and use your own accounts you have register and then approve the account from the admin mdoule, then you will be able to login. An Admin account cannot be created unless done from the Database, please use the info given above.
 -  Appendix also has Images of the Application running live.

Location of the Code: I will provide three examples to help the reader, easily find the code

  - Public > SRC > Components
  - Public > SRC > Redux
  - Public > SRC > Config > Firebase.js
  - 
 

 
 
Explanation of Commenting: I have made comments throughout the files, usually at the top of a block of code to maintain an elegant appearance.

Below I will provide references for the code which has been reused, and why it has been used.

Code Referencing: 

Signup/index.js:
https://github.com/mui-org/material-ui/blob/master/docs/src/pages/getting-started/templates/sign-up/SignUp.js
Signup page ui template from material ui. Customized according to need of product.

https://reactstrap.github.io/components/alerts/
Used for showing errors

Home/index.js:
https://github.com/mui-org/material-ui/blob/master/docs/src/pages/getting-started/templates/sign-in-side/SignInSide.js
SigninSide page ui template from material ui. Used as homepage and customized according to need of product.

SignInAsBuyer/index.js:
https://github.com/mui-org/material-ui/blob/master/docs/src/pages/getting-started/templates/sign-up/SignUp.js
Signin page ui template from material ui. Customized according to need of product.

https://reactstrap.github.io/components/alerts/
Used for showing errors

SignInAsSeller/index.js:
https://github.com/mui-org/material-ui/blob/master/docs/src/pages/getting-started/templates/sign-up/SignUp.js
Signin page ui template from material ui. Customized according to need of product.

https://reactstrap.github.io/components/alerts/
Used for showing errors
Seller/Dashboard/index.js:
Seller/Sidebar/index.js:
Seller/Toolbar/index.js:
https://paulgrajewski.medium.com/react-material-ui-drawer-with-routes-8e27c91b6119
React router integrated with material ui template. Used for setting up Toolbar, Dashboard and Sidebar.

Seller/ViewItems/index.js:
https://github.com/mui-org/material-ui/blob/master/docs/src/pages/getting-started/templates/album/Album.js
Material ui album template, used for showing products.

Seller/AddItem/index.js:
https://github.com/mui-org/material-ui/blob/master/docs/src/pages/getting-started/templates/sign-in-side/SignInSide.js
Signin page ui template from material ui. Used as a form to add products.

https://www.npmjs.com/package/react-firebase-file-uploader
Library used to upload images to firebase

Seller/EditProduct/index.js:
https://github.com/mui-org/material-ui/blob/master/docs/src/pages/getting-started/templates/sign-in-side/SignInSide.js
Signin page ui template from material ui. Used as a form to add products.

https://www.npmjs.com/package/react-firebase-file-uploader
Library used to upload images to firebase


Seller/ProductPage/index.js:
https://github.com/mui-org/material-ui/blob/master/docs/src/pages/getting-started/templates/blog/FeaturedPost.js
FeaturedPost page ui template from material ui. Used to show details of product.

https://www.npmjs.com/package/react-material-ui-carousel
Library used to show product images.

https://material-ui.com/components/tables/
Table template from material ui to show bid log.


Buyer/AddComplaint/index.js:
https://github.com/mui-org/material-ui/blob/master/docs/src/pages/getting-started/templates/sign-in-side/SignInSide.js
Signin page ui template from material ui. Used as a form to add complaints.

Buyer/Dashboard/index.js:
Buyer /Sidebar/index.js:
Buyer /Toolbar/index.js:
https://paulgrajewski.medium.com/react-material-ui-drawer-with-routes-8e27c91b6119
React router integrated with material ui template. Used for setting up Toolbar, Dashboard and Sidebar.

Buyer/Home/index.js:
https://github.com/mui-org/material-ui/blob/master/docs/src/pages/getting-started/templates/album/Album.js
Material ui album template, used for showing products.
Buyer/ProductPage/index.js:
https://github.com/mui-org/material-ui/blob/master/docs/src/pages/getting-started/templates/blog/FeaturedPost.js
FeaturedPost page ui template from material ui. Used to show details of product.

https://www.npmjs.com/package/react-material-ui-carousel
Library used to show product images.

https://material-ui.com/components/tables/
Table template from material ui to show bid log.

Admin/AllBuyers/index.js:
https://material-ui.com/components/tables/
Table template from material ui to show list of buyers.

Admin/AllSellers/index.js:
https://material-ui.com/components/tables/
Table template from material ui to show list of sellers.

Admin/BiddingLogModal/index.js:
https://material-ui.com/components/tables/
Table template from material ui to show list of bidding log of a buyer.

Admin/ProductBiddingLogModal/index.js:
https://material-ui.com/components/tables/
Table template from material ui to show bidding log of product.


Admin/FlaggedBuyers/index.js:
https://material-ui.com/components/tables/
Table template from material ui to show list of flagged buyers.

Admin/FlaggedProducts/index.js:
https://material-ui.com/components/tables/
Table template from material ui to show list of flagged products.

Admin/Dashboard/index.js:
Admin /Sidebar/index.js:
Admin /Toolbar/index.js:
https://paulgrajewski.medium.com/react-material-ui-drawer-with-routes-8e27c91b6119
React router integrated with material ui template. Used for setting up Toolbar, Dashboard and Sidebar.

Admin /AllProducts/index.js:
https://github.com/mui-org/material-ui/blob/master/docs/src/pages/getting-started/templates/album/Album.js
Material ui album template, used for showing products.


Admin /ProductPage/index.js:
https://github.com/mui-org/material-ui/blob/master/docs/src/pages/getting-started/templates/blog/FeaturedPost.js
FeaturedPost page ui template from material ui. Used to show details of product.


https://www.npmjs.com/package/react-material-ui-carousel
Library used to show product images.


https://material-ui.com/components/tables/
Table template from material ui to show bid log.



































