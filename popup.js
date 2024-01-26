document.addEventListener("DOMContentLoaded", function() {
  //document.getElementById("capture").addEventListener("click", function() {
    const screenshotContainer = document.getElementById("screenshotContainer");

    chrome.tabs.captureVisibleTab(function(screenshotDataUrl) {
        const screenshotImage = new Image(100);
        screenshotImage.src = screenshotDataUrl;
        screenshotContainer.appendChild(screenshotImage);

        const now = new Date(); // Current time
        const hours = now.getHours();
        const minutes = now.getMinutes();
        const seconds = now.getSeconds();
        const milliseconds = now.getMilliseconds();

        console.log(`Time: ${hours}:${minutes}:${seconds}.${milliseconds}`); // Output: Time: 13:42:26.543

        // do something with response here, not outside the function
        console.log("res?");
    chrome.tabs.query({ active: true, currentWindow: true }, function(tabs) {
      chrome.tabs.sendMessage(tabs[0].id,{actions:"sendImage",imageData:screenshotDataUrl,  message: "hello from popup" });
    });
    });
  //});

    // Rest of your code...

});


