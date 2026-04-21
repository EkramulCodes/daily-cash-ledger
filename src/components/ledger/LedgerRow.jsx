import { useState, useEffect } from 'react';
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { generateSerial, formatDateDisplay, parseDateFromDisplay, formatDateForInput } from '../../utils/formatters';

export default function LedgerRow({ row, onUpdate, onRemove, balance, isSelected = false, onSelect }) {
    const [showInvoice, setShowInvoice] = useState(false);

    const handleChange = (field, value) => {
        onUpdate(row.id, field, value);
    };

    const printInvoice = () => {
        const serial = generateSerial();
        const desc = row.particular;
        const cin = row.cashIn;
        const date = row.date;
        const remark = row.remark || "Service Payment";

        const printWindow = window.open('', '_blank');
        printWindow.document.write(`
            <html><head><title>Receipt - EME AIR INTERNATIONAL</title>
            <style>
                @page { size: A4; margin: 20mm; }
                body { font-family: 'Inter', sans-serif; padding: 20px; color: #1e293b; background: #fff; }
                .receipt { border: 2px solid #1e293b; padding: 40px; width: 100%; box-sizing: border-box; border-radius: 8px; min-height: 250mm; position: relative; }
                .header { text-align: center; border-bottom: 2px solid #1e293b; padding-bottom: 20px; }
                .header img { height: 80px; margin-bottom: 10px; }
                .title { font-size: 28px; font-weight: 800; text-decoration: underline; margin-top: 10px; }
                .details { margin: 60px 0; font-size: 22px; line-height: 3; }
                .line { border-bottom: 1.5px dotted #64748b; font-weight: 600; padding: 0 10px; min-width: 250px; display: inline-block; }
                .amount-box { border: 3px solid #1e293b; display: inline-block; padding: 15px 40px; font-size: 32px; font-weight: 800; background: #f8fafc; margin-top: 20px; }
                .footer { margin-top: 120px; display: flex; justify-content: space-between; font-weight: bold; font-size: 18px; }
                .sign-area { border-top: 2px solid #000; width: 220px; text-align: center; padding-top: 10px; }
                .no-print-btn { background: #2563eb; color: white; padding: 15px 30px; border: none; border-radius: 5px; font-weight: bold; cursor: pointer; margin-top: 20px; }
                @media print { .no-print { display: none !important; } }
            </style></head><body>
                <div class="receipt">
                    <div class="header">
<img src="./logo.png" onerror="this.style.display='none'">
                        <div class="title">MONEY RECEIPT</div>
                        <p style="font-size: 18px;">Serial No: <b>${serial}</b></p>
                    </div>
                    <div class="details">
                        Date: <span class="line" contenteditable="true">${date}</span><br>
                        Received From: <span class="line" contenteditable="true">${desc}</span><br>
                        Client Name: <span class="line" contenteditable="true"></span><br>
                        Client Number: <span class="line" contenteditable="true"></span><br>
                        Purpose of Payment: <span class="line" contenteditable="true">${remark}</span>
                    </div>
                    <div class="amount-box">TOTAL BDT: ৳<span contenteditable="true">${parseFloat(cin).toLocaleString()}</span></div>
                    <div class="footer">
                        <div class="sign-area" contenteditable="true">Customer Signature</div>
                        <div class="sign-area" contenteditable="true">Authorized Seal & Sign</div>
                </div>
                <div style="text-align:center;" class="no-print">
                    <button class="no-print-btn" onclick="window.print()">Click to Print Receipt</button>
                </div>
            </body></html>
        `);
        printWindow.document.close();
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
                <div className="date-input-wrapper">
                    <DatePicker
                        selected={row.date ? new Date(formatDateForInput(row.date)) : null}
                        onChange={(date) => handleChange('date', date ? formatDateForInput(date) : '')}
                        dateFormat="dd/MM/yyyy"
                        className="date-input"
                        placeholderText="dd/mm/yyyy"
                    />
                    <button type="button" className="date-input-icon" tabIndex={-1}></button>
                </div>
            </td>
            <td>
                <input 
                    type="text" 
                    className="p-input"
                    value={row.particular} 
                    onChange={(e) => handleChange('particular', e.target.value)} 
                />
            </td>
            <td>
                <input 
                    type="number" 
                    className="cashIn"
                    value={row.cashIn} 
                    onChange={(e) => handleChange('cashIn', e.target.value)} 
                />
            </td>
            <td>
                <input 
                    type="number" 
                    className="cashOut"
                    value={row.cashOut} 
                    onChange={(e) => handleChange('cashOut', e.target.value)} 
                />
            </td>
            <td className="balance-col" style={{ fontWeight: 700 }}>
                ৳{balance.toLocaleString()}
            </td>
            <td>
                <input 
                    type="text" 
                    className="remark-input"
                    value={row.remark} 
                    onChange={(e) => handleChange('remark', e.target.value)} 
                />
            </td>
            <td className="no-print">
                <button onClick={printInvoice} className="btn-inv">📄</button>
                <button onClick={() => onRemove(row.id)} className="btn-del">×</button>
            </td>
        </tr>
    );
}
