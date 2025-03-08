// Gestione delle tab
document.querySelectorAll('.tab').forEach(tab => {
    tab.addEventListener('click', () => {
        // Rimuovi la classe active da tutte le tab
        document.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
        // Aggiungi la classe active alla tab cliccata
        tab.classList.add('active');
        
        // Nascondi tutti i contenuti
        document.querySelectorAll('.content > div').forEach(content => {
            content.style.display = 'none';
        });
        
        // Mostra il contenuto della tab selezionata
        const tabId = tab.getAttribute('data-tab');
        document.getElementById(`${tabId}-logs`).style.display = 'block';
    });
});

// Funzione per aggiungere un log alla console
function addConsoleLog(log) {
    const consoleContainer = document.getElementById('console-logs');
    const logEntry = document.createElement('div');
    logEntry.className = `log-entry ${log.level}`;
    logEntry.textContent = `[${new Date(log.timestamp).toLocaleTimeString()}] ${log.text}`;
    consoleContainer.appendChild(logEntry);
    consoleContainer.scrollTop = consoleContainer.scrollHeight;
}

// Funzione per aggiungere un log di rete
function addNetworkLog(log) {
    const networkContainer = document.getElementById('network-logs');
    const logEntry = document.createElement('div');
    logEntry.className = 'log-entry';
    logEntry.innerHTML = `
        <div><strong>${log.method}</strong> ${log.url}</div>
        <div>Status: ${log.status}</div>
        ${log.content ? `<pre>${JSON.stringify(log.content, null, 2)}</pre>` : ''}
    `;
    networkContainer.appendChild(logEntry);
    networkContainer.scrollTop = networkContainer.scrollHeight;
}

// Funzione per aggiungere uno screenshot
function addScreenshot(url) {
    const screenshotsContainer = document.getElementById('screenshots');
    const screenshot = document.createElement('div');
    screenshot.className = 'screenshot';
    screenshot.innerHTML = `
        <div class="timestamp">${new Date().toLocaleString()}</div>
        <img src="${url}" alt="Screenshot" style="max-width: 100%; margin-top: 10px;">
    `;
    screenshotsContainer.appendChild(screenshot);
    screenshotsContainer.scrollTop = screenshotsContainer.scrollHeight;
}

// Ascolta i messaggi dal background script
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    switch (message.type) {
        case 'CONSOLE_LOG':
            addConsoleLog(message.data);
            break;
        case 'NETWORK_LOG':
            addNetworkLog(message.data);
            break;
        case 'SCREENSHOT_TAKEN':
            addScreenshot(message.url);
            break;
    }
});