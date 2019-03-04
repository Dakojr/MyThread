function myHeart(id) {
    if (id.className === "fas fa-heart font-awesome") {
        id.classList.add('open')
    } else {
        id.classList.remove('open')
    }
}

function Thread(id_thread) {
    $.get("/thread/edit",
        {
            id_thread: id_thread
        },
        function (data, status) {
            var htmlmodal = `<div class="modal fade" id="exampleModal" tabindex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
            <div class="modal-dialog" role="document">
              <div class="modal-content">
                <div class="modal-header"><h5 class="modal-title" id="exampleModalLabel"> <%= `data[0] `%></h5> 
                  <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                    <span aria-hidden="true">&times;</span>
                  </button>
                </div>
                <div class="modal-body">
                  ...
                </div>
                <div class="modal-footer">
                  <button type="button" class="btn btn-secondary" data-dismiss="modal">Close</button>
                  <button type="button" class="btn btn-primary">Save changes</button>
                </div>
              </div>
            </div>
          </div>`


            $('#editmodal').append(htmlmodal);
            $('#exampleModal').modal('show');
            console.log(data[0].id_thread)
        });

}
