function Follow(id, id_user) {
    $.get("/follow", {
        id_user: id_user
    }, (data, status) => {
        if (data === false) {
            id.innerHTML = "Follow"
        } else {
            id.innerHTML = "Unfollow"
        }
    })
}

function DisplayFollower(id_user) {
    $.get("/displayfollower?id_user=" + id_user,
    function(data, status) {
        var htmlmodal = `<div class="modal fade" id="display_follower" tabindex="-1" role="dialog" aria-labelledby="exampleModalCenterTitle" aria-hidden="true">
    <div class="modal-dialog modal-dialog-centered" role="document">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title text-center">Follower</h5>
          <button type="button" class="close" onClick= "RemoveChild()" data-dismiss="modal" aria-label="Close">
            <span aria-hidden="true">&times;</span>
          </button>
        </div>
        <div class="modal-body">
        <ul class="list-group">`

        data.forEach(element => {
         htmlmodal +=  '<a href="/profiles?username=' + element.username +'" class="list-group-item">@' + element.username + '</a>'            
        });

        htmlmodal += `
        </ul>
        </div>
        <div class="modal-footer">
        <button type="button" onClick= "RemoveChild()" class="btn btn-secondary" data-dismiss="modal">Close</button>
        </div>
      </div>
    </div>
  </div>`

    $('#editmodal').append(htmlmodal);
    $('#display_follower').modal('show');

    })
}

function DisplayFollow(id_user) {
  $.get("/displayfollow?id_user=" + id_user,
  function(data, status) {
      var htmlmodal = `<div class="modal fade" id="display_follower" tabindex="-1" role="dialog" aria-labelledby="exampleModalCenterTitle"
            aria-hidden="true" data-backdrop="static" data-keyboard="false">
  <div class="modal-dialog modal-dialog-centered" role="document">
    <div class="modal-content">
      <div class="modal-header">
        <h5 class="modal-title text-center">Follower</h5>
        <button type="button" onClick= "RemoveChild()" class="close" data-dismiss="modal" aria-label="Close">
          <span aria-hidden="true">&times;</span>
        </button>
      </div>
      <div class="modal-body">
      <ul class="list-group">`

      data.forEach(element => {
       htmlmodal +=  '<a href="/profiles?username=' + element.username +'" class="list-group-item">@' + element.username + '</a>'            
      });

      htmlmodal += `
      </ul>
      </div>
      <div class="modal-footer">
        <button type="button" onClick= "RemoveChild()" class="btn btn-secondary" data-dismiss="modal">Close</button>
      </div>
    </div>
  </div>
</div>`

  $('#editmodal').append(htmlmodal);
  $('#display_follower').modal('show');

  })
}