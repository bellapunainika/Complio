import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { GSTSummaryData, GSTRecord, UserProfile } from '../types';

// Helper to format currency
export const formatINR = (val: number): string => {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0
  }).format(val);
};

// 1. Generate GST Summary Preparation PDF
export const exportGSTSummaryPDF = (
  summary: GSTSummaryData,
  profile: UserProfile,
  records: GSTRecord[],
  reportingPeriod = 'November 2026'
): jsPDF => {
  const doc = new jsPDF();

  // Primary brand header
  doc.setFillColor(8, 9, 13);
  doc.rect(0, 0, 210, 36, 'F');

  // Title
  doc.setTextColor(148, 102, 255);
  doc.setFontSize(18);
  doc.setFont('helvetica', 'bold');
  doc.text('COMPLIO', 14, 16);

  doc.setTextColor(244, 243, 250);
  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  doc.text('GST Preparation & Statutory Reconciliation Report', 14, 24);

  doc.setFontSize(8);
  doc.setTextColor(146, 149, 165);
  doc.text(`Generated: ${new Date().toLocaleDateString('en-IN')} | Decision-Support Model`, 14, 30);

  // Status Badge on right
  doc.setFillColor(18, 21, 29);
  doc.roundedRect(140, 10, 56, 18, 2, 2, 'F');
  doc.setTextColor(52, 211, 153);
  doc.setFontSize(9);
  doc.setFont('helvetica', 'bold');
  doc.text('PREPARED FOR CA REVIEW', 144, 18);
  doc.setTextColor(182, 154, 255);
  doc.setFontSize(8);
  doc.text(`Period: ${reportingPeriod}`, 144, 24);

  // Business Profile Info Box
  let y = 44;
  doc.setTextColor(30, 30, 40);
  doc.setFontSize(9);
  doc.setFont('helvetica', 'bold');
  doc.text('ENTITY IDENTIFICATION DETAILS', 14, y);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8);
  doc.setTextColor(70, 70, 80);
  y += 6;
  doc.text(`Business Name: ${profile.businessName}`, 14, y);
  doc.text(`Entity Type: ${profile.businessType}`, 110, y);
  y += 5;
  doc.text(`Supplier GSTIN: ${profile.gstin || '36AAACN1234F1Z8'}`, 14, y);
  doc.text(`Jurisdiction: ${profile.locationState} Commercial Taxes`, 110, y);
  y += 5;
  doc.text(`Total Records Processed: ${summary.totalRecords} (Valid: ${summary.validCount}, Errors: ${summary.errorCount}, Warnings: ${summary.warningCount})`, 14, y);

  // Summary Metrics Table
  y += 6;
  autoTable(doc, {
    startY: y,
    head: [['Tax Metric', 'B2B Invoices', 'Credit Notes (Adjustment)', 'Net Taxable / Liability']],
    body: [
      ['Gross Taxable Value', formatINR(summary.totalTaxableValue + summary.netAdjustments), `- ${formatINR(summary.netAdjustments)}`, formatINR(summary.totalTaxableValue)],
      ['Central GST (CGST)', formatINR(summary.totalCGST + (summary.netAdjustments * 0.09)), `Reflected in net`, formatINR(summary.totalCGST)],
      ['State GST (SGST)', formatINR(summary.totalSGST + (summary.netAdjustments * 0.09)), `Reflected in net`, formatINR(summary.totalSGST)],
      ['Integrated GST (IGST)', formatINR(summary.totalIGST), `Reflected in net`, formatINR(summary.totalIGST)],
      ['TOTAL TAX LIABILITY', '', '', formatINR(summary.totalTax)]
    ],
    theme: 'grid',
    headStyles: { fillColor: [148, 102, 255], textColor: [255, 255, 255], fontStyle: 'bold' },
    styles: { fontSize: 8, cellPadding: 3 },
    footStyles: { fontStyle: 'bold', fillColor: [240, 240, 245] }
  });

  // Rate-wise Summary
  const currentY = (doc as any).lastAutoTable.finalY + 8;
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9);
  doc.setTextColor(30, 30, 40);
  doc.text('TAX RATE-WISE AGGREGATION', 14, currentY);

  const rateRows = summary.rateWise.map(r => [
    `${r.rate}%`,
    r.recordCount.toString(),
    formatINR(r.taxable),
    formatINR(r.cgst),
    formatINR(r.sgst),
    formatINR(r.igst),
    formatINR(r.totalTax)
  ]);

  autoTable(doc, {
    startY: currentY + 3,
    head: [['Rate', 'Docs', 'Net Taxable', 'CGST', 'SGST', 'IGST', 'Total Tax']],
    body: rateRows,
    theme: 'striped',
    headStyles: { fillColor: [108, 143, 255], textColor: [255, 255, 255] },
    styles: { fontSize: 7.5, cellPadding: 2.5 }
  });

  // Top Invoices & Credit Notes
  const invoicesY = (doc as any).lastAutoTable.finalY + 8;
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9);
  doc.setTextColor(30, 30, 40);
  doc.text('EXTRACTED DOCUMENT REGISTER (SAMPLE AUDIT TRAIL)', 14, invoicesY);

  const invoiceRows = records.slice(0, 10).map(rec => [
    rec.invoiceNumber,
    rec.invoiceDate,
    rec.docType,
    rec.recipientGSTIN || 'MISSING',
    rec.placeOfSupply,
    formatINR(rec.taxableValue),
    `${rec.gstRate}%`,
    formatINR(rec.cgst + rec.sgst + rec.igst),
    rec.validationStatus.toUpperCase()
  ]);

  autoTable(doc, {
    startY: invoicesY + 3,
    head: [['Doc No', 'Date', 'Type', 'Recipient GSTIN', 'POS', 'Taxable', 'Rate', 'Tax', 'Status']],
    body: invoiceRows,
    theme: 'plain',
    headStyles: { fillColor: [40, 44, 56], textColor: [255, 255, 255] },
    styles: { fontSize: 7, cellPadding: 2 }
  });

  // Statutory Disclaimer on footer
  const pageHeight = doc.internal.pageSize.height;
  doc.setFontSize(6.5);
  doc.setFont('helvetica', 'italic');
  doc.setTextColor(120, 120, 130);
  doc.text(
    'IMPORTANT DISCLAIMER: This document is a local decision-support preparation summary prepared by COMPLIO. It does not constitute statutory filing confirmation. Verify all figures with your practicing Chartered Accountant prior to uploading to the GST portal.',
    14,
    pageHeight - 10,
    { maxWidth: 182 }
  );

  return doc;
};

