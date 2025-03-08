// Gestione del pannello DevTools
chrome.devtools.panels.create(
    "AgentsDesk AI",
    null,
    "panel.html",
    function(panel) {
        console.log("Pannello DevTools creato");
    }
);

// Gestione dei log della console
chrome.devtools.network.onRequestFinished.addListener(function(request) {
    // Invia i log al pannello
    if (request.response.content) {
        chrome.runtime.sendMessage({
            type: 'NETWORK_LOG',
            data: {
                url: request.request.url,
                method: request.request.method,
                status: request.response.status,
                content: request.response.content
            }
        });
    }
});

// Ascolta i messaggi dalla console
chrome.devtools.console.onMessageAdded.addListener(function(message) {
    chrome.runtime.sendMessage({
        type: 'CONSOLE_LOG',
        data: {
            level: message.level,
            text: message.text,
            timestamp: new Date().getTime()
        }
    });
});