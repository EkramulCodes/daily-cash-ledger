// salary-ledger.js - Salary Ledger Module
import { initSearch, downloadExcel, initConverter, initTheme, toggleDarkMode } from './ledger-utils.js';
import { syncToCloud, loadFromCloud, startAutoSync } from './cloud-sync.js';

const template = `
<div class="salary-ledger">
  <div class="analysis-grid no-print">
    <div class="chart-container">
      <canvas id="salaryChart"></canvas>
    </div>
    <div class="template-box">
      <h3>Quick Templates</h3>
      <div class="template-grid">
        <button onclick="applySalaryTemplate('Visa Fee - Thailand', 6500, 0, 'Tourist Visa')" style="background: #ecfdf5; color: #065f46;">🇹🇭 Thai Visa (6.5k In)</button>
        <button onclick="applySalaryTemplate('Visa Fee - Malaysia', 4500, 0, 'Tourist Visa')" style="background: #ecfdf5; color: #065f46;">🇲🇾 Malay Visa (4.5k In)</button>
        <button onclick="applySalaryTemplate('Office Rent', 0, 32000, 'Monthly Rent')">🏢 Office Rent</button>
        <button onclick="applySalaryTemplate('Water Bill', 0, 1000, 'Utility')">💧 Water</button>
        <button onclick="applySalaryTemplate('Internet Bill', 0, 1200, 'Utility')">🌐 Internet</button>
      </div>
    </div>
    <div class="sync-box">
      <h3>Cloud Database</h3>
      <input type="month" id="salaryMonthPicker" value="${new Date().toISOString().slice(0,7)}">
      <div style="display: flex; gap: 8px; margin-top: 10px;">
        <button id="salarySave" class="btn btn-save" style="flex:1">💾 Save</button>
        <button id="salaryLoad" class="btn btn-print" style="flex:1; background: var(--primary);">📂 Load</button>
      </div>
      <div id="salaryStatus" style="font-size: 11px; margin-top: 8px; text-align:center;"></div>
    </div>
  </div>

  <div class="stats-grid">
    <div class="card"><p class="label">Total Basic Salary</p><p class="in-text" id="totalBasic">৳0</p></div>
    <div class="card"><p class="label">Total Advance</p><p class="out-text" id="totalAdvance">৳0</p></div>
    <div id="salaryNetCard" class="card highlight"><p class="label">Net Remaining Salary</p><p id="netRemaining">৳0</p></div>
  </div>

  <div class="actions no-print">
    <button onclick="addSalaryRow()" class="btn btn-add">+ New Salary Entry</button>
    <button onclick="downloadSalaryExcel()" class="btn btn-excel">📊 Excel</button>
    <button onclick="window.print()" class="btn btn-print">🖨️ PDF Export</button>
    <input type="text" id="salarySearch" placeholder="🔍 Search records..." class="search-bar">
  </div>

  <div style="overflow-x: auto;">
    <table id="salaryLedger">
      <thead>
        <tr>
          <th style="width: 130px;">Date</th>
          <th>Name</th>
          <th style="width: 120px;">Advance</th>
          <th style="width: 120px;">Basic Salary</th>
          <th style="width: 120px;">Incentive</th>
          <th style="width: 120px;">Insurance</th>
          <th style="width: 120px;">Entry Time</th>
          <th style="width: 120px;">Exit Time</th>
          <th style="width: 120px;">Attendance</th>
          <th style="width: 120px;">Remaining Salary</th>
          <th class="no-print" style="width: 80px;">Actions</th>
        </tr>
      </thead>
      <tbody id="salaryLedgerBody"></tbody>
    </table>
  </div>
</div>
`;

let salaryChart = null;

function calculateSalaryLedger() {
    const tbody = document.getElementById('salaryLedgerBody');
    let totalBasic = 0,
        totalAdvance = 0,
        netRemaining = 0;
    tbody.querySelectorAll('tr').forEach(row => {
        const advance = parseFloat(row.cells[2].querySelector('input') ? .value) || 0;
        const basic = parseFloat(row.cells[3].querySelector('input') ? .value) || 0;
        totalBasic += basic;
        totalAdvance += advance;
        netRemaining += (basic - advance);
    });
    document.getElementById('totalBasic').innerText = '৳' + totalBasic.toLocaleString();
    document.getElementById('totalAdvance').innerText = '৳' + totalAdvance.toLocaleString();
    document.getElementById('netRemaining').innerText = '৳' + netRemaining.toLocaleString();
}

function addSalaryRow(data = {}) {
    const tbody = document.getElementById('salaryLedgerBody');
    const row = document.createElement('tr');
    row.innerHTML = `
    <td><input type="date" value="${data.date || ''}"></td>
    <td><input type="text" value="${data.name || ''}"></td>
    <td><input type="number" value="${data.advance || 0}" oninput="calculateSalaryLedger()"></td>
    <td><input type="number" value="${data.basic || 0}" oninput="calculateSalaryLedger()"></td>
    <td><input type="number" value="${data.incentive || 0}" oninput="calculateSalaryLedger()"></td>
    <td><input type="number" value="${data.insurance || 0}" oninput="calculateSalaryLedger()"></td>
    <td><input type="time" value="${data.entryTime || ''}"></td>
    <td><input type="time" value="${data.exitTime || ''}"></td>
    <td><input type="text" value="${data.attendance || ''}"></td>
    <td class="remaining-col">৳0</td>
    <td class="no-print">
      <button onclick="this.closest('tr').remove(); calculateSalaryLedger();" class="btn-del">×</button>
    </td>
  `;
    tbody.appendChild(row);
    calculateSalaryLedger();
}

async function syncSalaryCloud() {
    const month = document.getElementById('salaryMonthPicker').value;
    const statusEl = document.getElementById('salaryStatus');
    const rows = []; // extract from tbody similar to client
    await syncToCloud('salary', rows, month, statusEl);
}

async function loadSalaryCloud() {
    const month = document.getElementById('salaryMonthPicker').value;
    const statusEl = document.getElementById('salaryStatus');
    // clear and load
}

function downloadSalaryExcel() {
    downloadExcel('salaryLedger', 'Salary_Ledger');
}

function applySalaryTemplate(p, ci, co, r) {
    addSalaryRow({ particular: p, cashIn: ci, cashOut: co, remark: r });
}

export function renderSalaryLedger(container) {
    container.innerHTML = template;
    if (document.getElementById('salaryLedgerBody').rows.length === 0) addSalaryRow();

    // Event bindings
    document.getElementById('salarySave').onclick = syncSalaryCloud;
    document.getElementById('salaryLoad').onclick = loadSalaryCloud;

    initTheme();
    initConverter();
    initSearch('salarySearch', 'salaryLedgerBody');
    calculateSalaryLedger();

    // Charts, templates etc.
}

// Globals
window.addSalaryRow = addSalaryRow;
window.calculateSalaryLedger = calculateSalaryLedger;
window.downloadSalaryExcel = downloadSalaryExcel;
window.applySalaryTemplate = applySalaryTemplate;