// 2. Generate Professional Tax Invoice PDF
export const exportInvoicePDF = (
  invoiceData: {
    invoiceNumber: string;
    invoiceDate: string;
    placeOfSupply: string;
    customerName: string;
    customerGSTIN: string;
    customerAddress: string;
    customerState: string;
    items: {
      description: string;
      hsnSac: string;
      quantity: number;
      unitPrice: number;
      gstRate: number;
      taxableValue: number;
      cgst: number;
      sgst: number;
      igst: number;
      total: number;
    }[];
  },
  profile: UserProfile
): jsPDF => {
  const doc = new jsPDF();

  // Header Banner
  doc.setFillColor(8, 9, 13);
  doc.rect(0, 0, 210, 32, 'F');

  doc.setTextColor(148, 102, 255);
  doc.setFontSize(16);
  doc.setFont('helvetica', 'bold');
  doc.text('TAX INVOICE', 14, 16);

  doc.setTextColor(244, 243, 250);
  doc.setFontSize(9);
  doc.setFont('helvetica', 'normal');
  doc.text('Original for Recipient (Section 31 CGST Act 2017)', 14, 23);

  // Invoice Details top right
  doc.setFontSize(8);
  doc.setTextColor(182, 154, 255);
  doc.text(`Invoice No: ${invoiceData.invoiceNumber}`, 140, 14);
  doc.text(`Invoice Date: ${invoiceData.invoiceDate}`, 140, 20);
  doc.text(`Place of Supply: ${invoiceData.placeOfSupply}`, 140, 26);

  // Two columns: Seller & Buyer
  let y = 40;
  // Seller
  doc.setFontSize(9);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(30, 30, 40);
  doc.text('SUPPLIER (ISSUED BY):', 14, y);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8);
  doc.setTextColor(60, 60, 70);
  y += 5;
  doc.text(profile.businessName, 14, y);
  y += 4;
  doc.text(`GSTIN: ${profile.gstin || '36AAACN1234F1Z8'}`, 14, y);
  y += 4;
  doc.text(`State: ${profile.locationState}`, 14, y);

  // Buyer
  let yBuyer = 40;
  doc.setFontSize(9);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(30, 30, 40);
  doc.text('BILLED TO (RECIPIENT):', 110, yBuyer);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8);
  doc.setTextColor(60, 60, 70);
  yBuyer += 5;
  doc.text(invoiceData.customerName, 110, yBuyer);
  yBuyer += 4;
  doc.text(`GSTIN: ${invoiceData.customerGSTIN || 'Unregistered B2C / Exempt'}`, 110, yBuyer);
  yBuyer += 4;
  doc.text(`Address: ${invoiceData.customerAddress || 'Commercial Office'}`, 110, yBuyer);
  yBuyer += 4;
  doc.text(`State: ${invoiceData.customerState}`, 110, yBuyer);

  // Line Items Table
  const tableY = Math.max(y, yBuyer) + 8;
  const itemRows = invoiceData.items.map((it, idx) => [
    (idx + 1).toString(),
    it.description,
    it.hsnSac || '998313',
    it.quantity.toString(),
    formatINR(it.unitPrice),
    formatINR(it.taxableValue),
    `${it.gstRate}%`,
    formatINR(it.cgst + it.sgst + it.igst),
    formatINR(it.total)
  ]);

  const totalTaxable = invoiceData.items.reduce((s, i) => s + i.taxableValue, 0);
  const totalTax = invoiceData.items.reduce((s, i) => s + (i.cgst + i.sgst + i.igst), 0);
  const grandTotal = invoiceData.items.reduce((s, i) => s + i.total, 0);

  autoTable(doc, {
    startY: tableY,
    head: [['#', 'Description of Goods/Services', 'HSN/SAC', 'Qty', 'Rate', 'Taxable', 'GST%', 'Tax', 'Total']],
    body: itemRows,
    theme: 'grid',
    headStyles: { fillColor: [148, 102, 255], textColor: [255, 255, 255], fontSize: 8 },
    styles: { fontSize: 7.5, cellPadding: 2.5 }
  });

  // Totals Box
  const totalsY = (doc as any).lastAutoTable.finalY + 6;
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8);
  doc.setTextColor(50, 50, 60);

  doc.text(`Total Taxable Amount:`, 120, totalsY);
  doc.text(formatINR(totalTaxable), 170, totalsY);

  doc.text(`Total Tax (CGST+SGST/IGST):`, 120, totalsY + 6);
  doc.text(formatINR(totalTax), 170, totalsY + 6);

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(10);
  doc.setTextColor(20, 20, 30);
  doc.text(`Invoice Grand Total:`, 120, totalsY + 14);
  doc.text(formatINR(grandTotal), 170, totalsY + 14);

  // Bank & Signatory
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7.5);
  doc.setTextColor(80, 80, 90);
  doc.text('Payment Terms: Net 15 Days | Electronic Transfer', 14, totalsY + 6);
  doc.text(`For ${profile.businessName}:`, 140, totalsY + 28);
  doc.setFont('helvetica', 'italic');
  doc.text('[ Authorized Signatory ]', 140, totalsY + 38);

  return doc;
};

