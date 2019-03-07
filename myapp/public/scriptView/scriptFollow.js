function Follow(id, id_user) {
    $.get("/follow", {
        id_user: id_user
    },  (data, status) => {
        if(data === false) {
            id.innerHTML = "Follow"
        } else {
            id.innerHTML = "Unfollow"
        }
    })
}