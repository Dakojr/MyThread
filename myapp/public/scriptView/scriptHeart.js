function myHeart(id) {
  if (id.className === "fas fa-heart font-awesome") {
    id.classList.add('open')

  } else {
    id.classList.remove('open')
  }
}

function Like(id, id_thread) {
  $.get("/like",
    {
      id_thread: id_thread
    },
    function (data, status) {
      if (data === false) {        
        id.classList.remove('open')

      } else {
        id.classList.add('open')
      }
    })
}


// CLOSE MODAL

function RemoveChild() {
  var element = document.getElementById("editmodal");
  while (element.firstChild) {
    element.removeChild(element.firstChild);
  }
}


// REMOVE THREAD

function RemoveThread(id_thread, name_thread) {

  var htmlmodal = `<div class="modal fade" id="updatethread" tabindex="-1" role="dialog" aria-labelledby="exampleModalCenterTitle"
            aria-hidden="true" data-backdrop="static" data-keyboard="false">
            <div class="modal-dialog modal-dialog-centered" role="document">
                <div class="modal-content">

                <div class="modal-header d-flex justify-content-center">
                        <h4 class="text-center">Are you sur you want to delete this Thread ?</h4>
                        <i class="far fa-times-circle fa-lg ml-auto p-2" onClick= "RemoveChild()" data-dismiss="modal"
                            style="color: #FA7268; float: right;" onmouseover="this.style.color='#3F82C7';"
                            onmouseout="this.style.color='#FA7268';"></i>
                    </div>
                    <div class="modal-body d-flex justify-content-center">
                        <a href="/thread/delete?id_thread=` + id_thread + ` &name_thread=` + name_thread + `"><i class="fas fa-trash" style="color: #FA7268; float: right;" onmouseover="this.style.color='#3F82C7';"
                        onmouseout="this.style.color='#FA7268';"></i></a>
                    </div>
                </div>
            </div>
        </div>`

  $('#editmodal').append(htmlmodal);
  $('#updatethread').modal('show');
}


//EDIT A THREAD

function EditThread(id_thread) {
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
                                <label class="text-muted" for="hashtag">Hashtag</label>
                                <input type="text" class="form-control" name="hashtag" id="hashtag"
                                    placeholder="Enter a hashtag" value="` + data[0].hashtag + `">
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

//RANDOM THREAD

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
                <div class="modal-content" ondblclick="Like(icon0,` + data[0].id_thread + `)">
                <div class="modal-header no-border">`


                if (data[0].pppathfile === null) { 
                  htmlmodal += `<img src="https://boutique.alforme.fr/wp-content/uploads/2017/08/avatar-homme.png" alt="Responsive image"
                      class="img-fluid rounded-circle">`
               } else { 
                htmlmodal += '<img src="' + data[0].pppathfile + '" alt="Responsive image" class="img-fluid rounded-circle" width="70px" height="70px">'
                  } 

                htmlmodal += `
                <a href="/profiles?username=` + data[0].user + `">
                <h5>@`+ data[0].user + `</h5>
                </a>`
      htmlmodal += `
                <h5 style="margin: 0 auto;">`+ data[0].thread_name + `</h5>     
                <i class="far fa-times-circle fa-lg ml-auto p-2" onClick= "RemoveChild()" data-dismiss="modal"
                style="color: #FA7268; float: right;" onmouseover="this.style.color='#3F82C7';"
                onmouseout="this.style.color='#FA7268';"></i>
                </div>
                <div class="modal-body">
                <p class="text-center">`+ data[0].text + `</p>
                </div>
                <div class="modal-footer no-border" >
                <a href="/thread?hashtag=` + escape(data[0].hashtag) + `" class="bottom-hashtag" style="position: absolute; left: 3%;">` + data[0].hashtag + `</a>
                `
      if (data[0].liked === false) {
        console.log(data)
        htmlmodal += '<a href="#" class="bottom-heart"> <i onclick="Like(icon0,' + data[0].id_thread + ')"  id="icon0" class="fas fa-heart font-awesome"></i> </a>'
      } else {
        htmlmodal += '<a href="#" class="bottom-heart"> <i onclick="Like(icon0, ,' + data[0].id_thread + ')" id="icon0" class="fas fa-heart font-awesome open"></i></a>'
      }

      htmlmodal += `<i onclick="NewRandom()" data-dismiss="modal" class="fas fa-dice fa-lg" style="color: #FA7268;"
                        onmouseover="this.style.color='#3F82C7';" onmouseout="this.style.color='#FA7268';"></i>
                </div>
              </div>
                </div>
            </div>`

      $('#editmodal').append(htmlmodal);
      $('#updatethread').modal('show');
    });
}