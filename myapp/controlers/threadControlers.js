const Promise = require('bluebird')
var fs = require('fs')

const ThreadDAOfs = require('./../models/threadDAO')
const AppDAOfs = require('./../models/AppDAO')

module.exports = {

    getThreadByIdUser: (id_user) => {
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
                        console.log(content)
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
    }
}