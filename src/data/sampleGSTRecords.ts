import { GSTRecord, GSTSummaryData } from '../types';

export const SAMPLE_SUPPLIER_GSTIN = '36AAACN1234F1Z8'; // NovaTech Solutions Pvt Ltd (Telangana)

export const RAW_SAMPLE_GST_RECORDS: Omit<GSTRecord, 'validationStatus' | 'validationIssues'>[] = [
  // 1. Intra-state B2B 18%
  {
    id: 'gst-rec-1',
    docType: 'B2B Invoice',
    invoiceNumber: 'INV-2026-001',
    invoiceDate: '2026-11-02',
    supplierGSTIN: SAMPLE_SUPPLIER_GSTIN,
    recipientGSTIN: '36AABCT2345A1Z5',
    recipientName: 'Telangana CloudWorks Infotech',
    placeOfSupply: '36-Telangana',
    taxableValue: 150000,
    gstRate: 18,
    cgst: 13500,
    sgst: 13500,
    igst: 0,
    totalAmount: 177000
  },
  // 2. Inter-state B2B 18% (Karnataka)
  {
    id: 'gst-rec-2',
    docType: 'B2B Invoice',
    invoiceNumber: 'INV-2026-002',
    invoiceDate: '2026-11-03',
    supplierGSTIN: SAMPLE_SUPPLIER_GSTIN,
    recipientGSTIN: '29AABCB3456C1Z9',
    recipientName: 'Bengaluru AI Robotics Pvt Ltd',
    placeOfSupply: '29-Karnataka',
    taxableValue: 280000,
    gstRate: 18,
    cgst: 0,
    sgst: 0,
    igst: 50400,
    totalAmount: 330400
  },
  // 3. Intra-state B2B 12%
  {
    id: 'gst-rec-3',
    docType: 'B2B Invoice',
    invoiceNumber: 'INV-2026-003',
    invoiceDate: '2026-11-05',
    supplierGSTIN: SAMPLE_SUPPLIER_GSTIN,
    recipientGSTIN: '36AAACE4567D1Z2',
    recipientName: 'Hyderabad Hardware Solutions',
    placeOfSupply: '36-Telangana',
    taxableValue: 75000,
    gstRate: 12,
    cgst: 4500,
    sgst: 4500,
    igst: 0,
    totalAmount: 84000
  },
  // 4. DUPLICATE INVOICE NUMBER #1 (Testing Duplicate Detection)
  {
    id: 'gst-rec-4a',
    docType: 'B2B Invoice',
    invoiceNumber: 'INV-2026-004',
    invoiceDate: '2026-11-06',
    supplierGSTIN: SAMPLE_SUPPLIER_GSTIN,
    recipientGSTIN: '27AABCD5678E1Z1',
    recipientName: 'Mumbai FinEdge Capital Advisors',
    placeOfSupply: '27-Maharashtra',
    taxableValue: 120000,
    gstRate: 18,
    cgst: 0,
    sgst: 0,
    igst: 21600,
    totalAmount: 141600
  },
  // 4b. DUPLICATE INVOICE NUMBER #2 (Intentionally duplicated)
  {
    id: 'gst-rec-4b',
    docType: 'B2B Invoice',
    invoiceNumber: 'INV-2026-004',
    invoiceDate: '2026-11-06',
    supplierGSTIN: SAMPLE_SUPPLIER_GSTIN,
    recipientGSTIN: '27AABCD5678E1Z1',
    recipientName: 'Mumbai FinEdge Capital Advisors',
    placeOfSupply: '27-Maharashtra',
    taxableValue: 120000,
    gstRate: 18,
    cgst: 0,
    sgst: 0,
    igst: 21600,
    totalAmount: 141600
  },
  // 5. MISSING RECIPIENT GSTIN (Demonstrating Error)
  {
    id: 'gst-rec-5',
    docType: 'B2B Invoice',
    invoiceNumber: 'INV-2026-005',
    invoiceDate: '2026-11-07',
    supplierGSTIN: SAMPLE_SUPPLIER_GSTIN,
    recipientGSTIN: '', // Intentionally missing
    recipientName: 'Unregistered Vendor Studio',
    placeOfSupply: '36-Telangana',
    taxableValue: 45000,
    gstRate: 18,
    cgst: 4050,
    sgst: 4050,
    igst: 0,
    totalAmount: 53100
  },
  // 6. Inter-state B2B 28% (Luxury IT gear)
  {
    id: 'gst-rec-6',
    docType: 'B2B Invoice',
    invoiceNumber: 'INV-2026-006',
    invoiceDate: '2026-11-08',
    supplierGSTIN: SAMPLE_SUPPLIER_GSTIN,
    recipientGSTIN: '07AAACA6789F1Z3',
    recipientName: 'Capital Ventures Delhi LLP',
    placeOfSupply: '07-Delhi',
    taxableValue: 350000,
    gstRate: 28,
    cgst: 0,
    sgst: 0,
    igst: 98000,
    totalAmount: 448000
  },
  // 7. Intra-state B2B 5%
  {
    id: 'gst-rec-7',
    docType: 'B2B Invoice',
    invoiceNumber: 'INV-2026-007',
    invoiceDate: '2026-11-09',
    supplierGSTIN: SAMPLE_SUPPLIER_GSTIN,
    recipientGSTIN: '36AAACB7890G1Z4',
    recipientName: 'Deccan Logistics & Courier Hub',
    placeOfSupply: '36-Telangana',
    taxableValue: 60000,
    gstRate: 5,
    cgst: 1500,
    sgst: 1500,
    igst: 0,
    totalAmount: 63000
  },
  // 8. Inter-state B2B 18% (Tamil Nadu)
  {
    id: 'gst-rec-8',
    docType: 'B2B Invoice',
    invoiceNumber: 'INV-2026-008',
    invoiceDate: '2026-11-10',
    supplierGSTIN: SAMPLE_SUPPLIER_GSTIN,
    recipientGSTIN: '33AABCC8901H1Z6',
    recipientName: 'Chennai Software Labs Private Limited',
    placeOfSupply: '33-Tamil Nadu',
    taxableValue: 420000,
    gstRate: 18,
    cgst: 0,
    sgst: 0,
    igst: 75600,
    totalAmount: 495600
  },
  // 9. Intra-state B2B 18%
  {
    id: 'gst-rec-9',
    docType: 'B2B Invoice',
    invoiceNumber: 'INV-2026-009',
    invoiceDate: '2026-11-11',
    supplierGSTIN: SAMPLE_SUPPLIER_GSTIN,
    recipientGSTIN: '36AABCD9012J1Z8',
    recipientName: 'Cyberabad BioTech Innovations',
    placeOfSupply: '36-Telangana',
    taxableValue: 210000,
    gstRate: 18,
    cgst: 18900,
    sgst: 18900,
    igst: 0,
    totalAmount: 247800
  },
  // 10. Inter-state B2B 18% (Gujarat)
  {
    id: 'gst-rec-10',
    docType: 'B2B Invoice',
    invoiceNumber: 'INV-2026-010',
    invoiceDate: '2026-11-12',
    supplierGSTIN: SAMPLE_SUPPLIER_GSTIN,
    recipientGSTIN: '24AABCE0123K1ZA',
    recipientName: 'Ahmedabad Retail Matrix Pvt Ltd',
    placeOfSupply: '24-Gujarat',
    taxableValue: 185000,
    gstRate: 18,
    cgst: 0,
    sgst: 0,
    igst: 33300,
    totalAmount: 218300
  },
  // 11. Intra-state B2B 18%
  {
    id: 'gst-rec-11',
    docType: 'B2B Invoice',
    invoiceNumber: 'INV-2026-011',
    invoiceDate: '2026-11-13',
    supplierGSTIN: SAMPLE_SUPPLIER_GSTIN,
    recipientGSTIN: '36AABCF1234L1ZC',
    recipientName: 'Secunderabad Analytics Private Limited',
    placeOfSupply: '36-Telangana',
    taxableValue: 95000,
    gstRate: 18,
    cgst: 8550,
    sgst: 8550,
    igst: 0,
    totalAmount: 112100
  },
  // 12. Inter-state B2B 12% (Maharashtra)
  {
    id: 'gst-rec-12',
    docType: 'B2B Invoice',
    invoiceNumber: 'INV-2026-012',
    invoiceDate: '2026-11-14',
    supplierGSTIN: SAMPLE_SUPPLIER_GSTIN,
    recipientGSTIN: '27AABCG2345M1ZE',
    recipientName: 'Pune Cloud Dynamics LLP',
    placeOfSupply: '27-Maharashtra',
    taxableValue: 140000,
    gstRate: 12,
    cgst: 0,
    sgst: 0,
    igst: 16800,
    totalAmount: 156800
  },
  // 13. Intra-state B2B 18%
  {
    id: 'gst-rec-13',
    docType: 'B2B Invoice',
    invoiceNumber: 'INV-2026-013',
    invoiceDate: '2026-11-15',
    supplierGSTIN: SAMPLE_SUPPLIER_GSTIN,
    recipientGSTIN: '36AABCH3456N1ZG',
    recipientName: 'Gachibowli AI Labs',
    placeOfSupply: '36-Telangana',
    taxableValue: 310000,
    gstRate: 18,
    cgst: 27900,
    sgst: 27900,
    igst: 0,
    totalAmount: 365800
  },
  // 14. Inter-state B2B 18% (Karnataka)
  {
    id: 'gst-rec-14',
    docType: 'B2B Invoice',
    invoiceNumber: 'INV-2026-014',
    invoiceDate: '2026-11-16',
    supplierGSTIN: SAMPLE_SUPPLIER_GSTIN,
    recipientGSTIN: '29AABCJ4567P1ZJ',
    recipientName: 'Koramangala Ventures LLP',
    placeOfSupply: '29-Karnataka',
    taxableValue: 240000,
    gstRate: 18,
    cgst: 0,
    sgst: 0,
    igst: 43200,
    totalAmount: 283200
  },
  // 15. Intra-state B2B 18% with ARITHMETIC MISMATCH (Demonstrating Warning)
  {
    id: 'gst-rec-15',
    docType: 'B2B Invoice',
    invoiceNumber: 'INV-2026-015',
    invoiceDate: '2026-11-17',
    supplierGSTIN: SAMPLE_SUPPLIER_GSTIN,
    recipientGSTIN: '36AABCK5678Q1ZL',
    recipientName: 'Banjara Hills Creative Media',
    placeOfSupply: '36-Telangana',
    taxableValue: 100000,
    gstRate: 18,
    cgst: 8000, // Should be 9000
    sgst: 8000, // Should be 9000
    igst: 0,
    totalAmount: 116000 // Inconsistent tax total
  },

  // 16. Credit Note 1 (Referencing INV-2026-002) - Inter-state
  {
    id: 'gst-rec-cn1',
    docType: 'Credit Note',
    invoiceNumber: 'CRN-2026-001',
    invoiceDate: '2026-11-20',
    supplierGSTIN: SAMPLE_SUPPLIER_GSTIN,
    recipientGSTIN: '29AABCB3456C1Z9',
    recipientName: 'Bengaluru AI Robotics Pvt Ltd',
    placeOfSupply: '29-Karnataka',
    taxableValue: 30000, // adjustment amount
    gstRate: 18,
    cgst: 0,
    sgst: 0,
    igst: 5400,
    totalAmount: 35400,
    originalInvoiceRef: 'INV-2026-002'
  },
  // 17. Credit Note 2 (Referencing INV-2026-001) - Intra-state
  {
    id: 'gst-rec-cn2',
    docType: 'Credit Note',
    invoiceNumber: 'CRN-2026-002',
    invoiceDate: '2026-11-22',
    supplierGSTIN: SAMPLE_SUPPLIER_GSTIN,
    recipientGSTIN: '36AABCT2345A1Z5',
    recipientName: 'Telangana CloudWorks Infotech',
    placeOfSupply: '36-Telangana',
    taxableValue: 20000,
    gstRate: 18,
    cgst: 1800,
    sgst: 1800,
    igst: 0,
    totalAmount: 23600,
    originalInvoiceRef: 'INV-2026-001'
  },
  // 18. Credit Note 3 (Missing Original Reference - Demonstrating Error)
  {
    id: 'gst-rec-cn3',
    docType: 'Credit Note',
    invoiceNumber: 'CRN-2026-003',
    invoiceDate: '2026-11-25',
    supplierGSTIN: SAMPLE_SUPPLIER_GSTIN,
    recipientGSTIN: '33AABCC8901H1Z6',
    recipientName: 'Chennai Software Labs Private Limited',
    placeOfSupply: '33-Tamil Nadu',
    taxableValue: 15000,
    gstRate: 18,
    cgst: 0,
    sgst: 0,
    igst: 2700,
    totalAmount: 17700,
    originalInvoiceRef: '' // Missing original reference!
  }
];

