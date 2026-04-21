
import SalaryRow from './SalaryRow';

export default function SalaryLedger({ 
    rows, 
    onUpdate, 
    onRemove, 
    searchTerm,
    selectedRows = [],
    onRowSelect,
    onSelectAll,
    historyEnabled = false,
    history = []
}) {
    const filteredRows = rows.filter(row => {
        if (!searchTerm) return true;
        const searchLower = searchTerm.toLowerCase();
        return (
            row.name.toLowerCase().includes(searchLower) ||
            row.date.includes(searchLower)
        );
    });

    const allSelected = rows.length > 0 && selectedRows.length === rows.length;

    return (
        <div style={{ overflowX: 'auto' }}>
            {historyEnabled && history.length > 0 && (
                <div className="history-panel" style={{ 
                    marginBottom: '20px', 
                    padding: '15px', 
                    background: '#f8fafc', 
                    borderRadius: '8px',
                    border: '1px solid #e2e8f0'
                }}>
                    <h4 style={{ margin: '0 0 10px 0' }}>📜 History ({history.length} entries)</h4>
                    <div style={{ maxHeight: '150px', overflowY: 'auto' }}>
                        {history.map(h => (
                            <div key={h.id} style={{ 
                                padding: '8px', 
                                marginBottom: '5px',
                                background: 'white',
                                borderRadius: '4px',
                                fontSize: '12px',
                                cursor: 'pointer'
                            }}
                            onClick={() => {
                                if (window.confirm('Restore this history state?')) {
                                    // Restore logic would go here
                                }
                            }}
                            >
                                {new Date(h.timestamp).toLocaleString()} - {h.rows.length} entries
                            </div>
                        ))}
                    </div>
                </div>
            )}

            <table id="salaryLedger">
                <thead>
                    <tr>
                        <th style={{ width: '40px' }}>
                            <input 
                                type="checkbox" 
                                checked={allSelected}
                                onChange={(e) => onSelectAll && onSelectAll(e.target.checked)}
                            />
                        </th>
                        <th style={{ width: '130px' }}>Date</th>
                        <th>Name</th>
                        <th style={{ width: '120px' }}>Advance</th>
                        <th style={{ width: '120px' }}>Basic Salary</th>
                        <th style={{ width: '120px' }}>Incentive</th>
                        <th style={{ width: '120px' }}>Insurance</th>
                        <th style={{ width: '120px' }}>Entry Time</th>
                        <th style={{ width: '120px' }}>Exit Time</th>
                        <th style={{ width: '120px' }}>Attendance</th>
                        <th style={{ width: '120px' }}>Remaining Salary</th>
                        <th className="no-print" style={{ width: '80px' }}>Actions</th>
                    </tr>
                </thead>
                <tbody id="salaryLedgerBody">
                    {filteredRows.map(row => (
                        <SalaryRow
                            key={row.id}
                            row={row}
                            onUpdate={onUpdate}
                            onRemove={onRemove}
                            isSelected={selectedRows.includes(row.id)}
                            onSelect={(checked) => onRowSelect && onRowSelect(row.id, checked)}
                        />
                    ))}
                </tbody>
            </table>
        </div>
    );
}

