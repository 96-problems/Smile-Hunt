document.addEventListener("DOMContentLoaded",function(){
    console.log("from content_script");
})

function getAmazonLink() {
    var alreadyAdded = false
    var tid = setInterval( function () {
        if ($(document).find(".post-get-it-button").length == 0) return;
        clearInterval( tid );       

//        console.log("Smile Hunt: Ready to find URL.");
        var getItButtonURL = $(document).find(".post-get-it-button").children("a").attr("href");
        if (getItButtonURL != undefined) {
            //console.log("Pre-checking " + getItButtonURL);
            if (alreadyAdded == false) {
                alreadyAdded = true;
            var xhr = new XMLHttpRequest();
            xhr.open("GET", getItButtonURL, true);
            xhr.onreadystatechange = function() {
                if (xhr.readyState == 4) {
                    if (
                        xhr.status == 200 && 
                        (
                            xhr.responseURL.startsWith("http://www.amazon.com/") ||
                            xhr.responseURL.startsWith("http://amzn.to/")
                        )
                    ) {
                        var reactURL = xhr.responseURL
                        var customSmileElement = '<section class="post-detail--header--smile-button"><div><a href="' + getItButtonURL + '" target="_tab">…with a <img src="' + chrome.extension.getURL('img/smile.png') + '" /></a></div></section>';
                        $(document).find(".post-detail--header--upvote-and-get-it-buttons").append(customSmileElement);
//&#x1F604;
                        chrome.runtime.sendMessage({reactToURL: reactURL}, function(response) {
                        });
                    }
                }
            }
            xhr.send();
            }
        } else {
            //console.log("No button?");
        }
    }, 10);
}

chrome.extension.onRequest.addListener(
  function(request, sender, sendResponse) {
    console.log(request);
    if (request.greeting == "requestAmazonCheck") {
        //console.log("Getting amazon link");
        getAmazonLink();
    }
  }
);
