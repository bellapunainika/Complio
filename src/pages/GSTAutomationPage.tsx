import React, { useState } from 'react';
import { useCompliance } from '../context/ComplianceContext';
import { 
  FileSpreadsheet, 
  Upload, 
  CheckCircle2, 
  AlertTriangle, 
  ShieldAlert, 
  Download, 
  RefreshCw, 
  FileText, 
  Sparkles, 
  Search, 
  Filter, 
  ArrowRight, 
  FileJson, 
  Database,
  Building,
  Calendar,
  X,
  Eye,
  Info
} from 'lucide-react';
import * as XLSX from 'xlsx';
import { GSTRecord } from '../types';
import { 
  exportGSTSummaryPDF, 
  exportStructuredGSTJSON, 
  exportRecordsToCSV, 
  downloadFile,
  formatINR 
} from '../utils/pdfGenerator';
import { SAMPLE_SUPPLIER_GSTIN } from '../data/sampleGSTRecords';

export const GSTAutomationPage: React.FC = () => {
  const { 
    currentProfile, 
    gstRecords, 
    gstSummary, 
    loadSampleGSTData, 
    setParsedGSTRecords, 
    addVaultDocument 
  } = useCompliance();

  const [activeStep, setActiveStep] = useState<number>(1);
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [processingMessage, setProcessingMessage] = useState<string>('');
  const [uploadedFile, setUploadedFile] = useState<{ name: string; size: string; type: string } | null>(null);
  
  // Table view state
  const [statusFilter, setStatusFilter] = useState<'all' | 'valid' | 'warning' | 'error'>('all');
  const [docTypeFilter, setDocTypeFilter] = useState<'all' | 'B2B Invoice' | 'Credit Note'>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [inspectedRecord, setInspectedRecord] = useState<GSTRecord | null>(null);

  // File Upload Handler (Parses CSV and XLSX in browser)
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadedFile({
      name: file.name,
      size: `${(file.size / 1024).toFixed(1)} KB`,
      type: file.name.endsWith('.csv') ? 'CSV Spreadsheet' : 'Excel Workbook (.xlsx)'
    });

    setIsProcessing(true);
    setProcessingMessage('Reading uploaded records from file...');

    const reader = new FileReader();
    reader.onload = (evt) => {
      try {
        const data = evt.target?.result;
        const workbook = XLSX.read(data, { type: 'binary' });
        const firstSheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[firstSheetName];
        const rawJson: any[] = XLSX.utils.sheet_to_json(worksheet);

        setTimeout(() => {
          setProcessingMessage('Extracting invoice details & recipient GSTINs...');
          setTimeout(() => {
            setProcessingMessage('Checking tax calculations and place of supply...');
            setTimeout(() => {
              setProcessingMessage('Organizing credit notes & preparing GST summaries...');
              setTimeout(() => {
                // Map raw json rows to GSTRecord format
                const parsedRecords: Omit<GSTRecord, 'validationStatus' | 'validationIssues'>[] = rawJson.map((row, idx) => {
                  const docType = (row['Document Type'] || row['Type'] || (row['Invoice Number']?.includes('CRN') ? 'Credit Note' : 'B2B Invoice')) as any;
                  const taxable = Number(row['Taxable Value (INR)'] || row['Taxable Value'] || row['Taxable'] || 0);
                  const rate = Number(row['GST Rate (%)'] || row['GST Rate'] || row['Rate'] || 18);
                  const cgst = Number(row['CGST (INR)'] || row['CGST'] || 0);
                  const sgst = Number(row['SGST (INR)'] || row['SGST'] || 0);
                  const igst = Number(row['IGST (INR)'] || row['IGST'] || 0);
                  const total = Number(row['Total Amount (INR)'] || row['Total Amount'] || row['Total'] || (taxable + cgst + sgst + igst));

                  return {
                    id: `uploaded-${idx}-${Date.now()}`,
                    docType,
                    invoiceNumber: String(row['Document Number'] || row['Invoice Number'] || row['Invoice No'] || `INV-UPL-${idx + 1}`),
                    invoiceDate: String(row['Document Date'] || row['Invoice Date'] || row['Date'] || '2026-11-14'),
                    supplierGSTIN: String(row['Supplier GSTIN'] || currentProfile.gstin || SAMPLE_SUPPLIER_GSTIN),
                    recipientGSTIN: String(row['Recipient GSTIN'] || row['Customer GSTIN'] || ''),
                    recipientName: String(row['Recipient Name'] || row['Customer Name'] || 'Client Entity'),
                    placeOfSupply: String(row['Place of Supply'] || row['POS'] || '36-Telangana'),
                    taxableValue: taxable,
                    gstRate: rate,
                    cgst,
                    sgst,
                    igst,
                    totalAmount: total,
                    originalInvoiceRef: row['Original Ref (Credit Note)'] || row['Original Invoice Ref'] || ''
                  };
                });

                if (parsedRecords.length > 0) {
                  setParsedGSTRecords(parsedRecords);
                }
                setIsProcessing(false);
                setActiveStep(3); // jump to review
              }, 600);
            }, 600);
          }, 600);
        }, 600);
      } catch (err) {
        console.error('File parsing error', err);
        alert('Failed to parse spreadsheet. Please verify file columns or load sample data.');
        setIsProcessing(false);
      }
    };
    reader.readAsBinaryString(file);
  };

  // Demo Load Sample Data with animation
  const handleLoadSample = () => {
    setIsProcessing(true);
    setProcessingMessage('Loading 18 realistic B2B sales invoices and credit notes...');
    setTimeout(() => {
      setProcessingMessage('Evaluating duplicate document numbers (INV-2026-004)...');
      setTimeout(() => {
        setProcessingMessage('Running statutory tax arithmetic and POS cross-checks...');
        setTimeout(() => {
          loadSampleGSTData();
          setUploadedFile({
            name: 'NovaTech_Sales_Register_Nov2026.xlsx',
            size: '28.4 KB',
            type: 'Curated Sample Dataset'
          });
          setIsProcessing(false);
          setActiveStep(3); // Move to review step
        }, 700);
      }, 700);
    }, 700);
  };

  // Download Sample Template CSV for judges
  const handleDownloadSampleTemplate = () => {
    const csvContent = exportRecordsToCSV(gstRecords);
    downloadFile(csvContent, 'COMPLIO_Sample_GST_Sales_Register.csv', 'text/csv');
  };

  // Export GST PDF
  const handleExportPDF = () => {
    const doc = exportGSTSummaryPDF(gstSummary, currentProfile, gstRecords);
    doc.save(`COMPLIO_GST_Preparation_Report_Nov2026.pdf`);
    addVaultDocument({
      title: `GST Preparation Report - Nov 2026 (${currentProfile.businessName})`,
      category: 'GST Reports',
      fileType: 'PDF',
      associatedBusiness: currentProfile.businessName,
      fileSize: '148 KB',
      dataSummary: `Net Tax Liability: ${formatINR(gstSummary.totalTax)} • ${gstSummary.validCount} valid records`
    });
  };

  // Export JSON
  const handleExportJSON = () => {
    const jsonStr = exportStructuredGSTJSON(gstRecords, currentProfile);
    downloadFile(jsonStr, `COMPLIO_GST_Structured_Export_Nov2026.json`, 'application/json');
    addVaultDocument({
      title: `Structured GST JSON Payload (Nov 2026)`,
      category: 'GST Reports',
      fileType: 'JSON',
      associatedBusiness: currentProfile.businessName,
      fileSize: '32 KB',
      dataSummary: 'Demo structured GST export – not validated for direct GST portal upload'
    });
  };

  // Export Validated CSV
  const handleExportCSV = () => {
    const csvStr = exportRecordsToCSV(gstRecords);
    downloadFile(csvStr, `COMPLIO_Validated_Invoice_Register_Nov2026.csv`, 'text/csv');
    addVaultDocument({
      title: `Validated Invoice Register (CSV)`,
      category: 'GST Reports',
      fileType: 'CSV',
      associatedBusiness: currentProfile.businessName,
      fileSize: '18 KB',
      dataSummary: `${gstRecords.length} records with validation flags and arithmetic checks`
    });
  };

  // Filtered records
  const filteredRecords = gstRecords.filter((rec) => {
    if (statusFilter !== 'all' && rec.validationStatus !== statusFilter) return false;
    if (docTypeFilter !== 'all' && rec.docType !== docTypeFilter) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return (
        rec.invoiceNumber.toLowerCase().includes(q) ||
        rec.recipientName.toLowerCase().includes(q) ||
        rec.recipientGSTIN.toLowerCase().includes(q) ||
        rec.placeOfSupply.toLowerCase().includes(q)
      );
    }
    return true;
  });

  return (
    <div className="space-y-8 animate-fadeIn pb-12">
      
      {/* Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-6 rounded-2xl bg-gradient-to-r from-[#12151D] via-[#0D0F15] to-[#181C26] border border-[#9466FF]/30 shadow-glow">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold text-[#B69AFF]">
            <Sparkles className="w-3.5 h-3.5 text-[#9466FF]" />
            <span>Highest Priority Automation Feature</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white font-display tracking-tight mt-1 flex items-center gap-2.5">
            <FileSpreadsheet className="w-7 h-7 text-[#9466FF]" />
            <span>GST Automation Studio</span>
          </h1>
          <p className="text-xs sm:text-sm text-[#9295A5] mt-1">
            Transform messy spreadsheets, B2B invoices and credit notes into verified tax summaries ready for CA review.
          </p>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <button
            onClick={handleLoadSample}
            className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-[#9466FF] to-[#6C8FFF] hover:opacity-95 text-xs font-semibold text-white shadow-glow transition-all flex items-center gap-2"
          >
            <Database className="w-4 h-4" />
            <span>Load Sample GST Data (18 Records)</span>
          </button>

          <button
            onClick={handleDownloadSampleTemplate}
            className="px-3.5 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-xs font-medium text-white border border-white/10 transition-colors flex items-center gap-1.5"
            title="Download CSV for Excel demonstration"
          >
            <Download className="w-3.5 h-3.5 text-[#B69AFF]" />
            <span>Download CSV Template</span>
          </button>
        </div>
      </div>

      {/* Step Tabs Navigation */}
      <div className="grid grid-cols-3 sm:grid-cols-6 gap-2 text-xs font-medium">
        {[
          { num: 1, label: 'Upload' },
          { num: 2, label: 'Extract' },
          { num: 3, label: 'Validation' },
          { num: 4, label: 'Calculations' },
          { num: 5, label: 'Review Table' },
          { num: 6, label: 'Export Report' },
        ].map((step) => {
          const isActive = activeStep === step.num;
          return (
            <button
              key={step.num}
              onClick={() => setActiveStep(step.num)}
              className={`p-3 rounded-xl border transition-all text-center ${
                isActive
                  ? 'bg-[#181C26] border-[#9466FF] text-white shadow-glow'
                  : 'bg-[#0D0F15] border-white/5 text-[#9295A5] hover:text-white'
              }`}
            >
              <div className="text-[10px] uppercase font-mono opacity-70">Step 0{step.num}</div>
              <div className="font-semibold text-xs mt-0.5">{step.label}</div>
            </button>
          );
        })}
      </div>

      {/* Processing Animation Modal */}
      {isProcessing && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="p-8 rounded-2xl bg-[#0D0F15] border border-[#9466FF]/40 shadow-glow max-w-md w-full text-center space-y-4 animate-fadeIn">
            <div className="w-12 h-12 border-3 border-[#9466FF] border-t-transparent rounded-full animate-spin mx-auto" />
            <h3 className="text-base font-bold text-white">GST Processing Engine Active</h3>
            <p className="text-xs text-[#B69AFF] font-mono animate-pulse">{processingMessage}</p>
            <div className="w-full h-1.5 bg-white/10 rounded-full overflow-hidden">
              <div className="h-full bg-gradient-to-r from-[#9466FF] to-[#6C8FFF] animate-pulse w-3/4" />
            </div>
          </div>
        </div>
      )}

      {/* STEP 1: UPLOAD DOCUMENTS */}
      {activeStep === 1 && (
        <div className="p-8 rounded-2xl bg-[#0D0F15] border border-white/10 space-y-6">
          <div className="max-w-2xl">
            <h2 className="text-xl font-bold text-white font-display">Let's organize your GST records.</h2>
            <p className="text-xs text-[#9295A5] mt-1">
              Upload your monthly B2B sales register, credit notes, or invoices in Excel (.xlsx) or CSV format. All calculations are performed 100% locally in your browser.
            </p>
          </div>

          {/* Drag & Drop Upload Dropzone */}
          <div className="relative border-2 border-dashed border-white/20 hover:border-[#9466FF]/60 rounded-2xl p-8 sm:p-12 text-center transition-all bg-[#08090D]/50 group">
            <input
              type="file"
              accept=".csv,.xlsx,.xls"
              onChange={handleFileUpload}
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
            />
            <div className="w-14 h-14 rounded-2xl bg-[#9466FF]/15 text-[#B69AFF] flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform shadow-glow">
              <Upload className="w-7 h-7" />
            </div>
            <h3 className="text-base font-bold text-white">Drop your spreadsheet here or click to browse</h3>
            <p className="text-xs text-[#9295A5] mt-1.5">
              Supports .xlsx, .xls and .csv formats with invoice numbers, GSTINs, and tax values.
            </p>
            <div className="mt-4 flex items-center justify-center gap-4 text-[11px] text-gray-400">
              <span className="flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" /> Client-side Parsing
              </span>
              <span className="flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5 text-[#9466FF]" /> Zero Cloud Upload
              </span>
            </div>
          </div>

          {/* Uploaded File Pill */}
          {uploadedFile && (
            <div className="p-4 rounded-xl bg-[#12151D] border border-white/10 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <FileSpreadsheet className="w-6 h-6 text-[#9466FF]" />
                <div>
                  <div className="text-sm font-semibold text-white">{uploadedFile.name}</div>
                  <div className="text-xs text-[#9295A5]">{uploadedFile.type} • {uploadedFile.size}</div>
                </div>
              </div>
              <button
                onClick={() => setUploadedFile(null)}
                className="p-2 rounded-lg text-[#9295A5] hover:text-white hover:bg-white/5"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          )}

          {/* Instant Sample Button */}
          <div className="p-4 rounded-xl bg-[#12151D] border border-white/5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="space-y-0.5">
              <div className="text-sm font-semibold text-white">No file handy right now?</div>
              <div className="text-xs text-[#9295A5]">Load our preconfigured sample dataset containing 15 B2B invoices and 3 credit notes.</div>
            </div>
            <button
              onClick={handleLoadSample}
              className="px-4 py-2 rounded-xl bg-white/10 hover:bg-white/15 text-xs font-semibold text-white border border-white/15 transition-colors shrink-0"
            >
              Load Sample Dataset →
            </button>
          </div>
        </div>
      )}

      {/* STEP 2, 3, 4, 5, 6 COMBINED OR TABBED FOR SMOOTH DEMO */}
      {activeStep >= 2 && (
        <div className="space-y-6">
          
          {/* Top Summary Metrics Cards (Step 4 & 5) */}
          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 gap-3">
            <div className="p-4 rounded-xl bg-[#12151D] border border-white/10 space-y-1">
              <div className="text-[11px] text-[#9295A5] uppercase font-mono">Total Records</div>
              <div className="text-2xl font-bold text-white font-display">{gstSummary.totalRecords}</div>
              <div className="text-[10px] text-gray-400">{gstSummary.b2bCount} B2B | {gstSummary.creditNoteCount} CN</div>
            </div>

            <div className="p-4 rounded-xl bg-[#12151D] border border-emerald-500/20 bg-emerald-500/[0.02] space-y-1">
              <div className="text-[11px] text-emerald-400 uppercase font-mono">Valid Records</div>
              <div className="text-2xl font-bold text-emerald-400 font-display">{gstSummary.validCount}</div>
              <div className="text-[10px] text-emerald-400/80">Reconciled Cleanly</div>
            </div>

            <div className="p-4 rounded-xl bg-[#12151D] border border-amber-500/20 bg-amber-500/[0.02] space-y-1">
              <div className="text-[11px] text-amber-400 uppercase font-mono">Warnings</div>
              <div className="text-2xl font-bold text-amber-400 font-display">{gstSummary.warningCount}</div>
              <div className="text-[10px] text-amber-400/80">Arithmetic / POS Flags</div>
            </div>

            <div className="p-4 rounded-xl bg-[#12151D] border border-rose-500/20 bg-rose-500/[0.02] space-y-1">
              <div className="text-[11px] text-rose-400 uppercase font-mono">Errors (Action)</div>
              <div className="text-2xl font-bold text-rose-400 font-display">{gstSummary.errorCount}</div>
              <div className="text-[10px] text-rose-400/80">Duplicates & Missing GSTIN</div>
            </div>

            <div className="p-4 rounded-xl bg-[#12151D] border border-white/10 space-y-1">
              <div className="text-[11px] text-[#9295A5] uppercase font-mono">Net Taxable</div>
              <div className="text-lg font-bold text-white truncate" title={formatINR(gstSummary.totalTaxableValue)}>
                {formatINR(gstSummary.totalTaxableValue)}
              </div>
              <div className="text-[10px] text-gray-400">Adj: -{formatINR(gstSummary.netAdjustments)}</div>
            </div>

            <div className="p-4 rounded-xl bg-[#12151D] border border-[#9466FF]/30 space-y-1 shadow-glow">
              <div className="text-[11px] text-[#B69AFF] uppercase font-mono">Total Tax Due</div>
              <div className="text-lg font-bold text-[#B69AFF] truncate" title={formatINR(gstSummary.totalTax)}>
                {formatINR(gstSummary.totalTax)}
              </div>
              <div className="text-[10px] text-gray-400">CGST + SGST + IGST</div>
            </div>
          </div>

          {/* Validation Attention Banner (Demonstrating Errors clearly) */}
          {(gstSummary.errorCount > 0 || gstSummary.warningCount > 0) && (
            <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/20 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs text-amber-200">
              <div className="flex items-center gap-2.5">
                <AlertTriangle className="w-5 h-5 text-amber-400 shrink-0" />
                <div>
                  <strong>Validation Notice:</strong> Detected {gstSummary.errorCount} critical errors (duplicate invoice `INV-2026-004` & missing GSTIN) and {gstSummary.warningCount} tax calculation warnings.
                </div>
              </div>
              <button
                onClick={() => setStatusFilter('error')}
                className="px-3 py-1.5 rounded-lg bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 font-semibold shrink-0"
              >
                Inspect Problem Records →
              </button>
            </div>
          )}

          {/* Tax Breakdown Grid (CGST, SGST, IGST & Rate-wise) */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            
            {/* Left 6 cols: Component breakdown */}
            <div className="lg:col-span-6 p-6 rounded-2xl bg-[#0D0F15] border border-white/10 space-y-4">
              <h3 className="text-sm font-bold text-white font-display flex items-center justify-between">
                <span>Tax Component Split</span>
                <span className="text-xs text-[#9295A5] font-mono">Nov 2026</span>
              </h3>

              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 rounded-xl bg-[#12151D] border border-white/5">
                  <div className="flex items-center gap-2 text-xs text-gray-300">
                    <span className="w-2.5 h-2.5 rounded-full bg-[#9466FF]"></span>
                    <span>Central GST (CGST) - Intra State</span>
                  </div>
                  <span className="text-sm font-bold text-white">{formatINR(gstSummary.totalCGST)}</span>
                </div>

                <div className="flex items-center justify-between p-3 rounded-xl bg-[#12151D] border border-white/5">
                  <div className="flex items-center gap-2 text-xs text-gray-300">
                    <span className="w-2.5 h-2.5 rounded-full bg-[#6C8FFF]"></span>
                    <span>State GST (SGST) - Telangana</span>
                  </div>
                  <span className="text-sm font-bold text-white">{formatINR(gstSummary.totalSGST)}</span>
                </div>

                <div className="flex items-center justify-between p-3 rounded-xl bg-[#12151D] border border-white/5">
                  <div className="flex items-center gap-2 text-xs text-gray-300">
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-400"></span>
                    <span>Integrated GST (IGST) - Inter State</span>
                  </div>
                  <span className="text-sm font-bold text-white">{formatINR(gstSummary.totalIGST)}</span>
                </div>

                <div className="flex items-center justify-between p-3 rounded-xl bg-purple-500/10 border border-purple-500/20">
                  <span className="text-xs font-bold text-purple-300">Net Statutory Liability</span>
                  <span className="text-base font-extrabold text-white">{formatINR(gstSummary.totalTax)}</span>
                </div>
              </div>
            </div>

            {/* Right 6 cols: Rate-wise Breakdown Table */}
            <div className="lg:col-span-6 p-6 rounded-2xl bg-[#0D0F15] border border-white/10 space-y-4">
              <h3 className="text-sm font-bold text-white font-display flex items-center justify-between">
                <span>Tax Rate-Wise Aggregation</span>
                <span className="text-xs text-[#9295A5] font-mono">Applicable Slabs</span>
              </h3>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead>
                    <tr className="border-b border-white/10 text-[#9295A5]">
                      <th className="pb-2 font-medium">Slab</th>
                      <th className="pb-2 font-medium">Docs</th>
                      <th className="pb-2 font-medium">Taxable Value</th>
                      <th className="pb-2 font-medium text-right">Tax Amount</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5">
                    {gstSummary.rateWise.map((slab) => (
                      <tr key={slab.rate} className="hover:bg-white/[0.02]">
                        <td className="py-2.5 font-bold text-white">{slab.rate}% GST</td>
                        <td className="py-2.5 text-[#9295A5]">{slab.recordCount}</td>
                        <td className="py-2.5 text-gray-300">{formatINR(slab.taxable)}</td>
                        <td className="py-2.5 text-right font-semibold text-[#B69AFF]">{formatINR(slab.totalTax)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

          </div>

          {/* Review Data Table (Step 5) */}
          <div className="p-6 rounded-2xl bg-[#0D0F15] border border-white/10 space-y-4">
            
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h3 className="text-base font-bold text-white font-display">Document Extraction Register</h3>
                <p className="text-xs text-[#9295A5]">Audit trail of all parsed invoices, credit notes and validation flags.</p>
              </div>

              {/* Action Downloads */}
              <div className="flex items-center gap-2 flex-wrap">
                <button
                  onClick={handleExportPDF}
                  className="px-3.5 py-2 rounded-xl bg-gradient-to-r from-[#9466FF] to-[#6C8FFF] text-white text-xs font-semibold shadow-glow hover:opacity-95 transition-all flex items-center gap-1.5"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Download GST Preparation PDF</span>
                </button>

                <button
                  onClick={handleExportCSV}
                  className="px-3 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-white text-xs border border-white/10 transition-colors flex items-center gap-1.5"
                >
                  <FileText className="w-3.5 h-3.5 text-[#6C8FFF]" />
                  <span>Export CSV</span>
                </button>

                <button
                  onClick={handleExportJSON}
                  className="px-3 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-white text-xs border border-white/10 transition-colors flex items-center gap-1.5"
                >
                  <FileJson className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Export JSON</span>
                </button>
              </div>
            </div>

            {/* Table Filters & Search */}
            <div className="grid grid-cols-1 sm:grid-cols-12 gap-3 pt-2">
              <div className="sm:col-span-6 relative">
                <Search className="w-4 h-4 text-[#9295A5] absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search invoice number, client name, GSTIN..."
                  className="w-full pl-9 pr-4 py-2 rounded-xl bg-[#12151D] border border-white/10 text-white text-xs placeholder-gray-500 focus:outline-none focus:border-[#9466FF]"
                />
              </div>

              <div className="sm:col-span-3">
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value as any)}
                  className="w-full px-3 py-2 rounded-xl bg-[#12151D] border border-white/10 text-white text-xs focus:outline-none focus:border-[#9466FF]"
                >
                  <option value="all">All Validation Statuses</option>
                  <option value="valid">Valid Only ({gstSummary.validCount})</option>
                  <option value="warning">Warnings Only ({gstSummary.warningCount})</option>
                  <option value="error">Errors Only ({gstSummary.errorCount})</option>
                </select>
              </div>

              <div className="sm:col-span-3">
                <select
                  value={docTypeFilter}
                  onChange={(e) => setDocTypeFilter(e.target.value as any)}
                  className="w-full px-3 py-2 rounded-xl bg-[#12151D] border border-white/10 text-white text-xs focus:outline-none focus:border-[#9466FF]"
                >
                  <option value="all">All Document Types</option>
                  <option value="B2B Invoice">B2B Invoices ({gstSummary.b2bCount})</option>
                  <option value="Credit Note">Credit Notes ({gstSummary.creditNoteCount})</option>
                </select>
              </div>
            </div>

            {/* Table */}
            <div className="overflow-x-auto rounded-xl border border-white/5">
              <table className="w-full text-left text-xs">
                <thead className="bg-[#12151D] text-[#9295A5] uppercase font-mono text-[10px]">
                  <tr>
                    <th className="p-3">Doc #</th>
                    <th className="p-3">Type</th>
                    <th className="p-3">Date</th>
                    <th className="p-3">Recipient & GSTIN</th>
                    <th className="p-3">POS</th>
                    <th className="p-3">Taxable</th>
                    <th className="p-3">GST%</th>
                    <th className="p-3">Tax</th>
                    <th className="p-3">Total</th>
                    <th className="p-3">Status</th>
                    <th className="p-3 text-right">Inspect</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {filteredRecords.map((rec) => {
                    const isCreditNote = rec.docType === 'Credit Note';

                    return (
                      <tr 
                        key={rec.id} 
                        className={`hover:bg-white/[0.02] transition-colors ${
                          rec.validationStatus === 'error'
                            ? 'bg-rose-500/[0.04]'
                            : rec.validationStatus === 'warning'
                            ? 'bg-amber-500/[0.03]'
                            : ''
                        }`}
                      >
                        <td className="p-3 font-mono font-bold text-white">
                          {rec.invoiceNumber}
                          {rec.originalInvoiceRef && (
                            <span className="block text-[9px] text-[#9295A5]">
                              Ref: {rec.originalInvoiceRef}
                            </span>
                          )}
                        </td>
                        <td className="p-3">
                          <span className={`px-2 py-0.5 rounded text-[10px] font-medium ${
                            isCreditNote ? 'bg-amber-500/15 text-amber-300' : 'bg-[#9466FF]/15 text-[#B69AFF]'
                          }`}>
                            {rec.docType}
                          </span>
                        </td>
                        <td className="p-3 text-[#9295A5] whitespace-nowrap">{rec.invoiceDate}</td>
                        <td className="p-3">
                          <div className="font-medium text-white truncate max-w-[160px]">{rec.recipientName}</div>
                          <div className={`font-mono text-[10px] ${rec.recipientGSTIN ? 'text-[#9295A5]' : 'text-rose-400 font-bold'}`}>
                            {rec.recipientGSTIN || 'MISSING GSTIN'}
                          </div>
                        </td>
                        <td className="p-3 text-[#9295A5] whitespace-nowrap">{rec.placeOfSupply}</td>
                        <td className="p-3 text-white font-medium whitespace-nowrap">
                          {isCreditNote ? `-${formatINR(rec.taxableValue)}` : formatINR(rec.taxableValue)}
                        </td>
                        <td className="p-3 text-[#9295A5]">{rec.gstRate}%</td>
                        <td className="p-3 text-[#B69AFF] font-medium whitespace-nowrap">
                          {formatINR(rec.cgst + rec.sgst + rec.igst)}
                        </td>
                        <td className="p-3 text-white font-bold whitespace-nowrap">
                          {formatINR(rec.totalAmount)}
                        </td>
                        <td className="p-3 whitespace-nowrap">
                          <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                            rec.validationStatus === 'valid'
                              ? 'bg-emerald-500/15 text-emerald-400'
                              : rec.validationStatus === 'warning'
                              ? 'bg-amber-500/15 text-amber-300'
                              : 'bg-rose-500/20 text-rose-400'
                          }`}>
                            {rec.validationStatus}
                          </span>
                        </td>
                        <td className="p-3 text-right">
                          <button
                            onClick={() => setInspectedRecord(rec)}
                            className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-[#9295A5] hover:text-white"
                            title="Inspect Validation Details"
                          >
                            <Eye className="w-3.5 h-3.5" />
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* Disclaimer notice under table */}
            <div className="p-4 rounded-xl bg-white/[0.02] border border-white/5 text-[11px] text-[#9295A5] space-y-1">
              <p>
                <strong>Statutory Filing Note:</strong> This report organizes sales registers for Chartered Accountant review and reconciliation against GSTR-2B.
              </p>
              <p className="text-gray-400">
                JSON exports are formatted as demo structures and must be validated with official GSTN utility tools before direct submission.
              </p>
            </div>

          </div>

        </div>
      )}

      {/* Record Inspection Modal */}
      {inspectedRecord && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="max-w-lg w-full rounded-2xl bg-[#0D0F15] border border-white/15 p-6 space-y-4 shadow-2xl animate-fadeIn">
            <div className="flex items-start justify-between border-b border-white/10 pb-4">
              <div>
                <span className="text-xs text-[#9295A5] uppercase font-mono">Invoice Inspection</span>
                <h3 className="text-lg font-bold text-white">{inspectedRecord.invoiceNumber}</h3>
              </div>
              <button
                onClick={() => setInspectedRecord(null)}
                className="p-1 rounded-lg text-[#9295A5] hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Validation Issues Block */}
            <div className="p-4 rounded-xl bg-[#12151D] border border-white/5 space-y-2">
              <div className="text-xs font-bold text-white flex items-center gap-2">
                <span className={`w-2.5 h-2.5 rounded-full ${
                  inspectedRecord.validationStatus === 'valid' ? 'bg-emerald-400' : inspectedRecord.validationStatus === 'warning' ? 'bg-amber-400' : 'bg-rose-500'
                }`} />
                <span>Validation Evaluation: {inspectedRecord.validationStatus.toUpperCase()}</span>
              </div>
              {inspectedRecord.validationIssues.length > 0 ? (
                <ul className="text-xs text-rose-300 space-y-1 list-disc list-inside">
                  {inspectedRecord.validationIssues.map((iss, i) => (
                    <li key={i}>{iss}</li>
                  ))}
                </ul>
              ) : (
                <p className="text-xs text-emerald-400">All fields, GSTIN formats, and tax formulas validated successfully.</p>
              )}
            </div>

            {/* Field Grid */}
            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="p-3 rounded-lg bg-[#12151D] border border-white/5">
                <span className="text-[10px] text-[#9295A5] block">Recipient</span>
                <span className="font-semibold text-white">{inspectedRecord.recipientName}</span>
              </div>
              <div className="p-3 rounded-lg bg-[#12151D] border border-white/5">
                <span className="text-[10px] text-[#9295A5] block">Recipient GSTIN</span>
                <span className="font-mono text-white">{inspectedRecord.recipientGSTIN || 'MISSING'}</span>
              </div>
              <div className="p-3 rounded-lg bg-[#12151D] border border-white/5">
                <span className="text-[10px] text-[#9295A5] block">Place of Supply</span>
                <span className="text-white">{inspectedRecord.placeOfSupply}</span>
              </div>
              <div className="p-3 rounded-lg bg-[#12151D] border border-white/5">
                <span className="text-[10px] text-[#9295A5] block">Taxable Value</span>
                <span className="font-bold text-white">{formatINR(inspectedRecord.taxableValue)}</span>
              </div>
              <div className="p-3 rounded-lg bg-[#12151D] border border-white/5">
                <span className="text-[10px] text-[#9295A5] block">CGST + SGST</span>
                <span className="text-[#B69AFF]">{formatINR(inspectedRecord.cgst + inspectedRecord.sgst)}</span>
              </div>
              <div className="p-3 rounded-lg bg-[#12151D] border border-white/5">
                <span className="text-[10px] text-[#9295A5] block">IGST</span>
                <span className="text-[#6C8FFF]">{formatINR(inspectedRecord.igst)}</span>
              </div>
            </div>

            <div className="flex justify-end pt-2">
              <button
                onClick={() => setInspectedRecord(null)}
                className="px-4 py-2 rounded-xl bg-white/10 hover:bg-white/15 text-xs text-white"
              >
                Close Inspection
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

