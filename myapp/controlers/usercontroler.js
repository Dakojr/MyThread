const Promise = require('bluebird')

const UserRepositry = require('./../models/userDAO')
const AppDAO = require('./../models/AppDAO')

module.exports = {

    getUser: function getTheUser(req, res) {
        const dao = new AppDAO('./db/mythread.db')
        const UserRepo = new UserRepositry(dao)

        let User

        return new Promise((resolve, reject) => {
            UserRepo.getUser()
            .then((data) => {
                User = data
                return User
            })
            .then(function () {
                //console.log(User)
                resolve({user: User})
            })
        })



    }

}
