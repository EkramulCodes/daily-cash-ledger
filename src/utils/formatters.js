// Utility functions for formatting

// Parse dd/mm/yyyy display format back to YYYY-MM-DD for storage
export function parseDateFromDisplay(dateStr) {
    if (!dateStr || dateStr === '') return '';

    // Handle both dd/mm/yyyy and dd/mm/yy
    const parts = dateStr.match(/(\d{1,2})[\/-](\d{1,2})[\/-](\d{2,4})/);
    if (!parts) return '';

    const day = parseInt(parts[1], 10);
    const month = parseInt(parts[2], 10) - 1; // JS months are 0-indexed
    let year = parseInt(parts[3], 10);

    if (year < 100) year += 2000; // Assume 20xx for 2-digit years

    const date = new Date(year, month, day);
    if (isNaN(date.getTime()) || date.getDate() !== day || date.getMonth() !== month) {
        return '';
    }

    return date.toISOString().split('T')[0];
}

// Format date for input fields - prevents "one day off" time zone bug
export function formatDateForInput(dateVal) {
    if (!dateVal) return "";

    let d = new Date(dateVal);
    if (isNaN(d.getTime())) return "";

    // Adjust for time zone offset to ensure the date stays on the correct day
    const offset = d.getTimezoneOffset();
    d = new Date(d.getTime() - (offset * 60 * 1000));
    return d.toISOString().split('T')[0];
}

// Format date to dd/mm/yy for display
export function formatDateDisplay(dateVal) {
    if (!dateVal) return "";
    if (dateVal === '') return "";

    const d = new Date(dateVal);
    if (isNaN(d.getTime()) || d.getFullYear() < 1900 || d.getFullYear() > 2100) return "";

    const day = d.getDate().toString().padStart(2, '0');
    const month = (d.getMonth() + 1).toString().padStart(2, '0');
    const year = d.getFullYear();

    return `${day}/${month}/${year}`;
}

// Get today's date in YYYY-MM-DD format
export function getTodayDate() {
    return new Date().toISOString().split('T')[0];
}

// Format number as Bangladeshi Taka
export function formatCurrency(amount) {
    return '৳' + (parseFloat(amount) || 0).toLocaleString();
}

// Generate random serial number
export function generateSerial() {
    return "EI-" + Math.floor(100000 + Math.random() * 900000);
}

// Get current month in YYYY-MM format
export function getCurrentMonth() {
    return new Date().toISOString().slice(0, 7);
}