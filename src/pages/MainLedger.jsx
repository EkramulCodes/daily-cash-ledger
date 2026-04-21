import { useState, useEffect, useCallback, useRef } from 'react';
import ConfirmModal from '../components/shared/ConfirmModal';
import Layout from '../components/layout/Layout';
import StatsGrid from '../components/ledger/StatsGrid';
import LedgerTable from '../components/ledger/LedgerTable';
import ActionsBar from '../components/ledger/ActionsBar';
import QuickTemplates from '../components/shared/QuickTemplates';
import AutoSaveStatus from '../components/shared/AutoSaveStatus';
import CategoryChart from '../components/shared/CategoryChart';
import { useLedger } from '../hooks/useLedger';
import { downloadExcel } from '../utils/excelExport';
import { getTodayDate } from '../utils/formatters';

export default function MainLedger() {
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
    } = useLedger('main');

    const [searchTerm, setSearchTerm] = useState('');
    const [selectedRows, setSelectedRows] = useState([]);
    const [showHistoryModal, setShowHistoryModal] = useState(false);
    const [clearModalOpen, setClearModalOpen] = useState(false);
    const [restoreId, setRestoreId] = useState(null);
    const [history, setHistory] = useState([]);
    const autoSaveIntervalRef = useRef(null);

    // Auto-save always ON
    useEffect(() => {
        autoSaveIntervalRef.current = setInterval(() => {
            saveToCloud(true);
        }, 60000);
        return () => {
            if (autoSaveIntervalRef.current) {
                clearInterval(autoSaveIntervalRef.current);
            }
        };
    }, [saveToCloud]);

    // Save to history only on significant changes (add/update/remove)
    useEffect(() => {
        const timeoutId = setTimeout(() => {
            setHistory(prev => [...prev, {
                id: Date.now(),
                timestamp: new Date().toISOString(),
                rows: [...rows]
            }].slice(-100));
        }, 2000); // Debounce 2s
        return () => clearTimeout(timeoutId);
    }, [rows]);

    // Apply template
    const handleApplyTemplate = (template) => {
        addRow({
            date: getTodayDate(),
            particular: template.particular,
            cashIn: template.cashIn,
            cashOut: template.cashOut,
            remark: template.remark
        });
        saveToHistory();
    };

    // Ticket sale prompt
    const handleTicketSale = () => {
        const airline = prompt('Airline:');
        if (airline) {
            addRow({
                date: getTodayDate(),
                particular: `Ticket Sale - ${airline.toUpperCase()}`,
                remark: 'Booking'
            });
            saveToHistory();
        }
    };

    // Export to Excel
    const handleExport = () => {
        downloadExcel('ledger', 'EME_AIR_Ledger');
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
            alert('Please select rows first (checkboxes)');
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

    // History modal toggle
    const toggleHistoryModal = () => {
        setShowHistoryModal(!showHistoryModal);
    };

    // Restore from history
    const restoreFromHistory = (h) => {
        setRestoreId(h.id);
    };

    const confirmRestore = () => {
        const h = history.find(item => item.id === restoreId);
        if (h) {
            setRows(h.rows);
            setSelectedRows([]);
        }
        setShowHistoryModal(false);
        setRestoreId(null);
    };

    // Filter last 3 days history
    const recentHistory = history.filter(h => {
        const daysAgo = (Date.now() - new Date(h.timestamp).getTime()) / (1000 * 60 * 60 * 24);
        return daysAgo <= 3;
    }).slice().reverse();

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
            <div className="analysis-grid no-print">
                <CategoryChart totalIn={totals.totalIn} totalOut={totals.totalOut} />
                <QuickTemplates 
                    onApplyTemplate={handleApplyTemplate}
                    onTicketSale={handleTicketSale}
                />
                <AutoSaveStatus 
                    month={month}
                    onMonthChange={setMonth}
                    status={status}
                />
            </div>

            <StatsGrid totals={totals} />

            <ActionsBar 
                onAddRow={() => { addRow(); saveToHistory(); }}
                onSearch={setSearchTerm}
                onExportExcel={handleExport}
                onClearAll={handleClearAll}
                onClearSelected={handleClearSelected}
                onToggleHistory={toggleHistoryModal}
                clearType="all data"
            />

            {rows.length === 0 ? (
                <div style={{ 
                    textAlign: 'center', 
                    padding: '60px 20px', 
                    color: '#6b7280',
                    fontSize: '16px'
                }}>
                    📝 No entries yet. Click <strong>+ New Entry</strong> to get started!
                </div>
            ) : (
                <LedgerTable 
                    rows={rows}
                    onUpdate={updateRow}
                    onRemove={removeRow}
                    searchTerm={searchTerm}
                    selectedRows={selectedRows}
                    onRowSelect={handleRowSelect}
                    onSelectAll={handleSelectAll}
                />
            )}
            {showHistoryModal && (
                <div style={{ position: 'fixed', top: '20%', left: '50%', transform: 'translate(-50%, -50%)', zIndex: 1000, background: 'white', borderRadius: '8px', padding: '24px', boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)', maxWidth: '500px', maxHeight: '70vh', overflowY: 'auto' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                        <h3>📜 Last 3 Days History</h3>
                        <button onClick={() => setShowHistoryModal(false)} style={{ background: 'none', border: 'none', fontSize: '20px', cursor: 'pointer' }}>×</button>
                    </div>
                    {recentHistory.length === 0 ? (
                        <p>No changes in last 3 days</p>
                    ) : (
                        recentHistory.map(h => (
                            <div key={h.id} style={{ 
                                padding: '12px', 
                                marginBottom: '8px',
                                background: '#f8fafc',
                                borderRadius: '6px',
                                cursor: 'pointer',
                                borderLeft: '4px solid #3b82f6'
                            }}
                            onClick={() => restoreFromHistory(h)}
                            title={`Restore ${h.rows.length} entries from ${new Date(h.timestamp).toLocaleString()}`}
                            >
                                <div style={{ fontSize: '13px', color: '#6b7280', marginBottom: '4px' }}>
                                    {new Date(h.timestamp).toLocaleString()}
                                </div>
                                <div style={{ fontWeight: '600' }}>
                                    {h.rows.length} entries
                                </div>
                            </div>
                        ))
                    )}
                </div>
            )}
            <ConfirmModal
                isOpen={clearModalOpen}
                title="Clear Data Confirmation"
                message={selectedRows.length > 0 ? 
                    `Delete ${selectedRows.length} selected rows? This cannot be undone.` : 
                    'Delete all entries? This cannot be undone.'}
                onConfirm={selectedRows.length > 0 ? confirmClearSelected : confirmClearAll}
                onCancel={() => setClearModalOpen(false)}
            />
            <ConfirmModal
                isOpen={restoreId !== null}
                title="Restore from History"
                message="Restore selected history snapshot? Current data will be replaced."
                onConfirm={confirmRestore}
                onCancel={() => setRestoreId(null)}
                confirmText="Restore"
            />
        </Layout>
    );
}
