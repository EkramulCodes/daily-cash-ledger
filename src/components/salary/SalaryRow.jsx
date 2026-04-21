
export default function SalaryRow({ row, onUpdate, onRemove, isSelected = false, onSelect }) {
    const handleChange = (field, value) => {
        onUpdate(row.id, field, value);
    };

    return (
        <tr style={{ backgroundColor: isSelected ? '#e0f2fe' : 'transparent' }}>
            <td>
                <input 
                    type="checkbox" 
                    checked={isSelected}
                    onChange={(e) => onSelect && onSelect(e.target.checked)}
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
                    value={row.name} 
                    onChange={(e) => handleChange('name', e.target.value)}
                    placeholder="Employee Name"
                />
            </td>
            <td>
                <input 
                    type="number" 
                    className="salary-cell"
                    value={row.advance} 
                    onChange={(e) => handleChange('advance', e.target.value)} 
                />
            </td>
            <td>
                <input 
                    type="number" 
                    className="salary-cell"
                    value={row.basicSalary} 
                    onChange={(e) => handleChange('basicSalary', e.target.value)} 
                />
            </td>
            <td>
                <input 
                    type="number" 
                    className="salary-cell"
                    value={row.incentive} 
                    onChange={(e) => handleChange('incentive', e.target.value)} 
                />
            </td>
            <td>
                <input 
                    type="number" 
                    className="salary-cell"
                    value={row.insurance} 
                    onChange={(e) => handleChange('insurance', e.target.value)} 
                />
            </td>
            <td>
                <input 
                    type="time" 
                    value={row.entryTime} 
                    onChange={(e) => handleChange('entryTime', e.target.value)} 
                />
            </td>
            <td>
                <input 
                    type="time" 
                    value={row.exitTime} 
                    onChange={(e) => handleChange('exitTime', e.target.value)} 
                />
            </td>
            <td>
                <input 
                    type="text" 
                    value={row.attendance} 
                    onChange={(e) => handleChange('attendance', e.target.value)}
                    placeholder="P/L/A"
                />
            </td>
            <td className="salary-cell" style={{ fontWeight: 700 }}>
                ৳{((parseFloat(row.basicSalary) || 0) - (parseFloat(row.advance) || 0)).toLocaleString()}
            </td>
            <td className="no-print">
                <button onClick={() => onRemove(row.id)} className="btn-del">×</button>
            </td>
        </tr>
    );
}

