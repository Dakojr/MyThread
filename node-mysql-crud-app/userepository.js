class UserRepository {
    constructor(dao) {
        this.dao = dao
    }

    getConnect() {
        const sql = `
        SELECT * FROM USER`
        return this.dao.all(sql)
    }

    getUser() {
        return this.dao.all(`SELECT * FROM user`)
    }
}

module.exports = UserRepository