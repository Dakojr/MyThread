class UserClass {
    constructor(id_user, username, password, email, telephone, date_user) {
        this.id_user = id_user
        this.username = username
        this.password = password
        this.email = email
        this.telephone = telephone
        this.date_user = date_user
    }
}

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
}

module.exports = UserDAO