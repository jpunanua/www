var pictureSource;   // picture source
var destinationType; // sets the format of returned value
var idQuestionActive;
    
// // Called when a photo is successfully retrieved
//
function onPhotoDataSuccess(imageData) {
  // Uncomment to view the base64-encoded image data
  // console.log(imageData);

  // Get image handle
  //
  var smallImage = document.getElementById('smallImage');

  // Unhide image elements
  //
  smallImage.style.display = 'block';

  // Show the captured photo
  // The inline CSS rules are used to resize the image
  //
  smallImage.src = "data:image/jpeg;base64," + imageData;
}

// Called when a photo is successfully retrieved
//
function onPhotoURISuccess(imageURI) {
  // Uncomment to view the image file URI
  // console.log(imageURI);

  // Get image handle
  //
  var largeImage = document.getElementById('largeImage');

  // Unhide image elements
  //
  largeImage.style.display = 'block';

  // Show the captured photo
  // The inline CSS rules are used to resize the image
  //
  largeImage.src = imageURI;
}

// A button will call this function
//
function capturePhoto() {
  // Take picture using device camera and retrieve image as base64-encoded string
  navigator.camera.getPicture(onPhotoURISuccess, onFail, { quality: 50,
    destinationType: destinationType.FILE_URI });
}

// A button will call this function
//
function capturePhotoEdit() {
  // Take picture using device camera, allow edit, and retrieve image as base64-encoded string
  navigator.camera.getPicture(onPhotoURISuccess, onFail, { quality: 20, allowEdit: true,
    destinationType: destinationType.FILE_URI });
}

// A button will call this function
//
function getPhoto(source) {
  // Retrieve image file location from specified source
  navigator.camera.getPicture(onPhotoURISuccess, onFail, { quality: 50,
    destinationType: destinationType.FILE_URI,
    sourceType: source });
}

function uploadPhoto() {

    //selected photo URI is in the src attribute (we set this on getPhoto)
    var imageURI = document.getElementById('largeImage').getAttribute("src");
    if (!imageURI) {
        alert('Please select an image first.');
        return;
    }

    //set upload options
    var options = new FileUploadOptions();
    options.fileKey = "file";
    options.fileName = imageURI.substr(imageURI.lastIndexOf('/')+1);
    options.mimeType = "image/jpeg";
    // this will get value of text field
    options.params = {
        titulo: document.getElementById("titulo").value,
        pregunta: document.getElementById("pregunta").value
    };

    var ft = new FileTransfer();
    ft.upload(imageURI, encodeURI("http://ttg1.pronosticodeltiempo.info/test/mobile.php?check=2"), questionCreatioSuccess, fail, options);
}

// Called if something bad happens.
//
function onFail(message) {
  alert('Failed because: ' + message);
}


function fail(error) {
    alert("An error has occurred: Code = " + error.code);
    console.log("upload error source " + error.source);
    console.log("upload error target " + error.target);
}
    
function questionCreatioSuccess(r) {
    var data;
    
    var jsonResponse = JSON.parse(r.response);
    data = {
        id: jsonResponse.id,
        parent_id: '',
        order: jsonResponse.order,
        img_src: jsonResponse.img_src,
        title: document.getElementById("titulo").value,
        content: document.getElementById("pregunta").value,
        create_date: jsonResponse.create_date
    };    
    insertQuestion(data,showMessageAQ);
}

function getQuestionList() {
    queryDB("parent_id = ''",printQuestionList);
}

// show a success message after create a question
function showMessageAQ(){
    alert('Gracias por mandarnos tu pregunta en breve tendras una respuesta');
}


// Print in list view all parent questions 
//
function printQuestionList(tx, results) {
    var len = results.rows.length;
    $('#listQuestions').html('');
    for (var i=0; i<len; i++){
        $('#listQuestions').append('<li><a onclick="idQuestionActive=\'' + results.rows.item(i).id +  '\';$.mobile.changePage("#question");" href="#">' + results.rows.item(i).title +  '<img src="' + results.rows.item(i).img_src +  '" /></a><span class="ui-li-count ui-body-inherit">1</span></li>');
    }
    $("#listQuestions").listview('refresh');
}