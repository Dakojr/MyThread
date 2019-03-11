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

    getUserByUsername: (username, id_user_connect) => {
        const dao = new AppDAOfs('./db/mythread.db')
        const UserDAO = new UserDAOfs(dao)
        return new Promise((resolve, reject) => {
            UserDAO.getUserByUsername(username, id_user_connect)
                .then((data) => {
                    dao.db.close(() => {
                        console.log("BDD CLOSE !")
                    })
                    resolve(data)
                })
        })
    },

    getFollowerCountByIdUser: (id_user) => {
        const dao = new AppDAOfs('./db/mythread.db')
        const UserDAO = new UserDAOfs(dao)
        return new Promise((resolve, reject) => {
            UserDAO.getFollowerCountByIdUser(id_user)
                .then((data) => {
                    dao.db.close(() => {
                        console.log("BDD CLOSE !")
                    })
                    resolve(data)
                })
        })
    }, 

    getFollowCountByIdUser: (id_user) => {
        const dao = new AppDAOfs('./db/mythread.db')
        const UserDAO = new UserDAOfs(dao)
        return new Promise((resolve, reject) => {
            UserDAO.getFollowCountByIdUser(id_user)
                .then((data) => {
                    dao.db.close(() => {
                        console.log("BDD CLOSE !")
                    })
                    resolve(data)
                })
        })
    },

    getFollowerByIdUser: (id_user) => {
        const dao = new AppDAOfs('./db/mythread.db')
        const UserDAO = new UserDAOfs(dao)
        return new Promise((resolve, reject) => {
            UserDAO.getFollowerByIdUser(id_user)
                .then((data) => {
                    dao.db.close(() => {
                        console.log("BDD CLOSE !")
                    })
                    resolve(data)
                })
        })
    }, 

    getFollowByIdUser: (id_user) => {
        const dao = new AppDAOfs('./db/mythread.db')
        const UserDAO = new UserDAOfs(dao)
        return new Promise((resolve, reject) => {
            UserDAO.getFollowByIdUser(id_user)
                .then((data) => {
                    dao.db.close(() => {
                        console.log("BDD CLOSE !")
                    })
                    resolve(data)
                })
        })
    }
}
