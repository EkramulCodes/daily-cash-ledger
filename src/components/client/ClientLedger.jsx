import ClientRow from './ClientRow';

export default function ClientLedger({ 
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
            row.address.toLowerCase().includes(searchLower) ||
            row.roadCarrier.toLowerCase().includes(searchLower) ||
            row.receivedBy.toLowerCase().includes(searchLower) ||
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

            <table id="ledger">
                <thead>
                    <tr>
                        <th style={{ width: '40px' }}>
                            <input 
                                type="checkbox" 
                                checked={allSelected}
                                onChange={(e) => onSelectAll && onSelectAll(e.target.checked)}
                            />
                        </th>
                        <th>Name</th>
                        <th>Address</th>
                        <th>Date</th>
                        <th>Road & Carrier</th>
                        <th>Received by</th>
                        <th>Bill Amount</th>
                        <th>Receive</th>
                        <th>Travel Date</th>
                        <th className="no-print" style={{ width: '100px' }}>Actions</th>
                    </tr>
                </thead>
                <tbody id="ledgerBody">
                    {filteredRows.map(row => (
                        <ClientRow
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
