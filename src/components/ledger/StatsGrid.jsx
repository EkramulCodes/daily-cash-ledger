import { formatCurrency } from '../../utils/formatters';

export default function StatsGrid({ totals }) {
    const isNegative = totals.balance < 0;
    
    return (
        <div className="stats-grid">
            <div className="card">
                <p className="label">Total In</p>
                <p className="in-text">{formatCurrency(totals.totalIn)}</p>
            </div>
            <div className="card">
                <p className="label">Total Out</p>
                <p className="out-text">{formatCurrency(totals.totalOut)}</p>
            </div>
            <div id="netCard" className={`card highlight ${isNegative ? 'negative-bal' : ''}`}>
                <p className="label">Net Cash Position</p>
                <p id="netBalance">{formatCurrency(totals.balance)}</p>
            </div>
        </div>
    );
}

