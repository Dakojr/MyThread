const express = require('express');
const Promise = require('bluebird')
var passport = require('passport');
require('./../config/passport');

const router = express.Router()

const UserControl = require('./../controlers/usercontroler')

/* GET home page. */
router.get('/', isLoggedIn, function (req, res, next) {
  UserControl.getUser()
    .then((User) => {
      //console.log(User)
      res.render('pages/index', { User: User })
    })
});

router.get('/about', isLoggedIn, function (req, res, next) {
  // UserControl.getUser()
  //   .then((User) => {
  //     res.render('pages/about', { User: User })
  //   })
  res.render('pages/about')

});

//USER ROUTES

//SIGN UP

router.get('/signup', notLoggedIn, function (req, res, next) {
  UserControl.getUser()
    .then((User) => {
      res.render('pages/signup', { User: User })
    })
});

// When Sign Up is Submit if doesn't get an error
router.post('/signup', passport.authenticate('local.signup', {
  successRedirect: '/',
  failureRedirect: '/signup',
  //failureFlash: true
}));

//SIGN IN

router.get('/signin', notLoggedIn, function (req, res, next) {
  res.render('pages/signin')
})

router.post('/signin', passport.authenticate('local.signin', {
  successRedirect: '/',
  failureRedirect: '/signin'
  //failureFlash: true
}))

module.exports = router

function isLoggedIn(req, res, next) {
  if (req.isAuthenticated()) {
    return next()
  }
  console.log('need to log')
  res.redirect('/signin')
}

function notLoggedIn(req, res, next) {
  if (!req.isAuthenticated()) {
    return next(); //next function
  }
  res.redirect('/');
}