import { format } from 'date-fns';

export default function HistoryModal({ isOpen, onClose, history, onRestore, title = 'History' }) {
  if (!isOpen) return null;

  return (
    <div className="history-backdrop" onClick={onClose}>
      <div className="history-modal" onClick={(e) => e.stopPropagation()}>
        <div className="history-header">
          <h3>📜 {title} History</h3>
          <button className="btn btn-gray" onClick={onClose}>✕</button>
        </div>
        <div className="history-list">
          {history.length === 0 ? (
            <p className="no-history">No history snapshots yet.</p>
          ) : (
            history.slice().reverse().map((snapshot) => (
              <div key={snapshot.id} className="history-item">
                <div className="history-meta">
                  <span>{format(new Date(snapshot.timestamp), 'MMM dd, yyyy HH:mm')}</span>
                  <span>{snapshot.rows.length} rows</span>
                </div>
                <button 
                  className="btn btn-primary btn-small"
                  onClick={() => onRestore(snapshot.rows)}
                >
                  Restore
                </button>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
