class Thread {
    constructor(id_thread, thread_name, pathfile_thread, date_thread, type, id_user) {
        this.id_thread = id_thread
        this.thread_name = thread_name
        this.pathfile_thread = pathfile_thread
        this.date_thread = date_thread
        this.type = type
        this.id_user = id_user
    }
}

module.exports = Thread;