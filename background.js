// Gestisce la comunicazione tra il content script e l'estensione
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.type === 'SCREENSHOT_TAKEN') {
        // Salva l'URL dello screenshot per un eventuale utilizzo futuro
        chrome.storage.local.set({
            lastScreenshot: {
                url: message.url,
                timestamp: new Date().toISOString()
            }
        });
        
        // Invia una notifica di conferma
        chrome.notifications.create({
            type: 'basic',
            iconUrl: 'icon48.png',
            title: 'Screenshot Catturato',
            message: 'Lo screenshot è stato salvato e inviato alla chat'
        });
    }
});