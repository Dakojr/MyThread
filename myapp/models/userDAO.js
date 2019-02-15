UserClass = require('./../class/userClass')
var bcrypt = require('bcrypt-nodejs')

class UserDAO {
    constructor(dao) {
        this.dao = dao
    }

    getUser() {
        const User = new UserClass()
        return new Promise((resolve, reject) => {
            this.dao.all(`SELECT * FROM user`)
                .then((data) => {
                    data.forEach(element => {
                        User.id_user = element.id_user
                        User.username = element.username
                        User.password = element.password
                        User.email = element.email
                        User.telephone = element.telephone
                        User.date_user = element.date_user
                    });
                })
                .then(function () {
                    resolve(User)                    
                })
        })
    }

    create(username, password, email, telephone = "") {
        return this.dao.run(
            `INSERT INTO user (username, password, email, telephone)
            VALUES (?, ?, ?, ?)`,
            [username, password, email, telephone])
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
                    });
                })
                .then(function () {
                    resolve(User)
                })
        })
    }

    encryptPassword(password) {
        return bcrypt.hashSync(password, bcrypt.genSaltSync(5), null)
    }

    validPassword(reqpassword, password) {
        return bcrypt.compareSync(reqpassword, password, null)
    }
}
module.exports = UserDAO