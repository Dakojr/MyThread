const Promise = require('bluebird')

const UserDAOfs = require('./../models/userDAO')
const AppDAOfs = require('./../models/AppDAO')
const Userfs = require('./../class/userClass')

module.exports = {

    getUser: (req, res) => {
        const dao = new AppDAOfs('./db/mythread.db')
        const UserDAO = new UserDAOfs(dao)
        return new Promise((resolve, reject) => {
        UserDAO.getUser()
            .then((data) => {
                resolve(data)
            })            
        })

        // return new Promise((resolve, reject) => {
        //     UserDAO.getUser()
        //         .then((data) => {
        //             data.forEach(element => {
        //                 User.id_user = element.id_user
        //                 User.username = element.username
        //                 User.password = element.password
        //                 User.email = element.email
        //                 User.telephone = element.telephone
        //                 User.date_user = element.date_user
        //             });
        //         })
        //         .then(function () {
        //             resolve(User)
        //         })
        // })
    }
}
