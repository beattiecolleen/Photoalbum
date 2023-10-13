//open new indexedDB database
const request = indexedDB.open("Photoalbum", 1);
let db; //make it a global variable to allow access

//onerror function for request
request.onerror = function(error) {
  //alert the user that an error has occurred
    alert("An error has occurred! ", error);
};

//onupgradeneeded for request
request.onupgradeneeded = function(event) {
    db = event.target.result;
    //create an object store for albums
    db.createObjectStore("albums", {keyPath: "id", autoIncrement: true});
    //objectstore that stores the images/videos 
    db.createObjectStore("content", {keyPath: "contentID", autoIncrement: true});
    
};

//onsuccess for request
request.onsuccess = function(event) {
    db = event.target.result;
    //run function to display all album names
    displayAlbums();
    //run function to display content for the selected album
    displayContentForAlbum();
    //run function to create the album dropdown
    AlbumDropdown();
};

//Function to create a new Album
function createAlbum() {
  //open a new readwrite transaction on albums
    const transaction = db.transaction(["albums"], "readwrite");
    const objectStore = transaction.objectStore("albums");

    //get album name from user input
    const albumName = document.getElementById("albumNameInput").value;

    //don't allow creation of a nameless album
    if(albumName === "") {
        alert("The album doesn't have a name! Please enter a valid album name!");
        return;
    }

    //create new object with the new name
    const newAlbum = { name: albumName };

    //add new album to object store "albums"
    const request = objectStore.add(newAlbum);

    //onsuccess for adding the new album to objectstore
    request.onsuccess = function() {
        console.log("New album was added!");
        //run function to display albums
        displayAlbums();
    };

    //onerror for adding the new album to objectstore
    request.onerror = function(error) {
        alert("An error has occurred! ", error);
    };
};

//Function for album selection before uploading content
function AlbumDropdown() { 
  //get the selected album
    const albumSelect = document.getElementById("albumSelect");
    albumSelect.innerHTML = ""; //clear existing options

    //open a new readonly transaction on albums
    const transaction = db.transaction(["albums"], "readonly");
    const objectStore = transaction.objectStore("albums");

    //cursor for iterating through elements
    const request = objectStore.openCursor();

    //onsuccess for opening the cursor
    request.onsuccess = function(event) {
        const cursor = event.target.result;

        //assign name and id of album to each option
        if(cursor) {
            const album = cursor.value;
            //create a new option and assign it the user input name
            const option = document.createElement("option");
            option.value = album.id;
            option.textContent = album.name;
            //append option to albumSelect
            albumSelect.appendChild(option);

            cursor.continue();
        }
    };
};

//Eventlistener for file input
document.getElementById("InputButton").addEventListener("change", function(event) {
    const file = event.target.files[0];
    if(file) {
      //open a new fileReader
        const reader = new FileReader();
        reader.onload = function(e) {
            const mediaData = e.target.result;

            //get albumID from dropdown
            const albumSelect = document.getElementById("albumSelect");
            const selectedAlbumId = albumSelect.value;

            //call uploadMedia with selected album id, data that is in the album, and file type
            uploadMedia(selectedAlbumId, mediaData, file.type);
        };
        reader.readAsDataURL(file);
    }
});


//Function to upload media linked to an album
function uploadMedia(albumId, mediaData, fileMediaType) {
    // Determine type of data (image/video?)
    const mediaType = fileMediaType.startsWith("image") ? "image" : "video"; //error message pops up but it works
    
    //store content in database along with album ID
    const transaction = db.transaction(["content"], "readwrite");
    const mediaStore = transaction.objectStore("content");

    //first time defining mediaObject
    const mediaObject = {mediaData, mediaType, albumId}; //object contains mediaData, mediaType, and albumId
    
    //add mediaObject to the object store
    const addRequest = mediaStore.add(mediaObject);

    //onsuccess for addRequest
    addRequest.onsuccess = function() {
        console.log("The content was stored in the database! ");
        //display content function
        displayContentForAlbum(albumId);
    };

    //onerror for addRequest
    addRequest.onerror = function(error) {
        alert("An error has occurred!", error);
    };

    //reference mediaContainer
    const mediaContainer = document.getElementById("mediaContainer");

    //creation of media element (img if image, video if video)
    const mediaElement = mediaType === "image" ? document.createElement("img") : document.createElement("video");
    mediaElement.src = mediaData; //source of the newly created element
    mediaElement.classList.add("grid-media"); //class added for styling

    //add controls to videos
    if(mediaType === "video") {
      mediaElement.setAttribute("controls", "");
    }

    //append the mediaElement to the mediaContainer
    mediaContainer.appendChild(mediaElement);
};

// Function to display content for a selected album
function displayContentForAlbum(albumIdToRetrieve) {
  //open a new readonly transaction on content object store
    const transaction = db.transaction(["content"], "readwrite");
    const mediaStore = transaction.objectStore("content");

    // Clear existing container
    const mediaContainer = document.getElementById("mediaContainer");
    mediaContainer.innerHTML = "";

    //open cursor to iterate through the items
    mediaStore.openCursor().onsuccess = function(event) {
      const cursor = event.target.result;
      if(cursor) {
        //retrieve the necessary data
        const mediaData = cursor.value.mediaData;
        const mediaType = cursor.value.mediaType;
        const albumId = cursor.value.albumId; 

        if (albumId === albumIdToRetrieve) {
          //creation of a container div for the item and caption
          const containerDiv = document.createElement("div");
          containerDiv.classList.add("media-container"); //class added for styling

          //creation of mediaElement based on its type (img if image, video if video)
          const mediaElement = mediaType === "image" ? document.createElement("img") : document.createElement("video");
          mediaElement.src = mediaData;
          mediaElement.classList.add("grid-media"); //class added for styling
          
          //Controls for videos
          if(mediaType === "video") {
            mediaElement.setAttribute("controls", "");
          }

          //append mediaElement to mediaContainer
          mediaContainer.appendChild(mediaElement);
        }
        cursor.continue();
      }
    };
}

//function to open the album
function openAlbum() {
    //get the selected ID from the dropdown
    const albumSelect = document.getElementById("albumSelect");
    const selectedAlbumId = albumSelect.value;

    //display content for the selected album
    displayContentForAlbum(selectedAlbumId);
};

//Function to display the albums
function displayAlbums() {
    //get album list 
    const albumList = document.getElementById("albumList");
    albumList.innerHTML = "";

    //open a new readonly transaction on object store albums
    const transaction = db.transaction(["albums"], "readonly");
    const objectStore = transaction.objectStore("albums");

    //use cursor to iterate through the items
    const request = objectStore.openCursor();

    //onsuccess
    request.onsuccess = function(event) {
      const cursor = event.target.result;
      const listItem = document.createElement("li");
      //creation of a clickable text item that opens the album
      listItem.innerHTML = `<a onclick="openAlbum()" id="selectAlbumText"> Open selected Album </a>`;
      albumList.appendChild(listItem);
      }
    };

//hide or show tutorial on button click
var div = document.getElementById("tutorialText");
var display = 0; //hidden by default
//start of function
function HideShowTutorial() {
    if (display == 1) {
        div.style.display = "block";
        display = 0;
    } else {
        div.style.display = "none";
        display = 1;
    }
};