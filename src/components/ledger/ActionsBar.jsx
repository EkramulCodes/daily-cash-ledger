import { Link } from 'react-router-dom';
import SearchBar from '../shared/SearchBar';

export default function ActionsBar({ 
    onAddRow, 
    onSearch, 
    onExportExcel, 
    showSalaryLink = true,
    onClearAll,
    onClearSelected,
    showHistoryToggle = false,
    historyEnabled = false,
    onToggleHistory,
    autoSaveEnabled = true,
    onToggleAutoSave
}) {
    return (
        <div className="actions no-print">
            <button 
                onClick={onAddRow} 
                className="btn btn-add"
                title="Add new ledger entry row"
                aria-label="Add new entry"
            >+ New Entry</button>
            {showSalaryLink && (
                <Link to="/salary" className="btn btn-add">Salary Ledger</Link>
            )}
            <button 
                onClick={onExportExcel} 
                className="btn btn-excel"
                title="Export current ledger to Excel"
                aria-label="Export Excel"
            >📊 Excel Export</button>
            <button onClick={() => window.print()} className="btn btn-print">🖨️ PDF Export</button>
            
            {/* New buttons */}
            {onClearAll && (
                <button 
                    onClick={onClearAll} 
                    className="btn btn-danger" 
                    style={{background: '#dc2626', color: 'white'}}
                    title="Clear all ledger entries (irreversible)"
                    aria-label="Clear all data"
                >
                    🗑️ Clear All Data
                </button>
            )}
            {onClearSelected && (
                <button 
                    onClick={onClearSelected} 
                    className="btn btn-print"
                    title="Clear selected rows (checkboxes)"
                    aria-label="Clear selected rows"
                >
                    ✓ Clear Selected Rows
                </button>
            )}
<button 
                    onClick={onToggleHistory} 
                    className="btn btn-secondary"
                    style={{ background: historyEnabled ? '#059669' : '#3b82f6', color: 'white' }}
                    title="Toggle change history tracking"
                    aria-label="Toggle history"
                >
                    📜 {historyEnabled ? 'History ON' : 'History OFF'}
                </button>
<SearchBar onSearch={onSearch} />
        </div>
    );
}

