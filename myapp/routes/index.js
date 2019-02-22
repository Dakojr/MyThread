const express = require('express');
var passport = require('passport');
require('./../config/passport');
var csurf = require('csurf')

const router = express.Router()

var csurfProtect = csurf();
router.use(csurfProtect); //Every routes by him is Protect by Csrf protection

const utils = require('./../config/utils') //generation Token
const UserControl = require('./../controlers/usercontroler')
const ThreadControl = require('./../controlers/threadControlers')

// NAVBAR ROUTES
router.get('/', isLoggedIn, function (req, res, next) {
  ThreadControl.getAllThread()
  .then((data) => {
  res.render('pages/index', { message:"message", threads: data})

  })
})

router.get('/profile', isLoggedIn, function (req, res, next) {
  UserControl.getUserByID(req.session.passport.user)
    .then((User) => {
      ThreadControl.getThreadByIdUser(User.id_user)
        .then((Threads) => {
          ThreadControl.readThread('./thread/1.html')
            .then((text_thread) => {
              res.render('pages/profile', { User: User, text_thread: text_thread, Threads: Threads })
            })
        })
    });
})

//USER ROUTES

//SIGN UP

router.get('/signup', notLoggedIn, function (req, res, next) {
  var messages = req.flash('error'); //Display the error message in passport.js
  res.render('pages/signup', { csurfToken: req.csrfToken(), messages: messages, hasErrors: messages.length > 0 })
});

// When Sign Up is Submit if doesn't get an error
router.post('/signup', passport.authenticate('local.signup', {
  successRedirect: '/',
  failureRedirect: '/signup',
  failureFlash: true
}));

//SIGN IN

router.get('/signin', notLoggedIn, function (req, res, next) {
  var messages = req.flash('error'); //Display the error message in passport.js
  res.render('pages/signin', { csurfToken: req.csrfToken(), messages: messages, hasErrors: messages.length > 0 })
})

router.post('/signin', passport.authenticate('local.signin', {
  //successRedirect: '/',
  failureRedirect: '/signin',
  failureFlash: true
}),
  (req, res, next) => {
    if (!req.body.remember_me) {
      return next()
    }
    issueToken(req.user, function (err, token) {
      if (err) { return next(err); }
      res.cookie('remember_me', token, { path: '/', httpOnly: true, maxAge: 604800000 });
      return next();
    });
  },
  function (req, res) {
    res.redirect('/');
  });


router.get('/logout', function (req, res) {
  // clear the remember me cookie when logging out
  res.clearCookie('remember_me');
  req.logout();
  res.redirect('/');
});


module.exports = router

var tokens = {}

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

function issueToken(user, done) {
  var token = utils.randomString(64);
  saveRememberMeToken(token, user.id, function (err) {
    if (err) { return done(err); }
    return done(null, token);
  });
}

function saveRememberMeToken(token, uid, fn) {
  tokens[token] = uid;
  return fn();
}

function consumeRememberMeToken(token, fn) {
  var uid = tokens[token];
  // invalidate the single-use token
  delete tokens[token];
  return fn(null, uid);
}