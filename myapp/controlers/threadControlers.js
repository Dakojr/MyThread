const Promise = require('bluebird')
var fs = require('fs')
const ThreadDAOfs = require('./../models/threadDAO')
const AppDAOfs = require('./../models/AppDAO')

module.exports = {

    getRandomThread: () => {
        const dao = new AppDAOfs('./db/mythread.db')
        const ThreadDAO = new ThreadDAOfs(dao)
        return new Promise((resolve, reject) => {
            ThreadDAO.getRandomThread()
                .then((data) => {
                    dao.db.close(() => {
                        console.log("BDD CLOSE !")
                    })
                    resolve(data)
                })
        })
    },

    getAllThreadByIdUser: (id_user) => {
        const dao = new AppDAOfs('./db/mythread.db')
        const ThreadDAO = new ThreadDAOfs(dao)
        return new Promise((resolve, reject) => {
            ThreadDAO.getThreadByIdUser(id_user)
                .then((data) => {
                    dao.db.close(() => {
                        console.log("BDD CLOSE !")
                    })
                    resolve(data)
                })
        })
    },

    getAllThread: () => {
        const dao = new AppDAOfs('./db/mythread.db')
        const ThreadDAO = new ThreadDAOfs(dao)
        return new Promise((resolve, reject) => {
            ThreadDAO.getAllThread()
                .then((data) => {
                    dao.db.close(() => {
                        console.log("BDD CLOSE !")
                    })
                    resolve(data)
                })
        })
    },

    getThreadById: (id_thread) => {
        const dao = new AppDAOfs('./db/mythread.db')
        const ThreadDAO = new ThreadDAOfs(dao)
        return new Promise((resolve, reject) => {
            ThreadDAO.getThreadById(id_thread)
                .then((data) => {
                    dao.db.close(() => {
                        console.log("BDD CLOSE !")
                    })
                    resolve(data)
                })
        })
    },

    updateThread: (id_thread, title, pathfile) => {
        const dao = new AppDAOfs('./db/mythread.db')
        const ThreadDAO = new ThreadDAOfs(dao)
        return new Promise((resolve, reject) => {
            ThreadDAO.updateThread(id_thread, title, pathfile)
                .then(() => {
                    dao.db.close(() => {
                        console.log("BDD CLOSEEEEEEEEEEEEEEEEEEEEE !")
                    })
                    resolve("VOILA C UPDATE MAIS VA VERIFIER")
                })
        })
    },

    removeFile: (oldpathfile) => {
        fs.unlink(oldpathfile, (err) => {
            if (err) {
                throw err
            } else {
                console.log("File is Removed")
            }
        })
    },

    readThread: (pathfile) => {
        return new Promise((resolve, reject) => {
            fs.open(pathfile, 'r', (err, fd) => {
                if (err) {
                    return console.log(err)
                }
                var buffr = new Buffer.alloc(1024)

                fs.read(fd, buffr, 0, buffr.length, 0, (err, bytes) => {
                    if (err) {
                        throw err
                    }
                    if (bytes > 0) {
                        var content = buffr.slice(0, bytes).toString().split("\n")
                    }
                    fs.close(fd, (err) => {
                        if (err) {
                            throw err
                        }
                    })
                    resolve(content)
                })
            })
        })
    },

    newThreadFile: (id_user, filename, content) => {
        fs.mkdir('./thread/' + id_user, { recursive: true }, (err) => {
            if (err) {
                throw err
            } else {
                console.log("Folder is Create")
            }
        })
        fs.appendFile('./thread/' + id_user + "/" + filename + '.html', content, (err) => {
            if (err) {
                throw err
            } else {
                console.log("File is Create")
            }
        })
    },

    newThread: (thread_name, pathfile_thread, TYPE, id_user) => {
        const dao = new AppDAOfs('./db/mythread.db')
        const ThreadDAO = new ThreadDAOfs(dao)
        return new Promise((resolve, reject) => {
            ThreadDAO.newThread(thread_name, pathfile_thread, TYPE, id_user)
                .then(() => {
                    console.log('PROMISE IS DONE')
                    dao.db.close(() => {
                        console.log("BDD CLOSE !")
                    })
                    resolve('ITS OKAAAAAY')
                })
        })
    }
}