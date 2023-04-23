chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === "injectScript") {
    const script = document.createElement("script");
    script.src = chrome.runtime.getURL("min.js");
    document.body.appendChild(script);
    sendResponse({ success: true });
  }
  return true;
});
