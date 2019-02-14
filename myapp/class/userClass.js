var bcrypt = require('bcrypt-nodejs')

class User {
    constructor(id_user, username, password, email, telephone, date_user) {
        this.id_user = id_user
        this.username = username
        this.password = password
        this.email = email
        this.telephone = telephone
        this.date_user = date_user
    }
}

module.exports = User;