// Validation Engine
export const validateGSTRecords = (records: Omit<GSTRecord, 'validationStatus' | 'validationIssues'>[]): GSTRecord[] => {
  const invoiceNumberCounts: { [num: string]: number } = {};
  
  // First pass: count invoice numbers to find duplicates
  records.forEach((rec) => {
    if (rec.invoiceNumber) {
      invoiceNumberCounts[rec.invoiceNumber] = (invoiceNumberCounts[rec.invoiceNumber] || 0) + 1;
    }
  });

  return records.map((rec) => {
    const issues: string[] = [];
    let status: 'valid' | 'warning' | 'error' = 'valid';

    // 1. Missing Invoice Number
    if (!rec.invoiceNumber || !rec.invoiceNumber.trim()) {
      issues.push('Missing Document/Invoice Number');
      status = 'error';
    }

    // 2. Duplicate Invoice Number
    if (rec.invoiceNumber && invoiceNumberCounts[rec.invoiceNumber] > 1) {
      issues.push(`Duplicate document number detected (${rec.invoiceNumber} appears ${invoiceNumberCounts[rec.invoiceNumber]} times)`);
      status = 'error';
    }

    // 3. Recipient GSTIN Check
    if (!rec.recipientGSTIN || !rec.recipientGSTIN.trim()) {
      issues.push('Missing Recipient GSTIN: Required for B2B tax invoice credit claims');
      status = 'error';
    } else if (rec.recipientGSTIN.length !== 15) {
      issues.push('Invalid GSTIN format: Must be exactly 15 alphanumeric characters');
      status = 'warning';
    }

    // 4. Missing Date or Invalid Date Format
    if (!rec.invoiceDate || isNaN(Date.parse(rec.invoiceDate))) {
      issues.push('Invalid or missing invoice date');
      status = 'error';
    }

    // 5. Place of Supply vs Tax Type Check
    const supplierState = (rec.supplierGSTIN || '').substring(0, 2);
    const posState = (rec.placeOfSupply || '').substring(0, 2);
    const isIntraState = supplierState && posState && supplierState === posState;

    if (isIntraState && rec.igst > 0 && rec.cgst === 0) {
      issues.push(`Place of supply (${rec.placeOfSupply}) is intra-state, but IGST is charged instead of CGST/SGST`);
      if (status !== 'error') status = 'warning';
    } else if (!isIntraState && (rec.cgst > 0 || rec.sgst > 0)) {
      issues.push(`Place of supply (${rec.placeOfSupply}) is inter-state, but CGST/SGST is charged instead of IGST`);
      if (status !== 'error') status = 'warning';
    }

    // 6. Arithmetic Validation: (taxableValue * gstRate / 100) vs (cgst + sgst + igst)
    const expectedTax = Math.round((rec.taxableValue * rec.gstRate) / 100);
    const actualTax = Math.round(rec.cgst + rec.sgst + rec.igst);
    if (Math.abs(expectedTax - actualTax) > 2) {
      issues.push(`Tax calculation discrepancy: Expected ₹${expectedTax} for ${rec.gstRate}% rate, got ₹${actualTax}`);
      if (status !== 'error') status = 'warning';
    }

    // 7. Credit Note Reference Check
    if (rec.docType === 'Credit Note' && (!rec.originalInvoiceRef || !rec.originalInvoiceRef.trim())) {
      issues.push('Credit Note is missing original invoice reference number');
      status = 'error';
    }

    return {
      ...rec,
      validationStatus: status,
      validationIssues: issues
    };
  });
};

