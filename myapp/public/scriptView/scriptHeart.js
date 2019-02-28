((document) => {
    var icon = document.getElementById('icon')
    var open = false;

    icon.addEventListener('click', function () {
        if (open) {
            icon.className = 'fas fa-heart'
        } else {
            icon.className = 'fas fa-heart open'
        }
        open = !open
    });
})(document)

((document) => {
    var edit = document.getElementById('edit')
    var open = false;

    edit.addEventListener('click', function () {
        if (open) {
            edit.className = 'fas fa-pen-alt'
        } else {
            edit.className = 'fas fa-pen-alt open'
        }
        open = !open
    });
})(document)
