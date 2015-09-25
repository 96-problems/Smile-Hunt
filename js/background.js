var productPage = "http://www.96problems.com/smile-hunt";
var shouldReactToURL = "";

chrome.tabs.onUpdated.addListener(function(request, sender, callback) {
	if (sender.status == "complete") {
    console.log("Should react to: " + shouldReactToURL);
		chrome.tabs.getSelected(null, function(tab) {
      var bookName = tab.url.split("http://www.producthunt.com/books/")[1];
  		if (bookName !== undefined && bookName != "") {
        chrome.tabs.sendRequest(tab.id, {greeting: "requestAmazonCheck"}, function(response) {
        });
    	} else {
        console.log(tab.url);
        if (tab.url == shouldReactToURL) {
          var modifiedURL = shouldReactToURL.replace("http://www.amazon.com/", "http://smile.amazon.com/");
          chrome.tabs.update(tab.id, {url: modifiedURL});
              //shouldReactToURL = "";
          
        } else {}
      }
    });
	}
});

chrome.runtime.onMessage.addListener(
  function(request, sender, sendResponse) {
    if (request.reactToURL.startsWith("http://www.amazon.com/")) {
      shouldReactToURL = request.reactToURL;
    }
  }
);

//  https://developer.chrome.com/extensions/runtime#event-onInstalled
chrome.runtime.onInstalled.addListener(function (object) {
  chrome.tabs.create({url: productPage + "#bottom-smile"}, function (tab) {
  });
});