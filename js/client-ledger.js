// client-ledger.js - Client Ledger Module
import { initSearch, downloadExcel, initConverter, initTheme, toggleDarkMode } from './ledger-utils.js';
import { syncToCloud, loadFromCloud, startAutoSync } from './cloud-sync.js';

const WEB_APP_URL = 'https://script.google.com/macros/s/AKfycbz8wlf-Q4-x3Lm5Wb2a3ZpX8hgOUQgdTioxgzEyJcg3QegkCzIGoIQPjGfxisI-35X1/exec';

const template = `
<div class="client-ledger">
  <div class="stats-grid">
    <div class="card"><p class="label">Total Billed</p><p class="in-text" id="totalIn">৳0</p></div>
    <div class="card"><p class="label">Total Received</p><p class="out-text" id="totalOut">৳0</p></div>
    <div id="netCard" class="card highlight"><p class="label">Total Due</p><p id="netBalance">৳0</p></div>
  </div>

  <div class="actions no-print">
    <button onclick="addClientRow()" class="btn btn-add">+ Add to Ledger</button>
    <input type="month" id="monthPicker" value="${new Date().toISOString().slice(0,7)}" class="btn" style="width: 160px; height: 40px; margin-right: 10px;">
    <button onclick="syncClientCloud()" id="saveLedger" class="btn btn-save">💾 Save Cloud</button>
    <button onclick="loadClientCloud()" id="loadLedger" class="btn btn-print" style="background: var(--primary);">📂 Load Cloud</button>
    <button onclick="downloadClientExcel()" class="btn btn-excel">📊 Excel</button>
    <button onclick="window.print()" class="btn btn-print">🖨️ PDF Export</button>
    <input type="text" id="clientSearch" placeholder="🔍 Search records..." class="search-bar">
    <span id="saveStatus" style="font-size: 12px; margin-left: 10px; font-weight: 500;"></span>
  </div>

  <div style="overflow-x: auto;">
    <table id="clientLedger">
      <thead>
        <tr>
          <th>Name</th><th>Address</th><th>Date</th><th>Road & Carrier</th><th>Received by</th><th>Bill Amount</th><th>Receive</th><th>Travel Date</th>
          <th class="no-print" style="width: 100px;">Actions</th>
        </tr>
      </thead>
      <tbody id="clientLedgerBody"></tbody>
    </table>
  </div>
</div>
`;

function calculateClientLedger() {
    const tbody = document.getElementById('clientLedgerBody');
    let totalBill = 0,
        totalRec = 0,
        net = 0;
    tbody.querySelectorAll('tr').forEach(row => {
        const inputs = row.querySelectorAll('input[type="number"]');
        const bill = parseFloat(inputs[1] ? inputs[1].value : '') || 0; // Bill Amount (index 5)
        const rec = parseFloat(inputs[0] ? inputs[0].value : '') || 0; // Receive (index 6)
        totalBill += bill;
        totalRec += rec;
        net += (bill - rec);
    });
    document.getElementById('totalIn').innerText = '৳' + totalBill.toLocaleString();
    document.getElementById('totalOut').innerText = '৳' + totalRec.toLocaleString();
    const netEl = document.getElementById('netBalance');
    netEl.innerText = '৳' + net.toLocaleString();
    const netCard = document.getElementById('netCard');
    netCard.style.borderLeft = net > 0 ? '5px solid #ef4444' : '5px solid #10b981';
    netCard.style.backgroundColor = net > 0 ? 'rgba(239, 68, 68, 0.1)' : 'rgba(16, 185, 129, 0.1)';
}

function addClientRow(data = {}) {
    const tbody = document.getElementById('clientLedgerBody');
    const row = document.createElement('tr');
    row.innerHTML = `
    <td><input type="text" value="${data.name || ''}" placeholder="Client Name"></td>
    <td><input type="text" value="${data.address || ''}" placeholder="Address"></td>
    <td><input type="date" value="${data.date || ''}"></td>
    <td><input type="text" value="${data.carrier || ''}" placeholder="Road/Carrier"></td>
    <td><input type="text" value="${data.receivedBy || ''}" placeholder="Received By"></td>
    <td><input type="number" value="${data.bill || 0}" oninput="calculateClientLedger()"></td>
    <td><input type="number" value="${data.receive || 0}" oninput="calculateClientLedger()"></td>
    <td><input type="date" value="${data.travelDate || ''}"></td>
    <td class="no-print">
      <button onclick="this.closest('tr').remove(); calculateClientLedger();" class="btn-del" style="background:none; border:none; cursor:pointer; font-size:18px;">❌</button>
    </td>
  `;
    tbody.appendChild(row);
    calculateClientLedger();
}

// Cloud functions (client-specific)
async function syncClientCloud() {
    const tbody = document.getElementById('clientLedgerBody');
    const firstName = tbody.querySelector('tr input[type="text"]') ? tbody.querySelector('tr input[type="text"]').value : '';
    if (!firstName) return alert("Enter client name in first row.");

    const month = document.getElementById('monthPicker').value;
    const statusEl = document.getElementById('saveStatus');

    const rows = Array.from(tbody.querySelectorAll('tr')).map(tr => {
        const ins = tr.querySelectorAll('input');
        return {
            name: ins[0].value,
            address: ins[1].value,
            date: ins[2].value,
            carrier: ins[3].value,
            receivedBy: ins[4].value,
            bill: ins[5].value,
            receive: ins[6].value,
            travelDate: ins[7].value
        };
    });

    await syncToCloud('client', rows, month, statusEl);
}

async function loadClientCloud() {
    const name = prompt("Enter Client Name to Load:");
    if (!name) return;

    const month = document.getElementById('monthPicker').value;
    const statusEl = document.getElementById('saveStatus');

    const tbody = document.getElementById('clientLedgerBody');
    tbody.innerHTML = '';

    loadFromCloud('client', month, statusEl, (data) => {
        data.forEach(row => addClientRow(row));
    });
}

function downloadClientExcel() {
    downloadExcel('clientLedger', 'Client_Ledger');
}

// Render function for main app
export function renderClientLedger(container) {
    container.innerHTML = template;

    // Init if first row missing
    if (document.getElementById('clientLedgerBody').rows.length === 0) {
        addClientRow();
    }

    // Event listeners
    document.getElementById('saveLedger').onclick = syncClientCloud;
    document.getElementById('loadLedger').onclick = loadClientCloud;

    // Init shared
    initTheme();
    initConverter();
    initSearch('clientSearch', 'clientLedgerBody');
    calculateClientLedger();

    // Auto-sync (provide row/status getters)
    startAutoSync('client', () => {
        const tbody = document.getElementById('clientLedgerBody');
        return Array.from(tbody.querySelectorAll('tr')).map(tr => {
            const ins = tr.querySelectorAll('input');
            return { name: ins[0].value, address: ins[1].value, date: ins[2].value, carrier: ins[3].value, receivedBy: ins[4].value, bill: ins[5].value, receive: ins[6].value, travelDate: ins[7].value };
        });
    }, () => document.getElementById('saveStatus'));
}

// Expose globals for onclick (template refs)
window.addClientRow = addClientRow;
window.calculateClientLedger = calculateClientLedger;
window.syncClientCloud = syncClientCloud;
window.loadClientCloud = loadClientCloud;
window.downloadClientExcel = downloadClientExcel;