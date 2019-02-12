class UserRepository {
    constructor(dao) {
        this.dao = dao
    }

    getUser() {
        return this.dao.all(`SELECT * FROM user`)
    }
}

module.exports = UserRepository