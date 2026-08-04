import * as XLSX from 'xlsx';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

interface ExportPDFOptions {
  title: string;
  companyName?: string;
  dateRange?: string;
  columns: { header: string; dataKey: string }[];
  data: Record<string, any>[];
  summaryItems?: { label: string; value: string | number }[];
  fileName?: string;
}

export const exportToExcel = (data: Record<string, any>[], fileName = 'report.xlsx') => {
  const worksheet = XLSX.utils.json_to_sheet(data);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, 'Report');
  XLSX.writeFile(workbook, fileName);
};

export const exportToCSV = (data: Record<string, any>[], fileName = 'report.csv') => {
  if (data.length === 0) return;
  const headers = Object.keys(data[0]);
  const csvRows = [
    headers.join(','),
    ...data.map(row =>
      headers
        .map(h => {
          const val = row[h] ?? '';
          const escaped = String(val).replace(/"/g, '""');
          return `"${escaped}"`;
        })
        .join(',')
    ),
  ];
  const blob = new Blob([csvRows.join('\n')], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', fileName);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

export const printDataReport = (title: string, columns: string[], rows: (string | number)[][]) => {
  const printWindow = window.open('', '_blank');
  if (!printWindow) return;

  const htmlContent = `
    <!DOCTYPE html>
    <html>
      <head>
        <title>${title}</title>
        <style>
          body { font-family: 'Segoe UI', Arial, sans-serif; padding: 24px; color: #1E293B; }
          .header { border-bottom: 2px solid #059669; padding-bottom: 12px; margin-bottom: 24px; display: flex; justify-content: space-between; align-items: center; }
          .header h1 { margin: 0; color: #059669; font-size: 24px; }
          .header p { margin: 4px 0 0 0; color: #64748B; font-size: 13px; }
          table { width: 100%; border-collapse: collapse; margin-top: 16px; font-size: 12px; }
          th { background-color: #059669; color: white; text-align: left; padding: 10px 12px; font-weight: 600; }
          td { border-bottom: 1px solid #E2E8F0; padding: 10px 12px; }
          tr:nth-child(even) { background-color: #F8FAFC; }
          .footer { margin-top: 32px; font-size: 11px; color: #94A3B8; text-align: center; border-top: 1px solid #E2E8F0; padding-top: 12px; }
        </style>
      </head>
      <body>
        <div class="header">
          <div>
            <h1>${title}</h1>
            <p>Generated on ${new Date().toLocaleString()} | Enterprise Attendance HRMS</p>
          </div>
        </div>
        <table>
          <thead>
            <tr>${columns.map(c => `<th>${c}</th>`).join('')}</tr>
          </thead>
          <tbody>
            ${rows.map(r => `<tr>${r.map(val => `<td>${val ?? '-'}</td>`).join('')}</tr>`).join('')}
          </tbody>
        </table>
        <div class="footer">
          Confidential - Internal HR Management Report • Page 1
        </div>
        <script>
          window.onload = function() { window.print(); window.close(); };
        </script>
      </body>
    </html>
  `;
  printWindow.document.write(htmlContent);
  printWindow.document.close();
};

export const exportToPDF = ({
  title,
  companyName = 'Apex Technology Systems',
  dateRange,
  columns,
  data,
  summaryItems = [],
  fileName = 'enterprise_report.pdf',
}: ExportPDFOptions) => {
  const doc = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });

  // Color Palette
  const primaryColor = [5, 150, 105]; // Emerald Green
  const textColor = [30, 41, 59];     // Slate 800
  const subtextColor = [100, 116, 139]; // Slate 500

  // Title & Header Banner
  doc.setFillColor(primaryColor[0], primaryColor[1], primaryColor[2]);
  doc.rect(0, 0, 210, 28, 'F');

  doc.setTextColor(255, 255, 255);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(16);
  doc.text(companyName.toUpperCase(), 14, 12);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(10);
  doc.text(`REPORT: ${title}`, 14, 20);

  doc.setFontSize(8);
  doc.text(`Generated: ${new Date().toLocaleDateString()}`, 196, 20, { align: 'right' });

  let startY = 36;

  // Optional Summary Box
  if (summaryItems.length > 0) {
    doc.setFillColor(248, 250, 252);
    doc.roundedRect(14, startY, 182, 18, 3, 3, 'F');
    doc.setDrawColor(226, 232, 240);
    doc.roundedRect(14, startY, 182, 18, 3, 3, 'D');

    let xPos = 20;
    summaryItems.slice(0, 4).forEach(item => {
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(9);
      doc.setTextColor(primaryColor[0], primaryColor[1], primaryColor[2]);
      doc.text(String(item.value), xPos, startY + 8);

      doc.setFont('helvetica', 'normal');
      doc.setFontSize(8);
      doc.setTextColor(subtextColor[0], subtextColor[1], subtextColor[2]);
      doc.text(item.label, xPos, startY + 14);

      xPos += 45;
    });

    startY += 26;
  }

  if (dateRange) {
    doc.setFont('helvetica', 'italic');
    doc.setFontSize(9);
    doc.setTextColor(textColor[0], textColor[1], textColor[2]);
    doc.text(`Period / Range: ${dateRange}`, 14, startY);
    startY += 6;
  }

  // Format table rows
  const tableRows = data.map(row => columns.map(col => row[col.dataKey] ?? '-'));
  const tableHeaders = columns.map(col => col.header);

  autoTable(doc, {
    startY,
    head: [tableHeaders],
    body: tableRows,
    theme: 'grid',
    headStyles: {
      fillColor: [5, 150, 105],
      textColor: [255, 255, 255],
      fontStyle: 'bold',
      fontSize: 9,
    },
    styles: {
      fontSize: 8,
      cellPadding: 3,
      textColor: [30, 41, 59],
    },
    alternateRowStyles: {
      fillColor: [248, 250, 252],
    },
    didDrawPage: (dataPage) => {
      // Footer
      const str = `Page ${dataPage.pageNumber}`;
      doc.setFontSize(8);
      doc.setTextColor(148, 163, 184);
      doc.text(str, 196, 285, { align: 'right' });
      doc.text('Enterprise HRMS Portal • Confidential Attendance Record', 14, 285);
    },
  });

  doc.save(fileName);
};
