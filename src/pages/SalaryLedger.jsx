import { useState, useEffect, useCallback } from 'react';
import ConfirmModal from '../components/shared/ConfirmModal';
import { Link } from 'react-router-dom';
import Layout from '../components/layout/Layout';
import SalaryLedger from '../components/salary/SalaryLedger';
import SearchBar from '../components/shared/SearchBar';
import { downloadExcel } from '../utils/excelExport';
import { getTodayDate, formatCurrency } from '../utils/formatters';

export default function SalaryLedgerPage() {
    const [rows, setRows] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedRows, setSelectedRows] = useState([]);
    const [historyEnabled, setHistoryEnabled] = useState(false);
    const [history, setHistory] = useState([]);
    const [autoSaveEnabled, setAutoSaveEnabled] = useState(true);
    const [clearModalOpen, setClearModalOpen] = useState(false);

    // Initialize with empty row
    useEffect(() => {
        if (rows.length === 0) {
            addRow();
        }
    }, []);

    // Save to history when rows change
    const saveToHistory = useCallback(() => {
        if (historyEnabled && rows.length > 0) {
            setHistory(prev => [...prev, {
                id: Date.now(),
                timestamp: new Date().toISOString(),
                rows: [...rows]
            }].slice(-50));
        }
    }, [historyEnabled, rows]);

    const addRow = () => {
        setRows(prev => [...prev, {
            id: Date.now(),
            date: getTodayDate(),
            name: '',
            advance: 0,
            basicSalary: 0,
            incentive: 0,
            insurance: 0,
            entryTime: '',
            exitTime: '',
            attendance: ''
        }]);
        saveToHistory();
    };

    const removeRow = (id) => {
        saveToHistory();
        setRows(prev => prev.filter(row => row.id !== id));
    };

    const updateRow = (id, field, value) => {
        setRows(prev => prev.map(row => 
            row.id === id ? { ...row, [field]: value } : row
        ));
    };

    // Calculate totals
    const totals = rows.reduce((acc, row) => {
        const basic = parseFloat(row.basicSalary) || 0;
        const advance = parseFloat(row.advance) || 0;
        acc.totalBasic += basic;
        acc.totalAdvance += advance;
        acc.totalRemaining += (basic - advance);
        return acc;
    }, { totalBasic: 0, totalAdvance: 0, totalRemaining: 0 });

    // Export to Excel
    const handleExport = () => {
        downloadExcel('salaryLedger', 'EME_AIR_Salary_Ledger');
    };

    // Clear all rows
    const handleClearAll = () => {
        setClearModalOpen(true);
    };

    const confirmClearAll = () => {
        saveToHistory();
        setRows([]);
        setSelectedRows([]);
        setClearModalOpen(false);
    };

    // Clear selected rows
    const handleClearSelected = () => {
        if (selectedRows.length === 0) {
            alert('Please select salary rows first using checkboxes');
            return;
        }
        setClearModalOpen(true);
    };

    const confirmClearSelected = () => {
        saveToHistory();
        setRows(prev => prev.filter(row => !selectedRows.includes(row.id)));
        setSelectedRows([]);
        setClearModalOpen(false);
    };

    // Toggle history
    const handleToggleHistory = () => {
        setHistoryEnabled(!historyEnabled);
    };

    // Toggle auto save
    const handleToggleAutoSave = () => {
        setAutoSaveEnabled(!autoSaveEnabled);
    };

    // Handle row selection
    const handleRowSelect = (rowId, isSelected) => {
        if (isSelected) {
            setSelectedRows(prev => [...prev, rowId]);
        } else {
            setSelectedRows(prev => prev.filter(id => id !== rowId));
        }
    };

    // Handle select all
    const handleSelectAll = (isSelected) => {
        if (isSelected) {
            setSelectedRows(rows.map(row => row.id));
        } else {
            setSelectedRows([]);
        }
    };

    return (
        <Layout>
            <div className="stats-grid">
                <div className="card">
                    <p className="label">Total Basic Salary</p>
                    <p className="in-text">{formatCurrency(totals.totalBasic)}</p>
                </div>
                <div className="card">
                    <p className="label">Total Advance</p>
                    <p className="out-text">{formatCurrency(totals.totalAdvance)}</p>
                </div>
                <div className="card highlight">
                    <p className="label">Net Remaining Salary</p>
                    <p>{formatCurrency(totals.totalRemaining)}</p>
                </div>
            </div>

            <div className="actions no-print">
                <button onClick={addRow} className="btn btn-add">+ New Salary Entry</button>
                <Link to="/" className="btn btn-add">Back to Cash Ledger</Link>
                <button onClick={handleExport} className="btn btn-excel">📊 Excel</button>
                <button onClick={() => window.print()} className="btn btn-print">🖨️ PDF Export</button>
                <button onClick={handleClearAll} className="btn btn-print" style={{background: '#dc2626'}}>🗑️ Clear All</button>


                >
                    {historyEnabled ? '📜 History ON' : '📜 History OFF'}
                </button>
                <button 
                    onClick={handleToggleAutoSave} 
                    className="btn btn-save"
                    style={{ background: autoSaveEnabled ? '#059669' : '#64748b' }}
                >
                    {autoSaveEnabled ? '✅ Auto Save ON' : '⏸️ Auto Save OFF'}
                </button>
                <SearchBar onSearch={setSearchTerm} />
            </div>

            {rows.length === 0 ? (
                <div style={{ 
                    textAlign: 'center', 
                    padding: '60px 20px', 
                    color: '#6b7280',
                    fontSize: '16px'
                }}>
                    💰 No salary entries yet. Click <strong>+ New Salary Entry</strong> to get started!
                </div>
            ) : (
                <SalaryLedger 
                    rows={rows}
                    onUpdate={updateRow}
                    onRemove={removeRow}
                    searchTerm={searchTerm}
                    selectedRows={selectedRows}
                    onRowSelect={handleRowSelect}
                    onSelectAll={handleSelectAll}
                    historyEnabled={historyEnabled}
                    history={history}
                />
            )}
            <ConfirmModal
                isOpen={clearModalOpen}
                title="Clear Salary Data"
                message={selectedRows.length > 0 ? 
                    `Delete ${selectedRows.length} salary rows? Cannot be undone.` : 
                    'Delete all salary entries? This cannot be undone.'}
                onConfirm={selectedRows.length > 0 ? confirmClearSelected : confirmClearAll}
                onCancel={() => setClearModalOpen(false)}
            />
        </Layout>
    );
}
