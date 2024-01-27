const now = new Date(); // Current time
const hours = now.getHours();
const minutes = now.getMinutes();
const seconds = now.getSeconds();
const milliseconds = now.getMilliseconds();

console.log(`Time: ${hours}:${minutes}:${seconds}.${milliseconds}`); // Output: Time: 13:42:26.543

let isTracking = false;

function convertCoordinates(imageWidth, imageHeight, websiteWidth, websiteHeight, x, y) {
    // Calculate scaling factors
    const xScale = websiteWidth / imageWidth;
    const yScale = websiteHeight / imageHeight;

    // Convert coordinates
    const newX = x * xScale;
    const newY = y * yScale;

    return { x: newX, y: newY };
}

chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
  console.log(request.message);
  if (request.message=== "start tracking") {
    console.log('Tracking started');
    isTracking = true;

    // Example: Track mouse clicks
        const mouseX = event.clientX;
        const mouseY = event.clientY;

        console.log('Mouse Click at Position:', { x: mouseX, y: mouseY });

        chrome.runtime.sendMessage({
          command: 'trackEvent',
          event: 'mouseClick',
          data: { x: mouseX, y: mouseY }
        });

    // Example: Track mouse hovers
    document.addEventListener('mousemove', function(event) {
        const mouseX = event.clientX; const mouseY = event.clientY;

        console.log('Mouse Hover at Position:', { x: mouseX, y: mouseY });

        // You can choose to track hover events separately or in combination with clicks
        // Uncomment the following lines if you want to track hover events as well
        // chrome.runtime.sendMessage({
        //   command: 'trackEvent',
        //   event: 'mouseHover',
        //   data: { x: mouseX, y: mouseY }
        // });
    });

    // Example: Track search bar interactions
    document.getElementById('searchInput').addEventListener('input', function(event) {
        const searchQuery = event.target.value;

        // Send tracking data to the background script
        chrome.runtime.sendMessage({
          command: 'trackEvent',
          event: 'searchQuery',
          data: { searchQuery }
        });
    });

  } else if (request.message=== 'stopTracking') {
    isTracking = false;
    console.log('Tracking stopped');
  }
  if(request.message==="clean heatmap"){
    console.log("clean");

    var heatdata = {
      max: 100,
      min:0,
      data: []
    };
    var heatmapInstance = h337.create({
      container: document.body,
    });
    heatmapInstance.setData(null);

const heatmapCanvases = document.querySelectorAll(".heatmap-canvas");

heatmapCanvases.forEach(canvas => {
  canvas.parentNode.removeChild(canvas);
});
  }
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
  const url = `https://detect.roboflow.com/dk_tech/1?api_key=${apiKey}&confidence=0.1`;


  const response = await fetch(url, {
    method: 'POST',
      body: base64Image,
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' }  });

  if (!response.ok) {
    throw new Error(`Request failed with status ${response.status}`);
  }

  var width = window.innerWidth;
  var height = window.innerHeight;

  const data = await response.json();
  console.log(data); // Handle the response data

  // loop through the predictions
var points = [];
  for(var i=0;i<data.predictions.length;i++){
  var x =data.predictions[i].x;
  var y =data.predictions[i].y;
  var p_width =data.predictions[i].width;
  var p_height =data.predictions[i].height;
  console.log(innerWidth,innerHeight);
  console.log(data.width,data.height);

  const newcoords = convertCoordinates(imageElement.width, imageElement.height, innerWidth, innerHeight, x,y);
  console.log("newcoords",newcoords);

  var nw_x = newcoords.x;
  var nw_y = newcoords.y;

var heatmapInstance = h337.create({
  container: document.body,
});


// now generate some random data
var max = 100;
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
    x: nw_x,
    y: nw_y,
    value: (data.predictions[i].confidence)*100,
    // radius configuration on point basis
    //get avg of width and height
    radius:(p_width+p_height)/2
  };
  points.push(point);

//}
// heatmap data format

  }

var heatdata = {
  max: max,
  min:0,
  data: points
};
heatmapInstance.setData(heatdata);

}

sendBase64ImageRequest(imageElement);
  }
});