// Summary Computation Engine
export const computeGSTSummary = (records: GSTRecord[]): GSTSummaryData => {
  let b2bCount = 0;
  let creditNoteCount = 0;
  let debitNoteCount = 0;
  let validCount = 0;
  let warningCount = 0;
  let errorCount = 0;

  let totalTaxableValue = 0;
  let totalCGST = 0;
  let totalSGST = 0;
  let totalIGST = 0;
  let totalTax = 0;
  let netAdjustments = 0;

  const rateMap: { [rate: number]: { taxable: number; cgst: number; sgst: number; igst: number; totalTax: number; count: number } } = {};
  const recipientMap: { [gstin: string]: { name: string; count: number; taxable: number; totalTax: number } } = {};

  records.forEach((rec) => {
    const isCreditNote = rec.docType === 'Credit Note';
    const sign = isCreditNote ? -1 : 1;

    if (rec.docType === 'B2B Invoice') b2bCount++;
    else if (rec.docType === 'Credit Note') creditNoteCount++;
    else debitNoteCount++;

    if (rec.validationStatus === 'valid') validCount++;
    else if (rec.validationStatus === 'warning') warningCount++;
    else errorCount++;

    const taxForRecord = rec.cgst + rec.sgst + rec.igst;

    totalTaxableValue += sign * rec.taxableValue;
    totalCGST += sign * rec.cgst;
    totalSGST += sign * rec.sgst;
    totalIGST += sign * rec.igst;
    totalTax += sign * taxForRecord;

    if (isCreditNote) {
      netAdjustments += rec.taxableValue;
    }

    // Rate breakdown
    const rate = rec.gstRate || 0;
    if (!rateMap[rate]) {
      rateMap[rate] = { taxable: 0, cgst: 0, sgst: 0, igst: 0, totalTax: 0, count: 0 };
    }
    rateMap[rate].taxable += sign * rec.taxableValue;
    rateMap[rate].cgst += sign * rec.cgst;
    rateMap[rate].sgst += sign * rec.sgst;
    rateMap[rate].igst += sign * rec.igst;
    rateMap[rate].totalTax += sign * taxForRecord;
    rateMap[rate].count++;

    // Recipient breakdown
    const key = rec.recipientGSTIN || 'Unregistered / Missing';
    if (!recipientMap[key]) {
      recipientMap[key] = {
        name: rec.recipientName || 'Unknown Entity',
        count: 0,
        taxable: 0,
        totalTax: 0
      };
    }
    recipientMap[key].count++;
    recipientMap[key].taxable += sign * rec.taxableValue;
    recipientMap[key].totalTax += sign * taxForRecord;
  });

  const rateWise = Object.entries(rateMap).map(([rateStr, data]) => ({
    rate: Number(rateStr),
    taxable: data.taxable,
    cgst: data.cgst,
    sgst: data.sgst,
    igst: data.igst,
    totalTax: data.totalTax,
    recordCount: data.count
  })).sort((a, b) => a.rate - b.rate);

  const recipientWise = Object.entries(recipientMap).map(([gstin, data]) => ({
    gstin,
    ...data
  })).sort((a, b) => b.taxable - a.taxable);

  return {
    totalRecords: records.length,
    b2bCount,
    creditNoteCount,
    debitNoteCount,
    validCount,
    warningCount,
    errorCount,
    totalTaxableValue,
    totalCGST,
    totalSGST,
    totalIGST,
    totalTax,
    netAdjustments,
    rateWise,
    recipientWise
  };
};

export const getInitialValidatedSampleData = (): GSTRecord[] => {
  return validateGSTRecords(RAW_SAMPLE_GST_RECORDS);
};
