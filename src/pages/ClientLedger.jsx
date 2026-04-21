import { useState, useRef, useCallback, useEffect } from 'react';
import ConfirmModal from '../components/shared/ConfirmModal';
import { Link } from 'react-router-dom';
import Layout from '../components/layout/Layout';
import ClientLedger from '../components/client/ClientLedger';
import SearchBar from '../components/shared/SearchBar';
import CloudSync from '../components/shared/CloudSync';
import StatsGrid from '../components/ledger/StatsGrid';
import { useLedger } from '../hooks/useLedger';
import { downloadExcel } from '../utils/excelExport';

export default function ClientLedgerPage() {
    const {
        rows,
        setRows,
        totals,
        month,
        setMonth,
        status,
        addRow,
        removeRow,
        updateRow,
        saveToCloud,
        loadFromCloudData
    } = useLedger('client');

    const [searchTerm, setSearchTerm] = useState('');
    const [selectedRows, setSelectedRows] = useState([]);
    const [historyEnabled, setHistoryEnabled] = useState(false);
    const [showHistory, setShowHistory] = useState(false);
    const [history, setHistory] = useState([]);
    const [autoSaveEnabled, setAutoSaveEnabled] = useState(true);
    const [clearModalOpen, setClearModalOpen] = useState(false);  
    const [restoreId, setRestoreId] = useState(null);
    const autoSaveIntervalRef = useRef(null);

    // Auto-save functionality
    useEffect(() => {
        if (autoSaveEnabled) {
            autoSaveIntervalRef.current = setInterval(() => {
                saveToCloud(true);
            }, 60000);
        } else {
            if (autoSaveIntervalRef.current) {
                clearInterval(autoSaveIntervalRef.current);
            }
        }
        return () => {
            if (autoSaveIntervalRef.current) {
                clearInterval(autoSaveIntervalRef.current);
            }
        };
    }, [autoSaveEnabled, saveToCloud]);

    // Save to history when rows change
    const saveToHistory = useCallback(() => {
        if (historyEnabled) {
            setHistory(prev => [...prev, {
                id: Date.now(),
                timestamp: new Date().toISOString(),
                rows: [...rows]
            }].slice(-50));
        }
    }, [historyEnabled, rows]);

    // Export to Excel
    const handleExport = () => {
        downloadExcel('ledger', 'EME_AIR_Client_Ledger');
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
            alert('Please select rows first using checkboxes');
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

    const restoreHistory = (rows) => {
        setRows(rows);
        setSelectedRows([]);
        setShowHistory(false);
        saveToCloud();
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

    // Stats for client ledger
    const clientTotals = {
        totalIn: totals.totalIn,
        totalOut: totals.totalOut,
        balance: totals.balance
    };

    return (
        <Layout>
            <StatsGrid totals={clientTotals} />

            <div className="actions no-print">
                <button onClick={() => { addRow(); saveToHistory(); }} className="btn btn-add">+ Add to Ledger</button>
                <Link to="/" className="btn btn-add">Back to Cash Ledger</Link>
                {/* Manual save/load removed - autosave enabled */}
                <button onClick={handleExport} className="btn btn-excel">📊 Excel</button>
                <button onClick={() => window.print()} className="btn btn-print">🖨️ PDF Export</button>
                
                {/* New buttons */}
                <button onClick={handleClearAll} className="btn btn-print" style={{background: '#dc2626'}}>🗑️ Clear All</button>
                <button onClick={handleClearSelected} className="btn btn-print">✓ Clear Selected</button>
                <button 
                    onClick={() => setShowHistory(!showHistory)} 
                    className="btn btn-primary"
                >
                    📜 History
                </button>
                <button 
                    onClick={handleToggleAutoSave} 
                    className="btn btn-save"
                    style={{ background: autoSaveEnabled ? '#059669' : '#64748b' }}
                >
                    {autoSaveEnabled ? '✅ Auto Save ON' : '⏸️ Auto Save OFF'}
                </button>
                
                <SearchBar onSearch={setSearchTerm} />
                <span id="saveStatus" className={`sync-status ${status.type}`} style={{ marginLeft: '10px' }}>
                    {status.message}
                </span>
            </div>

            {rows.length === 0 ? (
                <div style={{ 
                    textAlign: 'center', 
                    padding: '60px 20px', 
                    color: '#6b7280',
                    fontSize: '16px'
                }}>
                    👥 No clients yet. Click <strong>+ Add to Ledger</strong> to get started!
                </div>
            ) : (
                <ClientLedger 
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
                title="Clear Data"
                message={selectedRows.length > 0 ? 
                    `Delete ${selectedRows.length} selected clients? Cannot be undone.` : 
                    'Delete all client entries? This cannot be undone.'}
                onConfirm={selectedRows.length > 0 ? confirmClearSelected : confirmClearAll}
                onCancel={() => setClearModalOpen(false)}
            />
            <HistoryModal
                isOpen={showHistory}
                onClose={() => setShowHistory(false)}
                history={history}
                onRestore={restoreHistory}
                title="Client Ledger"
            />
        </Layout>
    );
}

import HistoryModal from '../components/shared/HistoryModal';
