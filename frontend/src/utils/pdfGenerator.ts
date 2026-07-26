import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

export interface PDFReportData {
  title: string;
  district?: string;
  station?: string;
  riskLevel?: string;
  summary: string;
  aiFindings?: string[];
  recommendations?: string[];
  tables?: { head: string[][]; body: any[][] }[];
  officerNotes?: string;
}

export const generateEnterprisePDF = (data: PDFReportData, filename: string = 'Intelligence_Report.pdf') => {
  const doc = new jsPDF();
  const pageWidth = doc.internal.pageSize.width;
  let currentY = 20;

  // Configuration
  const primaryColor: [number, number, number] = [30, 58, 138]; // Deep blue
  const accentColor: [number, number, number] = [239, 68, 68]; // Red for risk

  // --- HEADER ---
  doc.setFont("helvetica", "bold");
  doc.setFontSize(16);
  doc.setTextColor(primaryColor[0], primaryColor[1], primaryColor[2]);
  doc.text("Government of Karnataka", pageWidth / 2, currentY, { align: 'center' });
  currentY += 8;
  
  doc.setFontSize(14);
  doc.text("Karnataka State Police | State Crime Records Bureau", pageWidth / 2, currentY, { align: 'center' });
  currentY += 6;
  
  doc.setFontSize(10);
  doc.setFont("helvetica", "normal");
  doc.setTextColor(100, 100, 100);
  doc.text("AI-Driven Crime Analytics & Visualization Platform", pageWidth / 2, currentY, { align: 'center' });
  currentY += 15;

  // Divider Line
  doc.setDrawColor(200, 200, 200);
  doc.line(14, currentY, pageWidth - 14, currentY);
  currentY += 10;

  // --- REPORT METADATA ---
  doc.setFont("helvetica", "bold");
  doc.setFontSize(18);
  doc.setTextColor(0, 0, 0);
  doc.text(data.title.toUpperCase(), 14, currentY);
  currentY += 8;

  doc.setFontSize(10);
  doc.setFont("helvetica", "normal");
  doc.setTextColor(50, 50, 50);
  doc.text(`Generated: ${new Date().toLocaleString()}`, 14, currentY);
  currentY += 10;

  // Context Block
  if (data.district || data.station || data.riskLevel) {
    doc.setFillColor(245, 245, 245);
    doc.rect(14, currentY, pageWidth - 28, 25, 'F');
    
    doc.setFontSize(10);
    doc.setFont("helvetica", "bold");
    let ctxY = currentY + 8;
    
    if (data.district) {
       doc.text(`District: ${data.district}`, 20, ctxY);
    }
    if (data.station) {
       doc.text(`Police Station: ${data.station}`, 20, ctxY + 8);
    }
    if (data.riskLevel) {
       doc.setTextColor(accentColor[0], accentColor[1], accentColor[2]);
       doc.text(`Risk Level: ${data.riskLevel}`, pageWidth - 60, ctxY);
       doc.setTextColor(0, 0, 0);
    }
    currentY += 35;
  }

  // Helper function to handle page breaks
  const checkPageBreak = (neededSpace: number) => {
    if (currentY + neededSpace > doc.internal.pageSize.height - 20) {
      doc.addPage();
      currentY = 20;
    }
  };

  // --- SUMMARY ---
  if (data.summary) {
    checkPageBreak(30);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(12);
    doc.text("EXECUTIVE SUMMARY", 14, currentY);
    currentY += 6;
    
    doc.setFont("helvetica", "normal");
    doc.setFontSize(10);
    const splitSummary = doc.splitTextToSize(data.summary, pageWidth - 28);
    doc.text(splitSummary, 14, currentY);
    currentY += (splitSummary.length * 5) + 10;
  }

  // --- AI FINDINGS ---
  if (data.aiFindings && data.aiFindings.length > 0) {
    checkPageBreak(30);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(12);
    doc.setTextColor(primaryColor[0], primaryColor[1], primaryColor[2]);
    doc.text("AI INTELLIGENCE FINDINGS", 14, currentY);
    currentY += 6;
    
    doc.setFont("helvetica", "normal");
    doc.setFontSize(10);
    doc.setTextColor(0, 0, 0);
    
    data.aiFindings.forEach(finding => {
      checkPageBreak(15);
      const bullet = `• `;
      const splitFinding = doc.splitTextToSize(finding, pageWidth - 35);
      doc.text(bullet, 14, currentY);
      doc.text(splitFinding, 20, currentY);
      currentY += (splitFinding.length * 5) + 3;
    });
    currentY += 5;
  }

  // --- TABLES ---
  if (data.tables && data.tables.length > 0) {
    data.tables.forEach((table, idx) => {
      autoTable(doc, {
        startY: currentY,
        head: table.head,
        body: table.body,
        theme: 'grid',
        headStyles: { fillColor: primaryColor, textColor: [255, 255, 255] },
        styles: { fontSize: 9, cellPadding: 4 },
        margin: { left: 14, right: 14 }
      });
      currentY = (doc as any).lastAutoTable.finalY + 15;
    });
  }

  // --- RECOMMENDATIONS ---
  if (data.recommendations && data.recommendations.length > 0) {
    checkPageBreak(30);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(12);
    doc.setTextColor(16, 185, 129); // Emerald Green
    doc.text("TACTICAL RECOMMENDATIONS", 14, currentY);
    currentY += 6;
    
    doc.setFont("helvetica", "normal");
    doc.setFontSize(10);
    doc.setTextColor(0, 0, 0);
    
    data.recommendations.forEach((rec, idx) => {
      checkPageBreak(15);
      const bullet = `${idx + 1}. `;
      const splitRec = doc.splitTextToSize(rec, pageWidth - 35);
      doc.text(bullet, 14, currentY);
      doc.text(splitRec, 20, currentY);
      currentY += (splitRec.length * 5) + 3;
    });
    currentY += 5;
  }

  // --- OFFICER NOTES ---
  if (data.officerNotes) {
    checkPageBreak(40);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(12);
    doc.text("OFFICER NOTES", 14, currentY);
    currentY += 6;
    
    doc.setFont("helvetica", "normal");
    doc.setFontSize(10);
    const splitNotes = doc.splitTextToSize(data.officerNotes, pageWidth - 28);
    doc.text(splitNotes, 14, currentY);
  }

  // --- FOOTER & PAGINATION ---
  const pageCount = (doc.internal as any).getNumberOfPages();
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i);
    doc.setFontSize(8);
    doc.setTextColor(150, 150, 150);
    doc.text(
      `CONFIDENTIAL - For Official Police Use Only | Page ${i} of ${pageCount}`,
      pageWidth / 2,
      doc.internal.pageSize.height - 10,
      { align: 'center' }
    );
  }

  doc.save(filename);
};