// 3. Generate Legal Draft Agreement PDF
export const exportAgreementPDF = (
  agreementType: string,
  parties: { party1: string; party2: string; jurisdiction: string; duration: string },
  contentBody: string,
  _profile: UserProfile
): jsPDF => {
  const doc = new jsPDF();

  // Header Title
  doc.setFillColor(14, 16, 22);
  doc.rect(0, 0, 210, 28, 'F');

  doc.setTextColor(148, 102, 255);
  doc.setFontSize(14);
  doc.setFont('helvetica', 'bold');
  doc.text(agreementType.toUpperCase(), 14, 14);

  doc.setTextColor(220, 220, 230);
  doc.setFontSize(8);
  doc.setFont('helvetica', 'normal');
  doc.text('CONFIDENTIAL DRAFT FOR LEGAL REVIEW AND EXECUTION', 14, 21);

  // Parties Box
  let y = 36;
  doc.setFillColor(245, 245, 250);
  doc.roundedRect(14, y, 182, 22, 2, 2, 'F');
  doc.setFontSize(8);
  doc.setTextColor(50, 50, 60);
  doc.text(`FIRST PARTY (DISCLOSING PARTY): ${parties.party1}`, 18, y + 6);
  doc.text(`SECOND PARTY (RECEIVING PARTY): ${parties.party2}`, 18, y + 12);
  doc.text(`GOVERNING LAW & JURISDICTION: ${parties.jurisdiction} | TERM: ${parties.duration}`, 18, y + 18);

  // Content Clauses
  y += 28;
  doc.setFontSize(8.5);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(40, 40, 45);

  const splitText = doc.splitTextToSize(contentBody, 182);
  doc.text(splitText, 14, y);

  // Signature Block at bottom
  const pageHeight = doc.internal.pageSize.height;
  const sigY = pageHeight - 35;
  doc.line(14, sigY, 85, sigY);
  doc.line(115, sigY, 186, sigY);

  doc.setFontSize(7.5);
  doc.text(`Signed for: ${parties.party1}`, 14, sigY + 5);
  doc.text(`Name: ______________________`, 14, sigY + 11);
  doc.text(`Date: ______________________`, 14, sigY + 17);

  doc.text(`Signed for: ${parties.party2}`, 115, sigY + 5);
  doc.text(`Name: ______________________`, 115, sigY + 11);
  doc.text(`Date: ______________________`, 115, sigY + 17);

  // Draft disclaimer
  doc.setFontSize(6.5);
  doc.setFont('helvetica', 'italic');
  doc.setTextColor(150, 150, 160);
  doc.text(
    'LEGAL NOTICE: This agreement template is generated by COMPLIO for review purposes only. Consult qualified legal counsel before signing.',
    14,
    pageHeight - 6
  );

  return doc;
};

