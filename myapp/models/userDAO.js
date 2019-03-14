UserClass = require('./../class/userClass')
var bcrypt = require('bcrypt-nodejs')

class UserDAO {
    constructor(dao) {
        this.dao = dao
    }

    getUserByID(id) {
        const User = new UserClass()
        return new Promise((resolve, reject) => {
            this.dao.all("SELECT id_user, username, email, telephone, date_user, pppathfile FROM user WHERE id_user = '" + id + "'")
                .then((data) => {
                    data.forEach(element => {
                        User.id_user = element.id_user
                        User.username = element.username
                        User.email = element.email
                        User.telephone = element.telephone
                        User.date_user = element.date_user
                        User.pppathfile = element.pppathfile

                    });
                })
                .then(function () {
                    resolve(User)
                })
        })
    }

    getUserByUsername(username, id_user_connect) {
        const User = new UserClass()
        return new Promise((resolve, reject) => {
            this.dao.all("SELECT id_user, username, email, telephone, date_user, pppathfile FROM user WHERE username = '" + username + "'")
                .then((data) => {
                    data.forEach(element => {
                        User.id_user = element.id_user
                        User.username = element.username
                        User.email = element.email
                        User.telephone = element.telephone
                        User.date_user = element.date_user
                        User.pppathfile = element.pppathfile

                        this.dao.get("SELECT id_user, id_user_connect FROM follower WHERE id_user = '" + User.id_user + "'  AND id_user_connect = '" + id_user_connect + "'")
                            .then((data) => {
                                console.log
                                if (data === undefined) {
                                    User.follow_user = false
                                    resolve(User)
                                } else {
                                    User.follow_user = true
                                    resolve(User)
                                }
                            })
                    });
                })
        })
    }

    // FOLLOW & FOLLOWER COUNT

    getFollowerCountByIdUser(id_user) {
        return new Promise((resolve, reject) => {
            var follower = []
            this.dao.all("SELECT COUNT(*) FROM follower WHERE id_user = '" + id_user + "'")
                .then((data) => {
                    data.forEach(element => {
                        follower.push(element)
                    });
                })
                .then(() => {
                    resolve(follower)
                })
        })
    }

    getFollowCountByIdUser(id_user) {
        return new Promise((resolve, reject) => {
            var follow = []
            this.dao.all("SELECT COUNT(*) FROM follower WHERE id_user_connect = '" + id_user + "'")
                .then((data) => {
                    data.forEach(element => {
                        follow.push(element)
                    });
                })
                .then(() => {
                    resolve(follow)
                })
        })
    }

    //FOLLOW & FOLLOWER

    getFollowerByIdUser(id_user) {
        return new Promise((resolve, reject) => {
            var follower = []
            this.dao.all("SELECT f.id_user_connect, u.username FROM follower f, user u WHERE f.id_user = '" + id_user + "' AND f.id_user_connect = u.id_user")
                .then((data) => {
                    data.forEach(element => {
                        follower.push(element)
                    });
                })
                .then(() => {
                    resolve(follower)
                })
        })
    }

    getFollowByIdUser(id_user) {
        return new Promise((resolve, reject) => {
            var follow = []
            this.dao.all("SELECT f.id_user, u.username FROM follower f, user u WHERE f.id_user_connect = '" + id_user + "' AND f.id_user = u.id_user")
                .then((data) => {
                    data.forEach(element => {
                        follow.push(element)
                    });
                })
                .then(() => {
                    resolve(follow)
                })
        })
    }

    getUserByEmail(email) {
        const User = new UserClass()
        return new Promise((resolve, reject) => {
            this.dao.all("SELECT * FROM user WHERE email = '" + email + "'")
                .then((data) => {
                    data.forEach(element => {
                        User.id_user = element.id_user
                        User.username = element.username
                        User.password = element.password
                        User.email = element.email
                        User.telephone = element.telephone
                        User.date_user = element.date_user
                        User.pppathfile = element.pppathfile
                    });
                })
                .then(function () {
                    resolve(User)
                })
        })
    }

    setpppathfile(id_user_connect, pathfile) {
        return this.dao.run(
            `UPDATE user
            SET pppathfile = ?
            WHERE id_user = ?`,
            [pathfile, id_user_connect])

    }

    create(username, password, email, telephone = "") {
        return this.dao.run(
            `INSERT INTO user (username, password, email, telephone) 
            VALUES (?, ?, ?, ?)`,
            [username, password, email, telephone])
    }

    encryptPassword(password) {
        return bcrypt.hashSync(password, bcrypt.genSaltSync(5), null)
    }

    validPassword(reqpassword, password) {
        return bcrypt.compareSync(reqpassword, password, null)
    }
}
module.exports = UserDAO