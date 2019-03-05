const moment = require('moment')

ThreadClass = require('./../class/threadClass')

class ThreadDAO {
    constructor(dao) {
        this.dao = dao
    }

    getRandomThread() {
        var arr = []
        return new Promise((resolve, reject) => {
            this.dao.all("SELECT t.*, u.username FROM thread t, user u WHERE t.id_user = u.id_user ORDER BY random() LIMIT 1")
                .then((data) => {
                    data.forEach(element => {
                        const Thread = new ThreadClass()
                        Thread.id_thread = element.id_thread
                        Thread.thread_name = element.thread_name
                        Thread.pathfile_thread = element.pathfile_thread
                        Thread.date_thread = moment(element.date_thread).fromNow()
                        Thread.type = element.type
                        Thread.id_user = element.id_user
                        Thread.text = null
                        Thread.user = element.username
                        arr.push(Thread)
                    });
                })
                .then(function () {
                    resolve(arr)
                })
        })
    }


    getThreadByIdUser(id_user) {
        var arr = []
        return new Promise((resolve, reject) => {
            this.dao.all("SELECT * FROM thread WHERE id_user = '" + id_user + "'")
                .then((data) => {
                    data.forEach(element => {
                        const Thread = new ThreadClass()
                        Thread.id_thread = element.id_thread
                        Thread.thread_name = element.thread_name
                        Thread.pathfile_thread = element.pathfile_thread
                        Thread.date_thread = moment(element.date_thread).fromNow()
                        Thread.type = element.type
                        Thread.id_user = element.id_user
                        Thread.text = null
                        arr.push(Thread)
                    });
                })
                .then(function () {
                    resolve(arr)
                })
        })
    }

    getThreadById(id_thread) {
        var arr = []
        return new Promise((resolve, reject) => {
            this.dao.all("SELECT * FROM thread WHERE id_thread = '" + id_thread + "'")
                .then((data) => {
                    data.forEach(element => {
                        const Thread = new ThreadClass()
                        Thread.id_thread = element.id_thread
                        Thread.thread_name = element.thread_name
                        Thread.pathfile_thread = element.pathfile_thread
                        Thread.date_thread = moment(element.date_thread).fromNow()
                        Thread.type = element.type
                        Thread.id_user = element.id_user
                        Thread.text = null
                        arr.push(Thread)
                    });
                })
                .then(function () {
                    resolve(arr)
                })
        })
    }


    getAllThread() {
        var arr = []
        return new Promise((resolve, reject) => {
            this.dao.all("SELECT t.*, u.username FROM thread t, user u WHERE t.id_user = u.id_user ORDER BY t.date_thread DESC")
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

    updateThread(id_thread, title, pathfile) {
        return new Promise((resolve, reject) => {
            this.dao.run(
                `UPDATE thread
                SET thread_name = ?,
                    pathfile_thread = ?
                WHERE id_thread = ?`,
                [title, pathfile, id_thread])
        })
    }

    newThread(thread_name, pathfile_thread, type, id_user) {
        return new Promise((resolve, reject) => {
            this.dao.run(
                `INSERT INTO thread (thread_name, pathfile_thread, TYPE, id_user)
                VALUES (?, ?, ?, ?)`,
                [thread_name, pathfile_thread, type, id_user])
        })
    }
}

module.exports = ThreadDAO