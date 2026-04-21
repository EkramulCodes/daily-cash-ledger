import { useState, useEffect, useCallback, useRef } from 'react';
import { syncToCloud, loadFromCloud, AUTO_SYNC_INTERVAL } from '../utils/cloudSync';
import { getTodayDate, formatDateForInput } from '../utils/formatters';

export function useLedger(type = 'main') {
    const [rows, setRows] = useState([]);
    const [totals, setTotals] = useState({ totalIn: 0, totalOut: 0, balance: 0 });
    const [month, setMonth] = useState(new Date().toISOString().slice(0, 7));
    const [status, setStatus] = useState({ message: '', type: '' });
    const [loading, setLoading] = useState(false);
    const [isDirty, setIsDirty] = useState(false);
    const isInitialized = useRef(false);

    // Add a new row
    const addRow = useCallback((data = {}) => {
        const defaultData = type === 'main' ? {
            date: data.date || getTodayDate(),
            particular: data.particular || '',
            cashIn: data.cashIn || 0,
            cashOut: data.cashOut || 0,
            remark: data.remark || ''
        } : {
            name: data.name || '',
            address: data.address || '',
            date: data.date || getTodayDate(),
            roadCarrier: data.roadCarrier || '',
            receivedBy: data.receivedBy || '',
            billAmount: data.billAmount || 0,
            receive: data.receive || 0,
            travelDate: data.travelDate || ''
        };

        setRows(prev => [...prev, {...defaultData, id: Date.now() }]);
    }, [type]);

    // Remove a row
    const removeRow = useCallback((id) => {
        setRows(prev => prev.filter(row => row.id !== id));
    }, []);

    // Update a row
    const updateRow = useCallback((id, field, value) => {
        setRows(prev => prev.map(row =>
            row.id === id ? {...row, [field]: value } : row
        ));
    }, []);

    // Calculate totals
    const calculateTotals = useCallback(() => {
        let tIn = 0,
            tOut = 0,
            bal = 0;

        rows.forEach(row => {
            if (type === 'main') {
                const cin = parseFloat(row.cashIn) || 0;
                const cout = parseFloat(row.cashOut) || 0;
                tIn += cin;
                tOut += cout;
                bal += (cin - cout);
            } else {
                const bill = parseFloat(row.billAmount) || 0;
                const rec = parseFloat(row.receive) || 0;
                tIn += bill;
                tOut += rec;
                bal += (bill - rec);
            }
        });

        setTotals({ totalIn: tIn, totalOut: tOut, balance: bal });
    }, [rows, type]);

    // Save to cloud
    const saveToCloud = useCallback(async(isAuto = false) => {
        if (!isAuto) {
            setStatus({ message: '⏳ Syncing...', type: 'loading' });
        }

        const data = rows.map(row => {
            if (type === 'main') {
                return {
                    date: row.date,
                    particular: row.particular,
                    cashIn: row.cashIn,
                    cashOut: row.cashOut,
                    balance: row.balance,
                    remark: row.remark
                };
            } else {
                return {
                    name: row.name,
                    address: row.address,
                    date: row.date,
                    roadCarrier: row.roadCarrier,
                    receivedBy: row.receivedBy,
                    billAmount: row.billAmount,
                    receive: row.receive,
                    travelDate: row.travelDate
                };
            }
        });

        const result = await syncToCloud(data, month, type);

        if (!isAuto) {
            if (result.success) {
                setStatus({ message: `✅ Saved: ${new Date().toLocaleTimeString()}`, type: 'success' });
            } else {
                setStatus({ message: '❌ Sync Failed', type: 'error' });
            }
        }

        return result;
    }, [rows, month, type]);

    // Load from cloud
    const loadFromCloudData = useCallback(async() => {
        setStatus({ message: '📂 Loading...', type: 'loading' });
        setLoading(true);

        const result = await loadFromCloud(month, type);

        if (result.success && result.data && result.data.length > 0) {
            const loadedRows = result.data.map((r, index) => {
                if (type === 'main') {
                    return {
                        id: Date.now() + index,
                        date: formatDateForInput(r.date) || getTodayDate(),
                        particular: r.particular || '',
                        cashIn: r.cashIn || 0,
                        cashOut: r.cashOut || 0,
                        remark: r.remark || ''
                    };
                } else {
                    return {
                        id: Date.now() + index,
                        name: r.name || '',
                        address: r.address || '',
                        date: formatDateForInput(r.date) || '',
                        roadCarrier: r.roadCarrier || r.carrier || '',
                        receivedBy: r.receivedBy || '',
                        billAmount: r.billAmount || r.bill || 0,
                        receive: r.receive || 0,
                        travelDate: r.travelDate || ''
                    };
                }
            });
            setRows(loadedRows);
            setStatus({ message: `✅ Loaded ${loadedRows.length} records`, type: 'success' });
        } else {
            setRows([]);
            setStatus({ message: 'ℹ️ No data found for selected month', type: 'success' });
        }

        setLoading(false);
    }, [month, type]);

    // Auto-load data when month changes
    useEffect(() => {
        loadFromCloudData();
    }, [month, loadFromCloudData]);

    // Track dirty state on rows change - with failsafe timeout
    useEffect(() => {
        if (rows.length > 0 && !loading) {
            setIsDirty(true);
            const saveTimeout = setTimeout(() => {
                saveToCloud(true);
            }, 1000);
            const dirtyTimeout = setTimeout(() => {
                setIsDirty(false);
            }, 3000); // Failsafe: clear dirty after 3s even if save fails
            return () => {
                clearTimeout(saveTimeout);
                clearTimeout(dirtyTimeout);
            };
        }
    }, [rows, saveToCloud, loading]);

    // Calculate totals when rows change
    useEffect(() => {
        calculateTotals();
    }, [rows, calculateTotals]);

    // Initialize with empty row if no rows (only once)
    useEffect(() => {
        if (!isInitialized.current && !loading) {
            isInitialized.current = true;
            loadFromCloudData();
        }
    }, []); // Initial load only once

    return {
        rows,
        setRows,
        totals,
        month,
        setMonth,
        status,
        loading,
        isDirty,
        addRow,
        removeRow,
        updateRow,
        saveToCloud,
        loadFromCloudData,
        calculateTotals
    };
}