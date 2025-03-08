document.getElementById('takeScreenshot').addEventListener('click', async () => {
    try {
        // Ottieni la tab attiva
        const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
        
        // Invia il messaggio per catturare lo screenshot
        await chrome.tabs.sendMessage(tab.id, { type: 'TAKE_SCREENSHOT' });
        
        // Mostra il messaggio di successo
        const status = document.getElementById('status');
        status.textContent = 'Screenshot catturato con successo!';
        status.className = 'success';
        
        // Chiudi il popup dopo 2 secondi
        setTimeout(() => {
            window.close();
        }, 2000);
    } catch (error) {
        // Mostra il messaggio di errore
        const status = document.getElementById('status');
        status.textContent = `Errore: ${error.message}`;
        status.className = 'error';
    }
});