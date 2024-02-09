var express = require('express');
var router = express.Router();
const productHelpers = require('../helpers/product-helpers');
const userHelpers = require('../helpers/user-helpers');
const { response } = require('../app');


router.get('/', async function (req, res, next) {
  let user = req.session.user
  console.log(user)
  let cartCount = null
  if (req.session.user) {
    cartCount = await userHelpers.getCartCount(req.session.user._id)
  }
  productHelpers.getAllProducts().then((products) => {
    res.render('user/view-products', { cartCount, products, user, loginErr: req.session.loginErr });
    req.session.loginErr = false
  })
})

const verifyLogin = (req, res, next) => {
  if (req.session.loggedIn) {
    next()
  } else {
    res.redirect('/')
  }
}

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

router.get('/cart', verifyLogin, async (req, res) => {
  let user = req.session.user
  let cartCount = null
  if (req.session.user) {
    cartCount = await userHelpers.getCartCount(req.session.user._id)
  }
  let products = await userHelpers.getCartProducts(req.session.user._id)
  console.log(products)
  res.render('user/cart', { user, products, cartCount })
})
router.get('/products', verifyLogin, (req, res) => {
  let user = req.session.user
  res.render('user/products', { user })
})


router.get('/add-to-cart/:id', (req, res) => {
  console.log("api call.......")
  userHelpers.addToCart(req.params.id, req.session.user._id).then(() => {
    res.json({ status: true })
  })
})

router.post('/change-product-quantity', (req, res, next) => {
  console.log(req.body)
  userHelpers.changeProductQuantity(req.body).then((response) => {
    res.json(response)
  })
})


module.exports = router;
