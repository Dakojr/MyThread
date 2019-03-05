function myHeart(id) {
  if (id.className === "fas fa-heart font-awesome") {
    id.classList.add('open')
  } else {
    id.classList.remove('open')
  }
}

function RemoveChild() {
  var element = document.getElementById("editmodal");
  while (element.firstChild) {
    element.removeChild(element.firstChild);
  }
}

function Thread(id_thread) {
  $.get("/thread/edit",
    {
      id_thread: id_thread
    },
    function (data, status) {
      var csurfToken = document.getElementsByName('_csrf')[0].defaultValue

      var htmlmodal = `<div class="modal fade" id="updatethread" tabindex="-1" role="dialog" aria-labelledby="exampleModalCenterTitle"
            aria-hidden="true" data-backdrop="static" data-keyboard="false">
            <div class="modal-dialog modal-dialog-centered" role="document">
                <div class="modal-content">
                    <div class="modal-header d-flex justify-content-center">
                        <h4 class="">Updating Thread</h4>
                        <i class="far fa-times-circle fa-lg ml-auto p-2" onClick= "RemoveChild()" data-dismiss="modal"
                            style="color: #FA7268; float: right;" onmouseover="this.style.color='#3F82C7';"
                            onmouseout="this.style.color='#FA7268';"></i>
                    </div>
                    <div class="modal-body">
                        <form action="/thread/edit" method="POST">
                            <div class="form-group text-center">
                                <strong for="title">Title</strong>
                                <input type="text" class="form-control" name="title" id="title"
                                    placeholder="Enter a title" value="` + data[0].thread_name + `">
                            </div>
                            <div class="form-group text-center">
                                <label class="text-muted" for="thread_content">Tell me what you want update</label>
                                <textarea type="text" class="form-control" maxlength="255" rows="5"
                                    name="thread_content" placeholder="maximum of 255 characters">` + data[0].text + `</textarea>
                            </div>
                            <button type="submit" class="btn btn-primary active" style="float: right;">Update</button>

                            <input type="hidden" name="_csrf" value="` + csurfToken + `">
                            <!-- Protect the page with a token -->
                            <input type="hidden" name="id_thread" value="` + data[0].id_thread + `">

                        </form>
                    </div>
                    <div class="modal-footer">
                    </div>
                </div>
            </div>
        </div>`

      $('#editmodal').append(htmlmodal);
      $('#updatethread').modal('show');
    });
}

function NewRandom() {

  const waitFor = (ms) => new Promise(r => setTimeout(r, ms));

  RemoveChild()
  waitFor(50)
  console.log("we have wait")
  randomThread()
}

function randomThread() {
  $.get("/thread/random",
    function (data, status) {
      console.log(data)

      var csurfToken = document.getElementsByName('_csrf')[0].defaultValue

      var htmlmodal = `<div class="modal fade" id="updatethread" tabindex="-1" role="dialog" aria-labelledby="exampleModalCenterTitle"
            aria-hidden="true" data-backdrop="static" data-keyboard="false">
                <div class="modal-dialog modal-dialog-centered" role="document">                
                <div class="modal-content">
                <div class="modal-header no-border">
                <img src="https://boutique.alforme.fr/wp-content/uploads/2017/08/avatar-homme.png" alt="Responsive image"
                class="img-fluid rounded-circle" width="70px" height="70px">
                <a href="/profiles?username=<%- threads[i].username -%>">
                <h5 class="text-center">@`+ data[0].user + `</h5>
                </a>
                <h5 class="text-center" style="margin-top: 2em; margin-left: 2em;">`+ data[0].thread_name + `</h5>     
                <i class="far fa-times-circle fa-lg ml-auto p-2" onClick= "RemoveChild()" data-dismiss="modal"
                style="color: #FA7268; float: right;" onmouseover="this.style.color='#3F82C7';"
                onmouseout="this.style.color='#FA7268';"></i>           
                </div>
                <div class="modal-body">
                
                  <p>`+ data[0].text + `</p>
                </div>
                <div class="modal-footer no-border" >
                <a href="#" class="bottom-heart"> <i onclick="myHeart(icon0)" id="icon0" class="fas fa-heart font-awesome" ></i> </a>
                <i onclick="NewRandom()" data-dismiss="modal" class="fas fa-dice fa-lg" style="color: #FA7268;"
                        onmouseover="this.style.color='#3F82C7';" onmouseout="this.style.color='#FA7268';"></i>
                </div>
              </div>
                </div>
            </div>`

      $('#editmodal').append(htmlmodal);
      $('#updatethread').modal('show');
    });
}