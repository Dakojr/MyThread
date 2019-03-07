const Promise = require('bluebird')
const FollowDAOfs = require('./../models/followDAO')
const AppDAOfs = require('./../models/AppDAO')

module.exports = {
    FollowButton: (id_user, id_user_connect) => {
        const dao = new AppDAOfs('./db/mythread.db')
        const FollowDAO = new FollowDAOfs(dao)
        return new Promise((resolve, reject) => {
            FollowDAO.FollowButton(id_user, id_user_connect)
                .then(() => {
                    dao.db.close(() => {
                        console.log("BDD CLOSE !")
                    })
                    resolve("VOILA C FOLLOW MAIS VA VERIFIER")
                })
        })
    },

    unFollowButton: (id_user, id_user_connect) => {
        const dao = new AppDAOfs('./db/mythread.db')
        const FollowDAO = new FollowDAOfs(dao)
        return new Promise((resolve, reject) => {
            FollowDAO.unFollowButton(id_user, id_user_connect)
                .then(() => {
                    dao.db.close(() => {
                        console.log("BDD CLOSE !")
                    })
                    resolve("VOILA C DISLIKER MAIS VA VERIFIER")
                })
        })
    },

    getFollow: (id_user, id_user_connect) => {
        const dao = new AppDAOfs('./db/mythread.db')
        const FollowDAO = new FollowDAOfs(dao)
        return new Promise((resolve, reject) => {
            FollowDAO.getFollow(id_user, id_user_connect)
                .then((data) => {
                    dao.db.close(() => {
                        console.log("BDD CLOSE !")
                    })
                    resolve(data)
                })
        })
    }
}