const moment = require('moment')

ThreadClass = require('./../class/threadClass')

class ThreadDAO {
    constructor(dao) {
        this.dao = dao
    }

    getThreadByIdUser(id_user) {
        const Thread = new ThreadClass()
        return new Promise((resolve, reject) => {
            this.dao.all("SELECT * FROM thread WHERE id_user = '" + id_user + "'")
                .then((data) => {
                    data.forEach(element => {
                        Thread.id_thread = element.id_thread
                        Thread.thread_name = element.thread_name
                        Thread.pathfile_thread = element.pathfile_thread
                        Thread.date_thread = element.date_thread
                        Thread.type = element.type
                        Thread.id_user = element.id_user
                    });
                })
                .then(function () {
                    resolve(Thread)
                })
        })
    }

    getAllThread() {
        var arr = []
        return new Promise((resolve, reject) => {
            this.dao.all("SELECT t.*, u.username FROM thread t, user u WHERE t.id_user = u.id_user")
                .then((data) => {
                    data.forEach(element => {
                        const Thread = new ThreadClass()
                        Thread.id_thread = element.id_thread
                        Thread.thread_name = element.thread_name
                        Thread.pathfile_thread = element.pathfile_thread
                        Thread.date_thread = moment(element.date_thread).fromNow()
                        Thread.type = element.type
                        Thread.id_user = element.id_user
                        Thread.username = element.username
                        Thread.text = null
                        arr.push(Thread)
                    });
                })
                .then(function () {
                    resolve(arr)
                })
        })
    }
}

module.exports = ThreadDAO