export default function QuickTemplates({ onApplyTemplate, onTicketSale }) {
    const templates = [
        { label: '🇹🇭 Thai Visa (6.5k In)', particular: 'Visa Fee - Thailand', cashIn: 6500, cashOut: 0, remark: 'Tourist Visa', style: { background: '#ecfdf5', color: '#065f46' } },
        { label: '🇲🇾 Malay Visa (4.5k In)', particular: 'Visa Fee - Malaysia', cashIn: 4500, cashOut: 0, remark: 'Tourist Visa', style: { background: '#ecfdf5', color: '#065f46' } },
        { label: '🏢 Office Rent', particular: 'Office Rent', cashIn: 0, cashOut: 32000, remark: 'Monthly Rent', style: {} },
        { label: '💧 Water', particular: 'Water Bill', cashIn: 0, cashOut: 1000, remark: 'Utility', style: {} },
        { label: '🌐 Internet', particular: 'Internet Bill', cashIn: 0, cashOut: 1200, remark: 'Utility', style: {} },
    ];

    return (
        <div className="template-box">
            <h3>Quick Templates</h3>
            <div className="template-grid">
                <button onClick={onTicketSale} className="btn-ticket-special">
                    🎟️ Ticket Sale (Prompt)
                </button>
                {templates.map((template, index) => (
                    <button
                        key={index}
                        onClick={() => onApplyTemplate(template)}
                        style={template.style}
                    >
                        {template.label}
                    </button>
                ))}
            </div>
        </div>
    );
}

