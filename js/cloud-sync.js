// cloud-sync.js - Unified cloud sync for all ledgers

const WEB_APP_URLS = {
    main: 'https://script.google.com/macros/s/AKfycbxfB9lqVwec4DdRP54S1yFKwT8yzJAqIa6PvwdRgr4nav5OOV4UPuPeWWp-J6iTmxgw/exec',
    client: 'https://script.google.com/macros/s/AKfycbz8wlf-Q4-x3Lm5Wb2a3ZpX8hgOUQgdTioxgzEyJcg3QegkCzIGoIQPjGfxisI-35X1/exec',
    salary: 'https://script.google.com/macros/s/AKfycbxHQafyiMh0qwkWbsW2lijwuJkRfgMMReNHLeS21Fef_zqt1RLRO9NV0HY-ja2mTZTS/exec'
};

// Status helper
function updateStatus(statusEl, message, color = '#2563eb') {
    if (statusEl) {
        statusEl.innerText = message;
        statusEl.style.color = color;
    }
}

// Save ledger data
async function syncToCloud(type, rows, month = null, statusEl = null, isAuto = false) {
    const url = WEB_APP_URLS[type];
    if (!url) throw new Error('Unknown ledger type');

    if (!isAuto) updateStatus(statusEl, '⏳ Syncing to Cloud...', '#2563eb');

    const data = { type, rows, monthYear: month || new Date().toISOString().slice(0, 7) };

    try {
        await fetch(url, {
            method: 'POST',
            mode: 'no-cors',
            body: JSON.stringify(data)
        });
        if (!isAuto && statusEl) {
            const now = new Date().toLocaleTimeString();
            updateStatus(statusEl, `✅ Synced ${type}: ${now}`, '#059669');
        }
    } catch (e) {
        console.error('Sync error:', e);
        if (!isAuto && statusEl) updateStatus(statusEl, '❌ Sync Failed', '#dc2626');
    }
}

// Load ledger data
async function loadFromCloud(type, month = null, statusEl = null, onDataLoaded) {
    const url = WEB_APP_URLS[type];
    const m = month || new Date().toISOString().slice(0, 7);
    if (statusEl) updateStatus(statusEl, '📂 Loading from Cloud...', '#2563eb');

    try {
        const res = await fetch(`${url}?monthYear=${m}&type=${type}`);
        const data = await res.json();
        if (onDataLoaded) onDataLoaded(data);
        if (statusEl) updateStatus(statusEl, data.length ? '✅ Data Loaded' : 'ℹ️ No data found', '#059669');
    } catch (e) {
        console.error('Load error:', e);
        if (statusEl) updateStatus(statusEl, '❌ Load Failed', '#dc2626');
    }
}

// Auto-sync interval (5 min)
function startAutoSync(type, getRowsFn, getStatusElFn, interval = 300000) {
    setInterval(() => {
        const rows = getRowsFn();
        const statusEl = getStatusElFn();
        syncToCloud(type, rows, null, statusEl, true);
    }, interval);
}

// Export
export { syncToCloud, loadFromCloud, startAutoSync, updateStatus };