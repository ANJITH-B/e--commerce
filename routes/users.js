var express = require('express');
var router = express.Router();
const productHelpers = require('../helpers/product-helpers');
const userHelpers = require('../helpers/user-helpers');
const { response } = require('../app');

router.get('/', function (req, res, next) {
  let user = req.session.user
  console.log(user)
  productHelpers.getAllProducts().then((products) => {
    res.render('user/view-products', { admin: false, products, user, loginErr: req.session.loginErr});
    req.session.loginErr = false
  })
});

// router.get('/login', (req, res) => {
//   res.render('user/login')
// })
router.get('/cart', (req,res) => {
  res.render('user/cart')
})

router.post('/SignUp', (req, res) => {
  userHelpers.doSignup(req.body).then((response) => {
    console.log(response);
    req.session.loggedIn = true
    req.session.user = response
    res.redirect('/')
  })
})

router.post('/Login', (req, res) => {
  userHelpers.doLogin(req.body).then((response) => {
    console.log("Login response:", response);
    if (response.status) {
      req.session.loggedIn = true
      req.session.user = response.user
      console.log("Redrection to /home")
      res.redirect('/');
    } else {
      req.session.loginErr = true
      res.json(response)
    }
  }).catch((error) => {
    console.error("Error in login route:", error);
    res.redirect('/')
  })
})


router.get('/Logout', (req, res) => {
  req.session.destroy()
  res.redirect('/')
})

module.exports = router;
