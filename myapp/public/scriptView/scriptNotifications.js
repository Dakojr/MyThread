function DisplayNotifications() {
    $.get('/notifications',
        function (data, status) {
            var htmlmodal = `
                <div class="modal fade" id="notifications" tabindex="-1" role="dialog" aria-labelledby="exampleModalCenterTitle" aria-hidden="true">
                    <div class="modal-dialog modal-dialog-centered" role="document">
                        <div class="modal-content">
                            <div class="modal-header">
                                <h5 class="modal-title" id="exampleModalCenterTitle">Modal title</h5>
                                <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                                    <span aria-hidden="true">&times;</span>
                                </button>
                            </div>
                            <div class="modal-body">
                        <ul class="list-group">`

            data.forEach(element => {
                htmlmodal += '<li class="list-group-item">' + element + '</li>'
            });

            htmlmodal += `
                          </ul>
                            </div>
                            <div class="modal-footer">
                                <button type="button" class="btn btn-secondary" onClick="RemoveChild()" data-dismiss="modal">Close</button>
                            </div>
                        </div>
                    </div>
                </div>`

            $('#editmodal').append(htmlmodal);
            $('#notifications').modal('show');
        })
}