var open = false;

function Edit(id) {
    var edit = document.getElementById('icon' + id)

    if (open) {
        id.className = 'fas fa-pen-alt edit'
    } else {
        id.className = 'fas fa-pen-alt edit open'
    }
    open = !open

    console.log(open)

}