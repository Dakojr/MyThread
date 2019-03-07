LikeClass = require('./../class/likeClass')

class LikeDAO {
    constructor(dao) {
        this.dao = dao
    }

    LikeButton(id_thread, id_user) {
        return new Promise((resolve, reject) => {
            this.dao.run(
                `INSERT INTO Like (id_thread, id_user)
                VALUES (?, ?)`,
                [id_thread, id_user])
        })
    }

    disLikeButton(id_thread, id_user) {
        return new Promise((resolve, reject) => {
            this.dao.run(
                `DELETE FROM Like
                WHERE id_thread =` + id_thread + ` AND  id_user =` + id_user,
            )
        })
    }

    getLike(id_thread, id_user) {
        var arr = []
        var bool = false
        return new Promise((resolve, reject) => {
            this.dao.all("SELECT id_thread, id_user FROM Like WHERE id_thread = '" + id_thread + "'  AND id_user = '" + id_user + "'")
                .then((data) => {
                    data.forEach(element => {
                        const Like = new LikeClass()
                        Like.id_thread = element.id_thread
                        Like.id_user = element.id_user
                        arr.push(Like)
                    });
                })
                .then(function () {
                    if (arr.length === 0) {
                        resolve(bool)
                    }
                    resolve(arr)
                })
        })
    }
}

module.exports = LikeDAO