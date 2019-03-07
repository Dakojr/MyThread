const moment = require('moment')

ThreadClass = require('./../class/threadClass')

class ThreadDAO {
    constructor(dao) {
        this.dao = dao
    }

    getRandomThread(id_user) {
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
                        Thread.hashtag = element.hashtag
                        this.dao.get("SELECT id_thread, id_user FROM Like WHERE id_thread = '" + Thread.id_thread + "'  AND id_user = '" + id_user + "'")
                            .then((data) => {
                                if (data === undefined) {
                                    Thread.liked = false
                                } else {
                                    Thread.liked = true
                                }
                            })
                        arr.push(Thread)
                    });
                })
                .then(function () {
                    resolve(arr)
                })
        })
    }


    getThreadByIdUser(id_user, id_userIsLog) {
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
                        Thread.hashtag = element.hashtag
                        this.dao.get("SELECT id_thread, id_user FROM Like WHERE id_thread = '" + Thread.id_thread + "'  AND id_user = '" + id_userIsLog + "'")
                            .then((data) => {
                                if (data === undefined) {
                                    Thread.liked = false
                                } else {
                                    Thread.liked = true
                                }
                            })
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
                        Thread.hashtag = element.hashtag
                        Thread.text = null

                        arr.push(Thread)
                    });
                })
                .then(function () {
                    resolve(arr)
                })
        })
    }

    getThreadByHashtag(hashtag, id_userIsLog) {
        var arr = []
        return new Promise((resolve, reject) => {
            this.dao.all("SELECT t.*, u.username FROM thread t, user u WHERE hashtag = '" + hashtag + "' AND t.id_user = u.id_user ORDER BY t.date_thread DESC")
                .then((data) => {
                    data.forEach(element => {
                        const Thread = new ThreadClass()
                        Thread.id_thread = element.id_thread
                        Thread.thread_name = element.thread_name
                        Thread.pathfile_thread = element.pathfile_thread
                        Thread.date_thread = moment(element.date_thread).fromNow()
                        Thread.type = element.type
                        Thread.id_user = element.id_user
                        Thread.hashtag = element.hashtag
                        Thread.username = element.username
                        Thread.text = null
                        this.dao.get("SELECT id_thread, id_user FROM Like WHERE id_thread = '" + Thread.id_thread + "'  AND id_user = '" + id_userIsLog + "'")
                            .then((data) => {
                                if (data === undefined) {
                                    Thread.liked = false
                                } else {
                                    Thread.liked = true
                                }
                            })
                        arr.push(Thread)
                    });
                })
                .then(function () {
                    resolve(arr)
                })
        })
    }



    getAllThread(id_user) {
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
                        Thread.hashtag = element.hashtag
                        this.dao.get("SELECT id_thread, id_user FROM Like WHERE id_thread = '" + Thread.id_thread + "'  AND id_user = '" + id_user + "'")
                            .then((data) => {
                                if (data === undefined) {
                                    Thread.liked = false
                                } else {
                                    Thread.liked = true
                                }
                            })
                        this.dao.get("SELECT id_user, id_user_connect FROM follower WHERE id_user = '" + Thread.id_user + "'  AND id_user_connect = '" + id_user + "'")
                            .then((data) => {
                                if (data === undefined) {
                                    Thread.follow_user = false
                                } else {
                                    Thread.follow_user = true
                                }
                            })
                        arr.push(Thread)
                    });
                })
                .then(function () {
                    resolve(arr)
                })
        })
    }

    removeThread(id_thread) {
        return new Promise((resolve, reject) => {
            this.dao.run(
                `DELETE FROM thread
                WHERE id_thread = ?`,
                [id_thread])
        })
    }

    updateThread(id_thread, title, pathfile, hashtag) {
        return new Promise((resolve, reject) => {
            this.dao.run(
                `UPDATE thread
                SET thread_name = ?,
                    pathfile_thread = ?,
                    hashtag = ?
                WHERE id_thread = ?`,
                [title, pathfile, hashtag, id_thread])
        })
    }

    newThread(thread_name, pathfile_thread, type, id_user, hashtag) {
        return new Promise((resolve, reject) => {
            this.dao.run(
                `INSERT INTO thread (thread_name, pathfile_thread, TYPE, id_user, hashtag)
                VALUES (?, ?, ?, ?, ?)`,
                [thread_name, pathfile_thread, type, id_user, hashtag])
        })
    }
}

module.exports = ThreadDAO