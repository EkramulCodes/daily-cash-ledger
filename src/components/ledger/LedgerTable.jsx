import LedgerRow from './LedgerRow';

export default function LedgerTable({ 
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
    // Filter rows based on search term
    const filteredRows = rows.filter(row => {
        if (!searchTerm) return true;
        const searchLower = searchTerm.toLowerCase();
        return (
            row.particular.toLowerCase().includes(searchLower) ||
            row.remark.toLowerCase().includes(searchLower) ||
            row.date.includes(searchLower)
        );
    });

    // Calculate running balance for display
    let runningBalance = 0;
    const rowsWithBalance = filteredRows.map(row => {
        const cin = parseFloat(row.cashIn) || 0;
        const cout = parseFloat(row.cashOut) || 0;
        runningBalance += (cin - cout);
        return { ...row, balance: runningBalance };
    });

    const allSelected = rows.length > 0 && selectedRows.length === rows.length;

return (
        <div className="overflow-x-auto overflow-y-auto max-h-[70vh]">
            <table id="ledger" className="w-full border-collapse table-auto">
                <thead>
                    <tr>
                        <th className="w-10 checkbox-col">
                            <input 
                                type="checkbox" 
                                checked={allSelected}
                                onChange={(e) => onSelectAll && onSelectAll(e.target.checked)}
                                title="Select All"
                            />
                        </th>
                        <th className="w-36 date-col cursor-pointer hover:bg-blue-500 hover:text-white">
                            📅 Date
                        </th>
                        <th className="particular-col cursor-pointer hover:bg-blue-500 hover:text-white">
                            📝 Particular / Description
                        </th>
                        <th className="w-32 amount-col">
                            💰 Cash In
                        </th>
                        <th className="w-36 amount-col">
                            💸 Cash Out
                        </th>
                        <th className="w-40 balance-col font-mono font-bold">
                            ⚖️ Balance
                        </th>
                        <th className="remark-col">
                            📌 Remark
                        </th>
                        <th className="no-print w-24 actions-col">
                            Actions
                        </th>
                    </tr>
                </thead>
                <tbody id="ledgerBody">
                    {rowsWithBalance.length === 0 ? (
                        <tr>
                            <td colSpan="8" className="text-center py-16 text-gray-500 italic">
                                No matching records. Try adjusting search or add new entry.
                            </td>
                        </tr>
                    ) : (
                        rowsWithBalance.map(row => (
                            <LedgerRow
                                key={row.id}
                                row={row}
                                onUpdate={onUpdate}
                                onRemove={onRemove}
                                balance={row.balance}
                                isSelected={selectedRows.includes(row.id)}
                                onSelect={(checked) => onRowSelect && onRowSelect(row.id, checked)}
                            />
                        ))
                    )}
                </tbody>
            </table>
        </div>
    );
}

