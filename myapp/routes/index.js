const express = require('express')
var passport = require('passport')
require('./../config/passport')
var csurf = require('csurf')
var async = require('async')
var fileupload = require('express-fileupload')
const { check, oneOf, validationResult } = require('express-validator/check');
const fs = require('fs')

const router = express.Router()
router.use(fileupload({
  limits: { fileSize: 2 * 1024 * 1024 },
}))

var csurfProtect = csurf();
router.use(csurfProtect); //Every routes by him is Protect by Csrf protection


const utils = require('./../config/utils') //generation Token
const UserControl = require('./../controlers/usercontroler')
const ThreadControl = require('./../controlers/threadControlers')
const LikeControl = require('./../controlers/likeControler')
const FollowControl = require('./../controlers/followControler')



// HOME PAGE

router.get('/', isLoggedIn, (req, res, next) => {

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

router.get('/discover', isLoggedIn, (req, res, next) => {
  const start = () => {
    return new Promise((resolve, reject) => {
      ThreadControl.getRandomThreads(req.session.passport.user)
        .then((data) => {
          resolve(data)
        })
    })
  }


  start()
    .then((data) => {
      console.log(data)
      ReadPushText(data)
        .then((Threads) => {
          res.render('pages/index', { message: "message", threads: Threads, user_connect: req.session.passport.user, csurfToken: req.csrfToken() })
        })
    })
})


router.get('/notifications', isLoggedIn, (req, res, next) => {
  UserControl.newNotifFile(req.session.passport.user, 'notifications', 'HEHO')
  UserControl.setnotifpathfile(req.session.passport.user, '/' + req.session.passport.user + '/notifications/notifications.html')
  readNotif('./user/' + req.session.passport.user + '/notifications/notifications.html')
    .then((data) => {
      res.json(data)
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

router.post('/thread/newthread', isLoggedIn, [

  check('title', 'Title must have Alphanumeric character and contain no more than 20 characters').isAlphanumeric().isLength({ max: 20 }),
  check('thread_content', 'Thread Content must contain between 0 ans 255 characters').isLength({ min: 1, max: 255 }),
  check('hashtag', 'Hashtag must begin with "#" and contain Alphanumeric character and contain no more than 25 characters').matches(/^[#][a-zA-Z0-9.()-]/).isLength({ max: 25 })
], (req, res) => {

  var messages = [];

  if (!validationResult(req).isEmpty()) {
    var errors = req.validationErrors();
    if (errors) {
      errors.forEach(function (error) {
        messages.push(error.msg);
      })
      req.flash('errorThread', messages)
      res.redirect('/profile')
    }
  } else {

    arr = []

    ThreadControl.getAllThreadByIdUser(req.session.passport.user, req.session.passport.user)
      .then((data) => {
        if (data.length > 0) {
          data.forEach(element => {
            if (element.thread_name === req.body.title) {
              arr.push(element)
            }
          });
        }
        if (arr.length === 0) {
          ThreadControl.newThreadFile(req.session.passport.user, req.body.title, req.body.thread_content)
          ThreadControl.newThread(req.body.title, './user/' + req.session.passport.user + '/threads' + '/' + req.body.title + '.html', "N", req.session.passport.user, req.body.hashtag)
          res.redirect('/')
        } else {
          messages.push("Title already take")
          req.flash('errorThread', messages)
          res.redirect('/profile')
        }
      })
  }
})

router.get('/thread/delete?:id_thread', isLoggedIn, (req, res, next) => {
  ThreadControl.removeThread(req.query.id_thread)
  ThreadControl.removeFile('./user/' + req.session.passport.user + '/threads' + '/' + req.query.name_thread + '.html')
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

router.post('/thread/edit', isLoggedIn, [
  check('title', 'Title must have Alphanumeric character and contain no more than 20 characters').isAlphanumeric().isLength({ max: 20 }),
  check('thread_content', 'Thread Content must contain no more than 255 characters').isLength({ min: 1, max: 255 }),
  check('hashtag', 'Hashtag must begin with "#" and contain Alphanumeric character and contain no more than 25 characters').matches(/^[#][a-zA-Z0-9.()-]/).isLength({ max: 25 })
], (req, res, next) => {

  if (!validationResult(req).isEmpty()) {
    console.log(validationResult(req).mapped())
    var errors = req.validationErrors();
    if (errors) {
      var messages = [];
      errors.forEach(function (error) {
        messages.push(error.msg);
      })
      req.flash('errorThread', messages)
      res.redirect('/profile')
    }
  } else {
    ThreadControl.getThreadById(req.body.id_thread)
      .then((data) => {
        ThreadControl.removeFile(data[0].pathfile_thread)
        ThreadControl.newThreadFile(req.session.passport.user, req.body.title, req.body.thread_content)
        ThreadControl.updateThread(req.body.id_thread, req.body.title, './user/' + req.session.passport.user + '/threads' + '/' + req.body.title + '.html', req.body.hashtag)
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

// FOLLOWER

router.get('/displayfollower?:id_user', isLoggedIn, (req, res, next) => {
  UserControl.getFollowerByIdUser(req.query.id_user)
    .then((data) => {
      res.json(data)
    })
})

router.get('/displayfollow?:id_user', isLoggedIn, (req, res, next) => {
  UserControl.getFollowByIdUser(req.query.id_user)
    .then((data) => {
      res.json(data)
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
  var messages = req.flash('errorThread'); //Display the error message in passport.js
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
              UserControl.getFollowerCountByIdUser(req.session.passport.user)
                .then((follower) => {
                  User.follower = follower
                  UserControl.getFollowCountByIdUser(req.session.passport.user)
                    .then((follow) => {
                      User.follow = follow
                      ThreadControl.getThreadCountByIdUser(req.session.passport.user)
                        .then((threadcount) => {
                          Threads.threadcount = threadcount
                          res.render('pages/profile', { messages: messages, User: User, threads: Threads, csurfToken: req.csrfToken(), hasErrors: messages.length > 0 })
                        })
                    })
                })
            })
        })
    })
})

// PROFILES

router.get('/profiles?:username', isLoggedIn, (req, res, next) => {

  const waitFor = (ms) => new Promise(r => setTimeout(r, ms));

  UserControl.getUserByUsername(req.query.username, req.session.passport.user)
    .then((User) => {
      if (User.id_user === req.session.passport.user) {
        res.redirect('/profile')
      }
      ThreadControl.getAllThreadByIdUser(User.id_user, req.session.passport.user)
        .then((data) => {
          ReadPushText(data)
            .then((Threads) => {
              UserControl.getFollowerCountByIdUser(User.id_user)
                .then((follower) => {
                  User.follower = follower
                  UserControl.getFollowCountByIdUser(User.id_user)
                    .then((follow) => {
                      User.follow = follow
                      ThreadControl.getThreadCountByIdUser(User.id_user)
                        .then((threadcount) => {
                          Threads.threadcount = threadcount
                          res.render('pages/profiles', { User: User, threads: Threads, user_connect: req.session.passport.user, csurfToken: req.csrfToken() })
                        })
                    })
                })
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


router.get('/logout', isLoggedIn, function (req, res) {
  // clear the remember me cookie when logging out
  res.clearCookie('remember_me');
  req.logout();
  res.redirect('/');
});

router.post('/uploadavatar', isLoggedIn, (req, res) => {
  console.log(req.files.avatar.name)
  ThreadControl.newFolderAvatar(req.session.passport.user)
  UserControl.setpppathfile(req.session.passport.user, '/' + req.session.passport.user + '/avatar/avatar.jpg')
    .then(() => {
      req.files.avatar.mv('./user/' + req.session.passport.user + '/avatar/avatar.jpg', (err) => {
        if (err) {
          console.log(err)
        } else {
          console.log('its done')
          res.redirect('/profile')
        }
      })
    })
})



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

function readNotif(pathfile) {
  return new Promise((resolve, reject) => {
    ThreadControl.readThread(pathfile)
    .then((data) => {
      resolve(data)
    })
  })

}
