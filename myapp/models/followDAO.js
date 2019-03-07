FollowClass = require('./../class/followClass')

class FollowDAO {
    constructor(dao) {
        this.dao = dao
    }

    FollowButton(id_user, id_user_connect) {
        return new Promise((resolve, reject) => {
            this.dao.run(
                `INSERT INTO follower (id_user, id_user_connect)
                VALUES (?, ?)`,
                [id_user, id_user_connect])
        })
    }

    unFollowButton(id_user, id_user_connect) {
        return new Promise((resolve, reject) => {
            this.dao.run(
                `DELETE FROM follower
                WHERE id_user =` + id_user + ` AND  id_user_connect =` + id_user_connect,
            )
        })
    }

    getFollow(id_user, id_user_connect) {
        var arr = []
        var boolFol = false
        return new Promise((resolve, reject) => {
            this.dao.all("SELECT id_user, id_user_connect FROM follower WHERE id_user = '" + id_user + "'  AND id_user_connect = '" + id_user_connect + "'")
                .then((data) => {
                    data.forEach(element => {
                        const Follow = new FollowClass()
                        Follow.id_user = element.id_user
                        Follow.id_user_connect = element.id_user_connect
                        arr.push(Follow)
                    });
                })
                .then(function () {
                    if (arr.length === 0) {
                        resolve(boolFol)
                    }
                    resolve(arr)
                })
        })
    }
}

module.exports = FollowDAO