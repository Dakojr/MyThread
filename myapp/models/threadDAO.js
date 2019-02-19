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
                        Thread.type = element.type
                        Thread.id_user = element.id_user
                    });
                })
                .then(function () {
                    resolve(Thread)
                })
        })
    }
}

module.exports = ThreadDAO