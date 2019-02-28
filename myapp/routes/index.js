const express = require('express')
var passport = require('passport')
require('./../config/passport')
var csurf = require('csurf')
var async = require('async')

const router = express.Router()

var csurfProtect = csurf();
router.use(csurfProtect); //Every routes by him is Protect by Csrf protection

const utils = require('./../config/utils') //generation Token
const UserControl = require('./../controlers/usercontroler')
const ThreadControl = require('./../controlers/threadControlers')


// HOME PAGE

router.get('/', isLoggedIn, function (req, res, next) {

  const start = () => {
    return new Promise((resolve, reject) => {
      ThreadControl.getAllThread()
        .then((data) => {
          resolve(data)
        })
    })
  }

  const waitFor = (ms) => new Promise(r => setTimeout(r, ms));

  async function asyncForEach(array, callback) {
    for (let index = 0; index < array.length; index += 1) {
      await callback(array[index], index, array);
    }
  }

  const ReadPushText = async (array) => {
    return new Promise(async (resolve, reject) => {
      await asyncForEach(array, async (element) => {
        //await waitFor(20)
        ThreadControl.readThread(element.pathfile_thread)
          .then((data) => {
            element.text = data
          })
      })
      await waitFor(20)
      resolve(array)
    })
  }

  start()
    .then((data) => {
      ReadPushText(data)
        .then((Threads) => {
          res.render('pages/index', { message: "message", threads: Threads, csurfToken: req.csrfToken() })
        })
    })

})

router.post('/thread/newthread', isLoggedIn, (req, res, next) => {
  ThreadControl.newThreadFile(req.session.passport.user, req.body.title, req.body.thread_content)
  ThreadControl.newThread(req.body.title, './thread/' + req.session.passport.user + '/' + req.body.title + '.html', "N", req.session.passport.user)
  res.redirect('/')
})

router.get('/profiles?:username', isLoggedIn, (req, res, next) => {
  console.log(req.params)
  res.render('pages/profiles', { username: req.params })
})

//USER ROUTES

//PROFIL
router.get('/profile', isLoggedIn, function (req, res, next) {
  // UserControl.getUserByID(req.session.passport.user)
  //   .then((User) => {
  //     ThreadControl.getAllThreadByIdUser(req.session.passport.user)
  //       .then((Threads) => {
  //         console.log(Threads)
  //         ThreadControl.readThread(Threads.pathfile_thread)
  //           .then((text_thread) => {
  //             console.log(text_thread)

  //             res.render('pages/profile', { User: User, text_thread: text_thread, Threads: Threads })
  //           })
  //       })
  //   });

  const getUser = () => {
    return new Promise((resolve, reject) => {
      UserControl.getUserByID(req.session.passport.user)
        .then((User) => {
          resolve(User)
        })
    })
  }

  const start = () => {
    return new Promise((resolve, reject) => {
      ThreadControl.getAllThreadByIdUser(req.session.passport.user)
        .then((data) => {
          resolve(data)
        })
    })
  }

  const waitFor = (ms) => new Promise(r => setTimeout(r, ms));

  async function asyncForEach(array, callback) {
    for (let index = 0; index < array.length; index += 1) {
      await callback(array[index], index, array);
    }
  }

  const ReadPushText = async (array) => {
    return new Promise(async (resolve, reject) => {
      await asyncForEach(array, async (element) => {
        //await waitFor(20)
        ThreadControl.readThread(element.pathfile_thread)
          .then((data) => {
            element.text = data
          })
      })
      await waitFor(20)
      resolve(array)
    })
  }

  getUser()
    .then((User) => { // getall about the User
      start()
        .then((data) => { //threads without text
          ReadPushText(data)
            .then((Threads) => { //Threads with Text
              res.render('pages/profile', { message: "message", User: User, threads: Threads })
            })
        })
    })




})

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