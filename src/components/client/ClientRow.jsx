export default function ClientRow({ row, onUpdate, onRemove, isSelected = false, onSelect }) {
    const handleChange = (field, value) => {
        onUpdate(row.id, field, value);
    };

    return (
        <tr style={{ backgroundColor: isSelected ? '#e0f2fe' : 'transparent' }}>
            {onSelect && (
                <td>
                    <input 
                        type="checkbox" 
                        checked={isSelected}
                        onChange={(e) => onSelect(e.target.checked)}
                    />
                </td>
            )}
            <td>
                <input 
                    type="text" 
                    value={row.name} 
                    onChange={(e) => handleChange('name', e.target.value)}
                    placeholder="Client Name"
                />
            </td>
            <td>
                <input 
                    type="text" 
                    value={row.address} 
                    onChange={(e) => handleChange('address', e.target.value)}
                    placeholder="Address"
                />
            </td>
            <td>
                <input 
                    type="date" 
                    value={row.date} 
                    onChange={(e) => handleChange('date', e.target.value)} 
                />
            </td>
            <td>
                <input 
                    type="text" 
                    value={row.roadCarrier} 
                    onChange={(e) => handleChange('roadCarrier', e.target.value)}
                    placeholder="Road/Carrier"
                />
            </td>
            <td>
                <input 
                    type="text" 
                    value={row.receivedBy} 
                    onChange={(e) => handleChange('receivedBy', e.target.value)}
                    placeholder="Received By"
                />
            </td>
            <td>
                <input 
                    type="number" 
                    value={row.billAmount} 
                    onChange={(e) => handleChange('billAmount', e.target.value)} 
                />
            </td>
            <td>
                <input 
                    type="number" 
                    value={row.receive} 
                    onChange={(e) => handleChange('receive', e.target.value)} 
                />
            </td>
            <td>
                <input 
                    type="date" 
                    value={row.travelDate} 
                    onChange={(e) => handleChange('travelDate', e.target.value)} 
                />
            </td>
            <td className="no-print">
                <button onClick={() => onRemove(row.id)} className="btn-del" style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '18px' }}>
                    ❌
                </button>
            </td>
        </tr>
    );
}
