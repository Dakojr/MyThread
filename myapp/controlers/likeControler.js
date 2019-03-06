const Promise = require('bluebird')
const LikeDAOfs = require('./../models/likeDAO')
const AppDAOfs = require('./../models/AppDAO')

module.exports = {
    LikeButton: (id_thread, id_user) => {
        const dao = new AppDAOfs('./db/mythread.db')
        const LikeDAO = new LikeDAOfs(dao)
        return new Promise((resolve, reject) => {
            LikeDAO.LikeButton(id_thread, id_user)
                .then(() => {
                    dao.db.close(() => {
                        console.log("BDD CLOSE !")
                    })
                    resolve("VOILA C LIKER MAIS VA VERIFIER")
                })
        })
    },

    disLikeButton: (id_thread, id_user) => {
        const dao = new AppDAOfs('./db/mythread.db')
        const LikeDAO = new LikeDAOfs(dao)
        return new Promise((resolve, reject) => {
            LikeDAO.disLikeButton(id_thread, id_user)
                .then(() => {
                    dao.db.close(() => {
                        console.log("BDD CLOSE !")
                    })
                    resolve("VOILA C DISLIKER MAIS VA VERIFIER")
                })
        })
    },

    getLike: (id_thread, id_user) => {
        const dao = new AppDAOfs('./db/mythread.db')
        const LikeDAO = new LikeDAOfs(dao)
        return new Promise((resolve, reject) => {
            LikeDAO.getLike(id_thread, id_user)
                .then((data) => {
                    dao.db.close(() => {
                        console.log("BDD CLOSE !")
                    })
                    resolve(data)
                })
        })
    }
}