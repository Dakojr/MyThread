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
const LikeControl = require('./../controlers/likeControler')
const FollowControl = require('./../controlers/followControler')

// HOME PAGE

router.get('/', isLoggedIn, function (req, res, next) {

  const start = () => {
    return new Promise((resolve, reject) => {
      ThreadControl.getAllThread(req.session.passport.user)
        .then((data) => {
          resolve(data)
        })
    })
  }


  start()
    .then((data) => {
      ReadPushText(data)
        .then((Threads) => {
          res.render('pages/index', { message: "message", threads: Threads, user_connect: req.session.passport.user, csurfToken: req.csrfToken() })
        })
    })

})

router.get('/thread?:hashtag', isLoggedIn, (req, res, next) => {
  ThreadControl.getThreadByHashtag(req.query.hashtag, req.session.passport.user)
    .then((data) => {
      ReadPushText(data)
        .then((Threads) => {
          res.render('pages/index', { message: "message", threads: Threads, csurfToken: req.csrfToken(), hashtag: req.query.hashtag, user_connect: req.session.passport.user })
        })
    })
})


router.post('/thread/newthread', isLoggedIn, (req, res, next) => {
  var regex = /^A-Za-z0-9/

  var RegexResultTitle = regex.test(req.body.title)
  var RegexResultContent = regex.test(req.body.thread_content)

  if (RegexResultTitle === false && RegexResultContent === false) {
    res.redirect('/profile')
  } else {
    ThreadControl.newThreadFile(req.session.passport.user, req.body.title, req.body.thread_content)
    ThreadControl.newThread(req.body.title, './thread/' + req.session.passport.user + '/' + req.body.title + '.html', "N", req.session.passport.user, req.body.hashtag)
    res.redirect('/')
  }


})

router.get('/thread/delete?:id_thread', isLoggedIn, (req, res, next) => {
  ThreadControl.removeThread(req.query.id_thread)
  res.redirect('/profile')
})


router.get('/thread/edit', isLoggedIn, (req, res, next) => {
  ThreadControl.getThreadById(req.query.id_thread)
    .then((data) => {
      ReadPushText(data)
        .then((Thread) => {
          res.json(Thread);
        })
    })
})

router.post('/thread/edit', isLoggedIn, (req, res, next) => {

  var regex = /^A-Za-z0-9/

  var RegexResultTitle = regex.test(req.body.title)
  var RegexResultContent = regex.test(req.body.thread_content)

  if (RegexResultTitle === false && RegexResultContent === false) {
    res.redirect('/profile')
  } else {
    ThreadControl.getThreadById(req.body.id_thread)
      .then((data) => { 
        ThreadControl.removeFile(data[0].pathfile_thread)
        ThreadControl.newThreadFile(req.session.passport.user, req.body.title, req.body.thread_content)
        ThreadControl.updateThread(req.body.id_thread, req.body.title, './thread/' + req.session.passport.user + '/' + req.body.title + '.html', req.body.hashtag)
        res.redirect('/')
      })
  }
})

router.get('/thread/random', isLoggedIn, (req, res, next) => {
  ThreadControl.getRandomThread(req.session.passport.user)
    .then((data) => {
      ReadPushText(data)
        .then((Thread) => {
          Thread[0].id_user_connect = req.session.passport.user
          res.json(Thread)
        })
    })
})

// FOLLOW BUTTON

router.get('/follow', isLoggedIn, (req, res, next) => {
  FollowControl.getFollow(req.query.id_user, req.session.passport.user)
    .then((data) => {
      if (data === false) {
        FollowControl.FollowButton(req.query.id_user, req.session.passport.user)
        bool = true
        res.json(bool)
      } else {
        FollowControl.unFollowButton(req.query.id_user, req.session.passport.user)
        bool = false
        res.json(bool)
      }
    })
})


// LIKE BUTTON

router.get('/like', isLoggedIn, (req, res, next) => {
  var bool;
  LikeControl.getLike(req.query.id_thread, req.session.passport.user)
    .then((data) => {
      if (data === false) {
        LikeControl.LikeButton(req.query.id_thread, req.session.passport.user)
        bool = true
        res.json(bool)
      } else {
        LikeControl.disLikeButton(req.query.id_thread, req.session.passport.user)
        bool = false
        res.json(bool)
      }
    })
})



//USER ROUTES

//PROFIL
router.get('/profile', isLoggedIn, function (req, res, next) {
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
      ThreadControl.getAllThreadByIdUser(req.session.passport.user, req.session.passport.user)
        .then((data) => {
          resolve(data)
        })
    })
  }

  getUser()
    .then((User) => { // getall about the User
      start()
        .then((data) => { //threads without text
          ReadPushText(data)
            .then((Threads) => { //Threads with Text
              res.render('pages/profile', { message: "message", User: User, threads: Threads, csurfToken: req.csrfToken() })
            })
        })
    })
})

// PROFILES

router.get('/profiles?:username', isLoggedIn, (req, res, next) => {

  const waitFor = (ms) => new Promise(r => setTimeout(r, ms));

  UserControl.getUserByUsername(req.query.username, req.session.passport.user)
    .then((User) => {
      console.log(User)
      if (User.id_user === req.session.passport.user) {
        res.redirect('/profile')
      }
      ThreadControl.getAllThreadByIdUser(User.id_user, req.session.passport.user)
        .then((data) => {
          ReadPushText(data)
            .then((Threads) => {
              res.render('pages/profiles', { User: User, threads: Threads, user_connect: req.session.passport.user, csurfToken: req.csrfToken() })
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