# Photoalbum
Single-page browser-stored photoalbum using IndexedDB
## Description
This code allows for the creation of a website that gives the user the opportunity to create photoalbums and upload images and videos in these albums. 
The albums and the content in the albums are stored in one of two objectStores in an indexedDB database.

The website is available in four different languages (English, German, Spanish, and French). 
The language menu is accessible via a drop-down menu in the top left corner.

Next to this language drop-down menu is another drop-down menu which allows for the creation of new albums, as well as the upload of images and videos in a selected album.

The "Help" button displays and hides an explanation where the user can look up how to use the website.

The indexedDB database consists of two objectStores "content" and "album". 
The IDs of the uploaded content and the allbum name are linked in order to add content to a certain calbum instead of all of them. 

The languages used in this project are HTML, CSS, and JavaScript.

## Installation and Running
Since this project consists of HTML, CSS, and JavaScript code the code can simply be downloaded and the HTML file can be opened in any browser. 
The CSS and Javacript are implements into the HTML file, therefore the indexedDB database will automatically be created upon opening and running the HTML file. 

Creating and running the website is very simple, since it is designed for people of all ages and in-depth knowledge of how to use a computer is not supposed to be necessary. 
This will allow older people to use it as well. 

The first step to making the website usable is creating a new album (see "User Instructions").
Once one album is created the website is ready to be used.
Content can now be uploaded in the album, and other albums can be created. The file type of videos and images are not reduced to certain file types. All should work as long as they are videos or images.
For other instructions see "User Instructions" below.

## User Instructions
In order to create a new album the user has to enter the name of the album in an input field in the middle of the website. 
Then, the user navigates to the menu and can click on "create album" in order to create a new album with the name that was entered.

In order to upload videos or images to a selected album the user selects the name of the album that the content is to be uploaded to by selecting it in the selection menu. 
Then the user can select videos or images to upload by clicking on "upload" in the menu.

The content can be displayed by selecteing the album that is to be opened. 
When clicking on "open selected album" the content stored in this album is displayed at the bottom of the page. 

These explanations are also available directly on the website by clicking on the red "help" button.

## Credits
The majority of this code is basic indexedDB API.

All other tutorials and videos that were used can be accessed via the "resources" branch of this project. 
