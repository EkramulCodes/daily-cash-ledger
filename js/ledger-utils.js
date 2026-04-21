// ledger-utils.js - Shared utilities for all ledgers
// Theme, Converter, Search, Base Calculations, Export, Print

// 1. Theme Toggle
function initTheme() {
    const savedTheme = localStorage.getItem('theme') || 'light';
    document.documentElement.setAttribute('data-theme', savedTheme);
    const themeBtn = document.getElementById('themeToggle');
    if (themeBtn) {
        themeBtn.innerText = savedTheme === 'dark' ? '☀️' : '🌙';
    }
}

function toggleDarkMode() {
    const body = document.documentElement;
    const isDark = body.getAttribute('data-theme') === 'dark';
    const newTheme = isDark ? 'light' : 'dark';
    body.setAttribute('data-theme', newTheme);
    localStorage.setItem('theme', newTheme);
    const themeBtn = document.getElementById('themeToggle');
    if (themeBtn) themeBtn.innerText = newTheme === 'dark' ? '☀️' : '🌙';
}

// 2. Currency Converter
function initConverter() {
    const usdInput = document.getElementById('usdInput');
    const rateInput = document.getElementById('rateInput');
    const bdtResult = document.getElementById('bdtResult');
    if (!usdInput || !rateInput || !bdtResult) return;

    function convert() {
        const usd = parseFloat(usdInput.value) || 0;
        const rate = parseFloat(rateInput.value) || 122;
        bdtResult.innerText = '৳' + (usd * rate).toLocaleString();
    }
    usdInput.addEventListener('input', convert);
    rateInput.addEventListener('input', convert);
    convert(); // Initial
}

// 3. Search (generic for table rows)
function initSearch(searchId, tableBodyId) {
    const searchInput = document.getElementById(searchId);
    const tbody = document.getElementById(tableBodyId);
    if (!searchInput || !tbody) return;

    searchInput.addEventListener('input', (e) => {
        const term = e.target.value.toLowerCase();
        tbody.querySelectorAll('tr').forEach(row => {
            const inputs = row.querySelectorAll('input');
            const text = Array.from(inputs).map(i => i.value.toLowerCase()).join(' ');
            row.style.display = text.includes(term) || term === '' ? '' : 'none';
        });
    });
}

// 4. Generic Excel Export
function downloadExcel(tableId, filename = 'ledger') {
    const table = document.getElementById(tableId);
    const rows = table.querySelectorAll('tr');
    let csv = [];
    rows.forEach(row => {
        if (row.style.display !== 'none') {
            let rowData = [];
            row.querySelectorAll('th, td').forEach((cell, idx) => {
                if (cell.classList.contains('no-print')) return;
                let val = '';
                const input = cell.querySelector('input');
                if (input) val = input.value;
                else val = cell.innerText.replace(/৳|,/g, '');
                rowData.push('"' + val.replace(/"/g, '""') + '"');
            });
            csv.push(rowData.join(','));
        }
    });
    const blob = new Blob([csv.join('\n')], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${filename}_${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    URL.revokeObjectURL(url);
}

// 5. Row Delete helper
function deleteRow(row) {
    row.remove();
}

// Export utils
export { initTheme, toggleDarkMode, initConverter, initSearch, downloadExcel, deleteRow };