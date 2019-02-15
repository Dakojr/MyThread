var LocalStrategy = require('passport-local').Strategy
var AppDAOfs = require('./../models/AppDAO')
var UserClass = require('./../class/userClass')
var UserDAOfs = require('./../models/userDAO')
var passport = require('passport')

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

passport.use('local.signup', new LocalStrategy({


    // by default, local strategy uses username and password, we will override with email
    usernameField: 'username',
    passwordField: 'password',
    passReqToCallback: true // allows us to pass back the entire request to the callback
},
    function (req, username, password, done) {
        const dao = new AppDAOfs('./db/mythread.db')


        // find a user whose email is the same as the forms email
        // we are checking to see if the user trying to login already exists
        dao.all("SELECT * FROM user WHERE email = '" + req.body.email + "'")
            .then((data) => {
                if (data.length) {
                    console.log("email already taken")
                    return done(null, false)
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

        // req.checkBody('email', 'Invalid E-mail').notEmpty().isEmail()
        // req.checkBody('password', 'Invalid Password').notEmpty().isEmail()

        var UserDAO = new UserDAOfs(dao)

        dao.all("SELECT * FROM user WHERE email = '" + req.body.email + "'")
            .then((data) => {
                if (!data.length) {
                    console.log("No User Found !")
                    return done(null, false)
                } else if (!UserDAO.validPassword(password, data[0].password)) {
                    console.log("Bad PassWord !")
                    return done(null, false)
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



// =========================================================================
// LOCAL LOGIN =============================================================
// =========================================================================

// passport.use('local-login', new LocalStrategy({
//     // by default, local strategy uses username and password, we will override with email
//     usernameField: 'email',
//     passwordField: 'password',
//     passReqToCallback: true // allows us to pass back the entire request to the callback
// },
//     function (req, email, password, done) { // callback with email and password from our form

//         connection.query("SELECT * FROM `users` WHERE `email` = '" + email + "'", function (err, rows) {
//             if (err)
//                 return done(err);
//             if (!rows.length) {
//                 return done(null, false, req.flash('loginMessage', 'No user found.')); // req.flash is the way to set flashdata using connect-flash
//             }

//             // if the user is found but the password is wrong
//             if (!(rows[0].password == password))
//                 return done(null, false, req.flash('loginMessage', 'Oops! Wrong password.')); // create the loginMessage and save it to session as flashdata

//             // all is well, return successful user
//             return done(null, rows[0]);

//         });
//     }));

// };