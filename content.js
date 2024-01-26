console.log("HERE 1");

const head = document.head;
const script= document.createElement('script');
script.src = 'axios.js';
script.type = 'text/javascript';
//head.appendChild(script);

//import axios from './axios.js';


const heatscript = document.createElement('script');
heatscript.src = 'https://cdnjs.cloudflare.com/ajax/libs/heatmap.js/2.0.0/heatmap.min.js';
heatscript.type = 'text/javascript';
//head.appendChild(heatscript);


const now = new Date(); // Current time
const hours = now.getHours();
const minutes = now.getMinutes();
const seconds = now.getSeconds();
const milliseconds = now.getMilliseconds();

console.log(`Time: ${hours}:${minutes}:${seconds}.${milliseconds}`); // Output: Time: 13:42:26.543

chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
  console.log(request.message);
  if (request.message === "hello from popup") {
    // Perform actions in the content script here
    // if (request.action === "sendImage") {
    const imageElement = new Image();
    imageElement.src = request.imageData;
    // Do something with the image element here
    // Create a div element for the overlay

    const overlayDiv = document.createElement('div');
    overlayDiv.id = 'filter-heatmap';

    // Create an img element for the overlay image
    const overlayImg = document.createElement('img');
    overlayImg.id = 'overlay-image';
    overlayImg.src = imageElement.src;
    overlayImg.style.position = "fixed";
    overlayImg.style.width= "100%";
    overlayImg.style.zIndex = 3;
    overlayImg.style.top = "0px";
    overlayImg.style.left = "0px";
    overlayImg.style.opacity = "50%";

    // Append the image to the overlay container
    //overlayDiv.appendChild(overlayImg);

    // Append the overlay container to the body
    //document.body.appendChild(overlayDiv);


    console.log(imageElement.src);
    //const image = await loadImageBase64(imageElement.src);

async function sendBase64ImageRequest( imageElement ) {
  const base64Image = imageElement.src.toString("base64");
  console.log(base64Image.split(',')[1]);

  const apiKey = '59Pz38uciAvwSDCsuA31';
  const url = `https://detect.roboflow.com/dk_tech/1?api_key=${apiKey}`;


  const response = await fetch(url, {
    method: 'POST',
body: base64Image,
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' }  });

  if (!response.ok) {
    throw new Error(`Request failed with status ${response.status}`);
  }

  const data = await response.json();
  console.log(data); // Handle the response data
  var x =data.predictions[0].x-350;
  var y =data.predictions[0].y-300;
  var p_width =data.predictions[0].width;
  var p_height =data.predictions[0].height;
  console.log(innerWidth,innerHeight);
  console.log(data.width,data.height);
var heatmapInstance = h337.create({
  container: document.body,
});


// now generate some random data
var points = [];
var max = 0;
// get windows size
var width = window.innerWidth;
var height = window.innerHeight;

console.log("inn",innerWidth,innerHeight);


var len = 300;

//while (len--) {
//  var val = Math.floor(Math.random()*100);
//  // now also with custom radius
//  var radius = Math.floor(Math.random()*70);
//
//  max = Math.max(max, val);
  var point = {
    //get center using x and p_width y and p_height
    x: x,
    y: y,
    value: 10,
    // radius configuration on point basis
    //get avg of width and height
    radius:(p_width+p_height)/2
  };
  points.push(point);

//}
// heatmap data format
var heatdata = {
  max: max,
  data: points
};
heatmapInstance.setData(heatdata);
}

sendBase64ImageRequest(imageElement);
  }
});
