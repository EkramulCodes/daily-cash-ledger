import { useState } from 'react';

export default function CurrencyConverter() {
    const [usd, setUsd] = useState('');
    const [rate, setRate] = useState(122);

    const convert = () => {
        const val = (parseFloat(usd) || 0) * rate;
        return '৳' + val.toLocaleString();
    };

    return (
        <div className="converter-mini">
            <span>USD to BDT: </span>
            <input 
                type="number" 
                id="usdInput" 
                placeholder="USD" 
                value={usd}
                onChange={(e) => setUsd(e.target.value)}
            />
            <span>×</span>
            <input 
                type="number" 
                id="rateInput" 
                value={rate}
                onChange={(e) => setRate(e.target.value)}
            />
            <strong id="bdtResult">{convert()}</strong>
        </div>
    );
}

