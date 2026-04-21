// Excel export utilities

export function downloadExcel(tableId, filename = 'EME_AIR_Ledger') {
    const table = document.getElementById(tableId);
    if (!table) return;

    let csv = [];
    const rows = table.querySelectorAll("tr");

    for (let i = 0; i < rows.length; i++) {
        if (rows[i].style.display !== 'none') {
            let row = [],
                cols = rows[i].querySelectorAll("td, th");
            for (let j = 0; j < cols.length; j++) {
                // Skip actions column
                if (cols[j].classList.contains('no-print')) continue;

                let data = "";
                const input = cols[j].querySelector("input");
                data = input ? input.value : cols[j].innerText.replace(/৳|,/g, "");
                row.push('"' + data.toString().replace(/"/g, '""') + '"');
            }
            csv.push(row.join(","));
        }
    }

    const csvFile = new Blob([csv.join("\n")], { type: "text/csv" });
    const downloadLink = document.createElement("a");
    const date = new Date().toISOString().split('T')[0];
    downloadLink.download = `${filename}_${date}.csv`;
    downloadLink.href = window.URL.createObjectURL(csvFile);
    downloadLink.click();
}