// 4. Structured GST JSON Export (Accurately Labeled)
export const exportStructuredGSTJSON = (records: GSTRecord[], profile: UserProfile): string => {
  const payload = {
    exportMetadata: {
      generator: 'COMPLIO Business Automation Platform',
      version: '1.0-demo',
      generatedAt: new Date().toISOString(),
      disclaimer: 'Demo structured GST export – not validated for direct GST portal upload. For professional review and ERP integration.',
      supplierDetails: {
        legalName: profile.businessName,
        gstin: profile.gstin || '36AAACN1234F1Z8',
        state: profile.locationState
      }
    },
    b2bInvoices: records.filter(r => r.docType === 'B2B Invoice').map(r => ({
      invoiceNumber: r.invoiceNumber,
      invoiceDate: r.invoiceDate,
      recipientGSTIN: r.recipientGSTIN,
      recipientTradeName: r.recipientName,
      placeOfSupply: r.placeOfSupply,
      taxableValue: r.taxableValue,
      gstRate: r.gstRate,
      cgst: r.cgst,
      sgst: r.sgst,
      igst: r.igst,
      totalInvoiceValue: r.totalAmount,
      validation: {
        status: r.validationStatus,
        issues: r.validationIssues
      }
    })),
    creditNotes: records.filter(r => r.docType === 'Credit Note').map(r => ({
      noteNumber: r.invoiceNumber,
      noteDate: r.invoiceDate,
      originalInvoiceRef: r.originalInvoiceRef,
      recipientGSTIN: r.recipientGSTIN,
      placeOfSupply: r.placeOfSupply,
      taxableAdjustment: r.taxableValue,
      gstRate: r.gstRate,
      cgst: r.cgst,
      sgst: r.sgst,
      igst: r.igst,
      validation: {
        status: r.validationStatus,
        issues: r.validationIssues
      }
    }))
  };

  return JSON.stringify(payload, null, 2);
};

// 5. CSV Exporter for detailed invoice register
export const exportRecordsToCSV = (records: GSTRecord[]): string => {
  const headers = [
    'Document Type',
    'Document Number',
    'Document Date',
    'Supplier GSTIN',
    'Recipient GSTIN',
    'Recipient Name',
    'Place of Supply',
    'Taxable Value (INR)',
    'GST Rate (%)',
    'CGST (INR)',
    'SGST (INR)',
    'IGST (INR)',
    'Total Amount (INR)',
    'Original Ref (Credit Note)',
    'Validation Status',
    'Validation Issues'
  ];

  const rows = records.map(r => [
    `"${r.docType}"`,
    `"${r.invoiceNumber}"`,
    `"${r.invoiceDate}"`,
    `"${r.supplierGSTIN}"`,
    `"${r.recipientGSTIN}"`,
    `"${r.recipientName}"`,
    `"${r.placeOfSupply}"`,
    r.taxableValue,
    r.gstRate,
    r.cgst,
    r.sgst,
    r.igst,
    r.totalAmount,
    `"${r.originalInvoiceRef || ''}"`,
    `"${r.validationStatus}"`,
    `"${r.validationIssues.join('; ')}"`
  ]);

  return [headers.join(','), ...rows.map(row => row.join(','))].join('\n');
};

// Helper trigger download
export const downloadFile = (content: string, filename: string, mimeType: string) => {
  const blob = new Blob([content], { type: mimeType });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
};

