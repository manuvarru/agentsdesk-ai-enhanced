// Funzione per catturare lo screenshot e inviarlo alla chat
async function takeAndProcessScreenshot() {
    try {
        // Cattura lo screenshot usando html2canvas
        const canvas = await html2canvas(document.body);
        
        // Converti il canvas in un blob
        const blob = await new Promise(resolve => {
            canvas.toBlob(resolve, 'image/png');
        });
        
        // Crea un oggetto FormData per l'invio
        const formData = new FormData();
        formData.append('screenshot', blob, 'screenshot.png');
        
        // Invia lo screenshot al backend di AgentsDesk AI
        const response = await fetch('https://api.agentsdesk.ai/screenshot', {
            method: 'POST',
            body: formData,
            headers: {
                // Aggiungi qui gli headers necessari per l'autenticazione
                'X-AgentsDesk-Token': window.agentsDeskToken
            }
        });
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const result = await response.json();
        
        // Invia un messaggio alla chat con il link allo screenshot
        window.postMessage({
            type: 'AGENTSDESK_SCREENSHOT',
            url: result.url,
            timestamp: new Date().toISOString()
        }, '*');
        
        console.log('Screenshot processato e inviato con successo');
        return result.url;
    } catch (error) {
        console.error('Errore durante la gestione dello screenshot:', error);
        throw error;
    }
}

// Ascolta i messaggi per la cattura degli screenshot
window.addEventListener('message', async (event) => {
    if (event.data.type === 'TAKE_SCREENSHOT') {
        try {
            const screenshotUrl = await takeAndProcessScreenshot();
            // Invia una conferma al background script
            chrome.runtime.sendMessage({
                type: 'SCREENSHOT_TAKEN',
                url: screenshotUrl
            });
        } catch (error) {
            console.error('Errore durante la cattura dello screenshot:', error);
        }
    }
});