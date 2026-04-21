export default function CloudSync({ status, month, onMonthChange, autoSaveEnabled }) {
    return (
        <div className="sync-box">
            <h3>Cloud Sync</h3>
            <div style={{ display: 'flex', gap: '8px', alignItems: 'center', marginBottom: '10px' }}>
                <input 
                    type="month" 
                    id="monthPicker" 
                    value={month}
                    onChange={(e) => onMonthChange(e.target.value)}
                    style={{ flex: 1 }}
                />
                <div className="btn-icon" style={{ 
                    background: autoSaveEnabled ? '#059669' : '#dc2626',
                    color: 'white',
                    padding: '8px 12px',
                    borderRadius: '6px',
                    fontSize: '12px',
                    fontWeight: '600'
                }}>
                    {autoSaveEnabled ? '🟢 AUTO' : '🔴 OFF'}
                </div>
            </div>
            <div className={`sync-status ${status.type}`} style={{ fontSize: '11px', textAlign: 'center' }}>
                {status.message}
            </div>
        </div>
    );
}

