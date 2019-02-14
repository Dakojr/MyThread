const express = require('express');
const Promise = require('bluebird')
var passport = require('passport');
require('./../config/passport');

const router = express.Router();

const UserControl = require('./../controlers/usercontroler')



/* GET home page. */
router.get('/', function (req, res, next) {
  UserControl.getUser()
    .then((User) => {
      res.render('pages/index', { User: User })
    })
});

router.get('/about', function (req, res, next) {
  UserControl.getUser()
    .then((User) => {
      res.render('pages/about', { User: User })
    })
});

//USER ROUTES

//SIGN UP

router.get('/signup' , function (req, res, next) {
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

router.get('/signin' , function(req, res, next) {
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
    res.redirect('/signup')
}