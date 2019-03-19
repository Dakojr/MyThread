var LocalStrategy = require('passport-local').Strategy
var AppDAOfs = require('./../models/AppDAO')
var UserClass = require('./../class/userClass')
var UserDAOfs = require('./../models/userDAO')
var passport = require('passport')
var RememberMeStrategy = require('passport-remember-me').Strategy

// expose this function to our app using module.exports
// module.exports = function () {

// =========================================================================
// LOCAL SIGNUP =============================================================
// =========================================================================

// used to serialize the user for the session
passport.serializeUser(function (user, done) {
    done(null, user.id_user);
})

// used to deserialize the user
passport.deserializeUser(function (id, done) {
    const dao = new AppDAOfs('./db/mythread.db')

    dao.all("SELECT * FROM user WHERE id_user = " + id)
        .then((data) => {
            dao.db.close(() => {
                console.log("BDD CLOSE !")
            })
            done(null, data[0])
        })
})

var tokens = {}

function consumeRememberMeToken(token, fn) {
    var uid = tokens[token];
    // invalidate the single-use token
    delete tokens[token];
    return fn(null, uid);
}

function saveRememberMeToken(token, uid, fn) {
    tokens[token] = uid;
    return fn();
}

function issueToken(user, done) {
    var token = utils.randomString(64);
    saveRememberMeToken(token, user.id, function (err) {
        if (err) { return done(err); }
        return done(null, token);
    });
}

passport.use(new RememberMeStrategy(
    function (token, done) {
        consumeRememberMeToken(token, function (err, uid) {
            if (err) { return done(err); }
            if (!uid) { return done(null, false); }

            findById(uid, function (err, user) {
                if (err) { return done(err); }
                if (!user) { return done(null, false); }
                return done(null, user);
            });
        });
    },
    issueToken
));

passport.use('local.signup', new LocalStrategy({

    // by default, local strategy uses username and password, we will override with email
    usernameField: 'username',
    passwordField: 'password',
    passReqToCallback: true // allows us to pass back the entire request to the callback
},
    function (req, username, password, done) {

        if(req.body.password !== req.body.passwordConfirm) {
            var messages = [];
            messages.push("Les deux mot de passe se sont pas pareil")
            return done(null, false, req.flash('error', messages));
        }

        const dao = new AppDAOfs('./db/mythread.db')
        req.checkBody('email', 'Invalid E-mail').notEmpty().isEmail();
        req.checkBody('password', 'Invalid Password').notEmpty();
        req.check("password", "Password Must have 8 character, 1 UpperCase, 1 LowerCase").matches(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])[0-9a-zA-Z]{8,}$/);
        var errors = req.validationErrors();
        if (errors) {
            var messages = [];
            errors.forEach(function (error) {
                messages.push(error.msg); //msg is import by npm validator
            })
            return done(null, false, req.flash('error', messages));
        }

        // find a user whose email is the same as the forms email
        // we are checking to see if the user trying to login already exists
        dao.all("SELECT * FROM user WHERE email = '" + req.body.email + "'")
            .then((data) => {
                if (data.length) {
                    console.log("email already taken")
                    return done(null, false, { message: "Email is already in use !" })
                } else {
                    var email = req.body.email
                    var UserDAO = new UserDAOfs(dao)
                    password = UserDAO.encryptPassword(password)
                    UserDAO.create(username, password, email)
                    console.log('its gone')
                    UserDAO.getUserByEmail(email)
                        .then((user) => {
                            dao.db.close(() => {
                                console.log("BDD CLOSE !")
                            })
                            return done(null, user)
                        })
                }
            })
    }));

passport.use('local.signin', new LocalStrategy({

    usernameField: 'email',
    passwordField: 'password',
    passReqToCallback: true // allows us to pass back the entire request to the callback

},
    function (req, email, password, done) {
        const dao = new AppDAOfs('./db/mythread.db')

        req.checkBody('email', 'Invalid E-mail').notEmpty().isEmail();
        req.checkBody('password', 'Invalid Password').notEmpty();
        var errors = req.validationErrors();
        if (errors) {
            var messages = [];
            errors.forEach(function (error) {
                messages.push(error.msg); //msg is import by npm validator
            })
            return done(null, false, req.flash('error', messages));
        }

        var UserDAO = new UserDAOfs(dao)

        dao.all("SELECT * FROM user WHERE email = '" + req.body.email + "'")
            .then((data) => {
                if (!data.length) {
                    console.log("No User Found !")
                    return done(null, false, { message : "No User Found !"})
                } else if (!UserDAO.validPassword(password, data[0].password)) {
                    console.log("Bad PassWord !")
                    return done(null, false, { message : "Bad Password !"})
                } else {
                    UserDAO.getUserByEmail(email)
                        .then((user) => {
                            dao.db.close(() => {
                                console.log("BDD CLOSE !")
                            })
                            return done(null, user)
                        })
                }
            })
    }))