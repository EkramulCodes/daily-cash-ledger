// Cloud sync utilities for Google Apps Script integration

// Main Ledger Web App URL
export const MAIN_WEB_APP_URL = 'https://script.google.com/macros/s/AKfycbxfB9lqVwec4DdRP54S1yFKwT8yzJAqIa6PvwdRgr4nav5OOV4UPuPeWWp-J6iTmxgw/exec';

// Client Ledger Web App URL
export const CLIENT_WEB_APP_URL = 'https://script.google.com/macros/s/AKfycbz8wlf-Q4-x3Lm5Wb2a3ZpX8hgOUQgdTioxgzEyJcg3QegkCzIGoIQPjGfxisI-35X1/exec';

// Save data to cloud
export async function syncToCloud(data, month, type = 'main') {
    const url = type === 'client' ? CLIENT_WEB_APP_URL : MAIN_WEB_APP_URL;

    try {
        await fetch(url, {
            method: 'POST',
            mode: 'no-cors',
            body: JSON.stringify({ month, rows: data, type })
        });
        return { success: true };
    } catch (error) {
        console.error('Sync failed:', error);
        return { success: false, error };
    }
}

// Load data from cloud
export async function loadFromCloud(month, type = 'main') {
    const url = type === 'client' ? CLIENT_WEB_APP_URL : MAIN_WEB_APP_URL;

    try {
        const res = await fetch(`${url}?month=${month}&type=${type}`);
        const data = await res.json();
        return { success: true, data };
    } catch (error) {
        console.error('Load failed:', error);
        return { success: false, error };
    }
}

// Auto-sync interval (5 minutes)
export const AUTO_SYNC_INTERVAL = 300000;