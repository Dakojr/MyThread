const Promise = require('bluebird')

const UserDAOfs = require('./../models/userDAO')
const AppDAOfs = require('./../models/AppDAO')
const Userfs = require('./../class/userClass')

module.exports = {

    getUserByID: (id) => {
        const dao = new AppDAOfs('./db/mythread.db')
        const UserDAO = new UserDAOfs(dao)
        return new Promise((resolve, reject) => {
            UserDAO.getUserByID(id)
                .then((data) => {
                    dao.db.close(() => {
                        console.log("BDD CLOSE !")
                    })
                    resolve(data)
                })
        })
    },

    getUserByUsername: (username) => {
        const dao = new AppDAOfs('./db/mythread.db')
        const UserDAO = new UserDAOfs(dao)
        return new Promise((resolve, reject) => {
            UserDAO.getUserByUsername(username)
                .then((data) => {
                    dao.db.close(() => {
                        console.log("BDD CLOSE !")
                    })
                    resolve(data)
                })
        })
    }
}
