import React, { useState } from 'react';
import { useCompliance } from '../context/ComplianceContext';
import { 
  FileText, 
  Receipt, 
  Plus, 
  Trash2, 
  Download, 
  Copy, 
  Check, 
  Building, 
  User, 
  Sparkles, 
  Layers, 
  Shield, 
  AlertCircle,
  FileCheck
} from 'lucide-react';
import { InvoiceLineItem } from '../types';
import { exportInvoicePDF, exportAgreementPDF, formatINR } from '../utils/pdfGenerator';
import { SAMPLE_SUPPLIER_GSTIN } from '../data/sampleGSTRecords';

export const DocumentStudioPage: React.FC = () => {
  const { currentProfile, addVaultDocument } = useCompliance();

  const [activeTab, setActiveTab] = useState<'invoice' | 'agreements'>('invoice');

  // ---------------- INVOICE GENERATOR STATE ----------------
  const [invoiceNumber, setInvoiceNumber] = useState('INV-2026-088');
  const [invoiceDate, setInvoiceDate] = useState('2026-11-14');
  const [customerName, setCustomerName] = useState('Hyperion Cloud Systems Private Limited');
  const [customerGSTIN, setCustomerGSTIN] = useState('29AABCH9876K1Z3');
  const [customerAddress, setCustomerAddress] = useState('Indiranagar, 100ft Road, Bengaluru');
  const [customerState, setCustomerState] = useState('Karnataka');
  const [placeOfSupply, setPlaceOfSupply] = useState('29-Karnataka');

  const [items, setItems] = useState<InvoiceLineItem[]>([
    {
      id: 'item-1',
      description: 'Cloud Infrastructure Architecture & Compliance Setup',
      hsnSac: '998313',
      quantity: 1,
      unitPrice: 120000,
      gstRate: 18,
      taxableValue: 120000,
      cgst: 0,
      sgst: 0,
      igst: 21600,
      total: 141600
    },
    {
      id: 'item-2',
      description: 'Monthly Managed Regulatory API Subscription',
      hsnSac: '998314',
      quantity: 2,
      unitPrice: 25000,
      gstRate: 18,
      taxableValue: 50000,
      cgst: 0,
      sgst: 0,
      igst: 9000,
      total: 59000
    }
  ]);

  // Recalculate item taxes based on Place of Supply
  const supplierStateCode = (currentProfile.gstin || SAMPLE_SUPPLIER_GSTIN).substring(0, 2);
  const posCode = placeOfSupply.substring(0, 2);
  const isIntraState = supplierStateCode === posCode;

  const handleItemChange = (index: number, field: keyof InvoiceLineItem, value: any) => {
    setItems(prev => {
      const updated = [...prev];
      const item = { ...updated[index], [field]: value };

      const qty = field === 'quantity' ? Number(value) : item.quantity;
      const price = field === 'unitPrice' ? Number(value) : item.unitPrice;
      const rate = field === 'gstRate' ? Number(value) : item.gstRate;

      const taxable = qty * price;
      item.taxableValue = taxable;

      if (isIntraState) {
        item.cgst = Math.round((taxable * (rate / 2)) / 100);
        item.sgst = Math.round((taxable * (rate / 2)) / 100);
        item.igst = 0;
      } else {
        item.cgst = 0;
        item.sgst = 0;
        item.igst = Math.round((taxable * rate) / 100);
      }

      item.total = taxable + item.cgst + item.sgst + item.igst;
      updated[index] = item;
      return updated;
    });
  };

  const addItem = () => {
    const newItem: InvoiceLineItem = {
      id: `item-${Date.now()}`,
      description: 'Professional Advisory & Technical Consulting',
      hsnSac: '998311',
      quantity: 1,
      unitPrice: 35000,
      gstRate: 18,
      taxableValue: 35000,
      cgst: isIntraState ? 3150 : 0,
      sgst: isIntraState ? 3150 : 0,
      igst: isIntraState ? 0 : 6300,
      total: 41300
    };
    setItems([...items, newItem]);
  };

  const removeItem = (index: number) => {
    if (items.length <= 1) return;
    setItems(items.filter((_, i) => i !== index));
  };

  const invoiceSubtotal = items.reduce((s, i) => s + i.taxableValue, 0);
  const invoiceTaxTotal = items.reduce((s, i) => s + (i.cgst + i.sgst + i.igst), 0);
  const invoiceGrandTotal = invoiceSubtotal + invoiceTaxTotal;

  const handleDownloadInvoice = () => {
    const invoicePayload = {
      invoiceNumber,
      invoiceDate,
      placeOfSupply,
      customerName,
      customerGSTIN,
      customerAddress,
      customerState,
      items
    };
    const doc = exportInvoicePDF(invoicePayload, currentProfile);
    doc.save(`${invoiceNumber}.pdf`);

    addVaultDocument({
      title: `Tax Invoice ${invoiceNumber} (${customerName})`,
      category: 'Invoices',
      fileType: 'PDF',
      associatedBusiness: currentProfile.businessName,
      fileSize: '94 KB',
      dataSummary: `Billed to ${customerName} • Grand Total: ${formatINR(invoiceGrandTotal)}`
    });
  };

  // ---------------- AGREEMENT GENERATOR STATE ----------------
  const [agreementType, setAgreementType] = useState('Non-Disclosure Agreement (NDA)');
  const [party1, setParty1] = useState(currentProfile.businessName);
  const [party2, setParty2] = useState('Acme Ventures & Partners Private Limited');
  const [purpose, setPurpose] = useState('Exploring strategic commercial partnership, technology evaluation, and software IP licensing');
  const [duration, setDuration] = useState('2 Years from the Effective Date');
  const [jurisdiction, setJurisdiction] = useState('Hyderabad, Telangana, India');
  const [copied, setCopied] = useState(false);

  // Generate editable agreement text
  const generateAgreementContent = () => {
    return `MUTUAL NON-DISCLOSURE AND CONFIDENTIALITY AGREEMENT

This Mutual Non-Disclosure Agreement ("Agreement") is made and entered into on this 14th day of November, 2026, by and between:

1. ${party1}, a company incorporated under the laws of India, having its principal place of business at Hyderabad, Telangana (hereinafter referred to as the "Disclosing Party");
AND
2. ${party2}, a company incorporated under applicable laws, having its principal office at its registered corporate premises (hereinafter referred to as the "Receiving Party").

RECITALS:
WHEREAS, the Parties wish to explore and evaluate a prospective commercial engagement regarding ${purpose} (the "Authorized Purpose"); and
WHEREAS, in connection with discussions regarding the Authorized Purpose, the Parties may disclose proprietary business, technical, operational, and financial information to one another.

NOW, THEREFORE, the Parties agree to the following terms:

1. DEFINITION OF CONFIDENTIAL INFORMATION:
"Confidential Information" shall mean all non-public, proprietary information disclosed by either Party to the other, whether orally, in writing, electronically, or by inspection of tangible objects, including but not limited to source code, algorithms, business models, financial projections, customer rosters, compliance methodologies, and product roadmaps.

2. OBLIGATIONS OF RECEIVING PARTY:
The Receiving Party agrees:
(a) To maintain all Confidential Information in strict confidence using at least the same degree of care it uses for its own sensitive data, but not less than reasonable care;
(b) Not to disclose or distribute any Confidential Information to third parties without prior express written approval;
(c) To restrict internal access solely to its bona fide officers, directors, and legal advisors who have a strict need to know.

3. EXCLUSIONS FROM CONFIDENTIAL INFORMATION:
Confidential obligations shall not apply to information that:
(i) Was already in the public domain prior to disclosure;
(ii) Becomes publicly known through no breach of this Agreement;
(iii) Is independently created by the Receiving Party without reference to the Disclosing Party's materials.

4. TERM AND DURATION:
The obligations under this Agreement shall remain in full force and effect for a period of ${duration}.

5. GOVERNING LAW AND DISPUTE RESOLUTION:
This Agreement shall be governed, construed, and enforced exclusively in accordance with the substantive laws of India. Any disputes arising hereunder shall be submitted to the exclusive jurisdiction of the competent courts in ${jurisdiction}.

IN WITNESS WHEREOF, the duly authorized representatives of the Parties have executed this draft Agreement on the date first written above.`;
  };

  const [agreementBody, setAgreementBody] = useState(generateAgreementContent());

  const handleDownloadAgreement = () => {
    const doc = exportAgreementPDF(
      agreementType,
      { party1, party2, jurisdiction, duration },
      agreementBody,
      currentProfile
    );
    doc.save(`${agreementType.replace(/[^a-zA-Z0-9]/g, '_')}_Draft.pdf`);

    addVaultDocument({
      title: `${agreementType} Draft (${party2})`,
      category: 'Agreements',
      fileType: 'PDF',
      associatedBusiness: currentProfile.businessName,
      fileSize: '112 KB',
      dataSummary: `Executed between ${party1} and ${party2} • Term: ${duration}`
    });
  };

  const handleCopyAgreement = () => {
    navigator.clipboard.writeText(agreementBody);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <div className="space-y-8 animate-fadeIn pb-12">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 rounded-2xl bg-gradient-to-r from-[#12151D] via-[#0D0F15] to-[#181C26] border border-white/10">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold text-[#B69AFF]">
            <Sparkles className="w-3.5 h-3.5 text-[#9466FF]" />
            <span>Automated Document Generation Engine</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white font-display tracking-tight mt-1 flex items-center gap-2.5">
            <Layers className="w-7 h-7 text-[#9466FF]" />
            <span>Document Studio</span>
          </h1>
          <p className="text-xs sm:text-sm text-[#9295A5] mt-1">
            Generate compliant GST tax invoices, commercial agreements, and statutory legal drafts in seconds.
          </p>
        </div>

        {/* Tab Switcher */}
        <div className="flex items-center p-1 rounded-xl bg-[#08090D] border border-white/10 text-xs">
          <button
            onClick={() => setActiveTab('invoice')}
            className={`px-4 py-2 rounded-lg font-semibold transition-all flex items-center gap-2 ${
              activeTab === 'invoice'
                ? 'bg-[#9466FF] text-white shadow-glow'
                : 'text-[#9295A5] hover:text-white'
            }`}
          >
            <Receipt className="w-4 h-4" />
            <span>Tax Invoice Generator</span>
          </button>

          <button
            onClick={() => setActiveTab('agreements')}
            className={`px-4 py-2 rounded-lg font-semibold transition-all flex items-center gap-2 ${
              activeTab === 'agreements'
                ? 'bg-[#9466FF] text-white shadow-glow'
                : 'text-[#9295A5] hover:text-white'
            }`}
          >
            <FileText className="w-4 h-4" />
            <span>Agreement Studio</span>
          </button>
        </div>
      </div>

      {/* TAB 1: TAX INVOICE GENERATOR */}
      {activeTab === 'invoice' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left 7 Cols: Invoice Form Controls */}
          <div className="lg:col-span-7 bg-[#0D0F15] rounded-2xl border border-white/10 p-6 space-y-6">
            <div className="flex items-center justify-between border-b border-white/10 pb-4">
              <div>
                <h3 className="text-base font-bold text-white font-display">Invoice Parameters</h3>
                <p className="text-xs text-[#9295A5]">Compliant with Section 31 of the CGST Act 2017.</p>
              </div>
              <span className="text-[11px] px-2.5 py-1 rounded-full bg-emerald-500/15 text-emerald-400 font-mono">
                {isIntraState ? 'Intra-State (CGST + SGST)' : 'Inter-State (IGST)'}
              </span>
            </div>

            {/* Document Details Row */}
            <div className="grid grid-cols-3 gap-3">
              <div>
                <label className="block text-[11px] font-medium text-[#9295A5] mb-1">Invoice Number</label>
                <input
                  type="text"
                  value={invoiceNumber}
                  onChange={(e) => setInvoiceNumber(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-[#12151D] border border-white/10 text-white text-xs font-mono focus:outline-none focus:border-[#9466FF]"
                />
              </div>

              <div>
                <label className="block text-[11px] font-medium text-[#9295A5] mb-1">Invoice Date</label>
                <input
                  type="date"
                  value={invoiceDate}
                  onChange={(e) => setInvoiceDate(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-[#12151D] border border-white/10 text-white text-xs focus:outline-none focus:border-[#9466FF]"
                />
              </div>

              <div>
                <label className="block text-[11px] font-medium text-[#9295A5] mb-1">Place of Supply</label>
                <select
                  value={placeOfSupply}
                  onChange={(e) => setPlaceOfSupply(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-[#12151D] border border-white/10 text-white text-xs focus:outline-none focus:border-[#9466FF]"
                >
                  <option value="36-Telangana">36-Telangana (Intra-State)</option>
                  <option value="29-Karnataka">29-Karnataka (Inter-State)</option>
                  <option value="27-Maharashtra">27-Maharashtra (Inter-State)</option>
                  <option value="07-Delhi">07-Delhi (Inter-State)</option>
                  <option value="33-Tamil Nadu">33-Tamil Nadu (Inter-State)</option>
                </select>
              </div>
            </div>

            {/* Customer Details */}
            <div className="space-y-3 pt-2">
              <h4 className="text-xs font-bold text-white uppercase tracking-wider font-mono">
                Customer (Billed To)
              </h4>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-medium text-[#9295A5] mb-1">Client Legal Name</label>
                  <input
                    type="text"
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-[#12151D] border border-white/10 text-white text-xs focus:outline-none focus:border-[#9466FF]"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-medium text-[#9295A5] mb-1">Customer GSTIN</label>
                  <input
                    type="text"
                    value={customerGSTIN}
                    onChange={(e) => setCustomerGSTIN(e.target.value)}
                    placeholder="15-character GSTIN"
                    className="w-full px-3 py-2 rounded-xl bg-[#12151D] border border-white/10 text-white text-xs font-mono focus:outline-none focus:border-[#9466FF]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-medium text-[#9295A5] mb-1">Billing Address</label>
                <input
                  type="text"
                  value={customerAddress}
                  onChange={(e) => setCustomerAddress(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-[#12151D] border border-white/10 text-white text-xs focus:outline-none focus:border-[#9466FF]"
                />
              </div>
            </div>

            {/* Line Items Section */}
            <div className="space-y-3 pt-2">
              <div className="flex items-center justify-between">
                <h4 className="text-xs font-bold text-white uppercase tracking-wider font-mono">
                  Line Items & Supplies
                </h4>
                <button
                  type="button"
                  onClick={addItem}
                  className="px-2.5 py-1 rounded-lg bg-[#9466FF]/20 text-[#B69AFF] hover:bg-[#9466FF]/30 text-xs font-semibold flex items-center gap-1 transition-colors"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add Line Item</span>
                </button>
              </div>

              <div className="space-y-3">
                {items.map((item, idx) => (
                  <div key={item.id} className="p-3.5 rounded-xl bg-[#12151D] border border-white/5 space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-[11px] font-bold text-white">Item #{idx + 1}</span>
                      {items.length > 1 && (
                        <button
                          onClick={() => removeItem(idx)}
                          className="text-rose-400 hover:text-rose-300 p-1"
                          title="Remove Item"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>

                    <div className="grid grid-cols-12 gap-2">
                      <div className="col-span-6">
                        <label className="block text-[10px] text-[#9295A5]">Description</label>
                        <input
                          type="text"
                          value={item.description}
                          onChange={(e) => handleItemChange(idx, 'description', e.target.value)}
                          className="w-full px-2.5 py-1.5 rounded-lg bg-black/40 border border-white/10 text-white text-xs"
                        />
                      </div>
                      <div className="col-span-2">
                        <label className="block text-[10px] text-[#9295A5]">HSN/SAC</label>
                        <input
                          type="text"
                          value={item.hsnSac}
                          onChange={(e) => handleItemChange(idx, 'hsnSac', e.target.value)}
                          className="w-full px-2.5 py-1.5 rounded-lg bg-black/40 border border-white/10 text-white text-xs font-mono"
                        />
                      </div>
                      <div className="col-span-2">
                        <label className="block text-[10px] text-[#9295A5]">Qty</label>
                        <input
                          type="number"
                          min="1"
                          value={item.quantity}
                          onChange={(e) => handleItemChange(idx, 'quantity', e.target.value)}
                          className="w-full px-2.5 py-1.5 rounded-lg bg-black/40 border border-white/10 text-white text-xs"
                        />
                      </div>
                      <div className="col-span-2">
                        <label className="block text-[10px] text-[#9295A5]">Rate (₹)</label>
                        <input
                          type="number"
                          value={item.unitPrice}
                          onChange={(e) => handleItemChange(idx, 'unitPrice', e.target.value)}
                          className="w-full px-2.5 py-1.5 rounded-lg bg-black/40 border border-white/10 text-white text-xs"
                        />
                      </div>
                    </div>

                    <div className="flex items-center justify-between text-xs pt-1 border-t border-white/5">
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] text-[#9295A5]">GST Slab:</span>
                        <select
                          value={item.gstRate}
                          onChange={(e) => handleItemChange(idx, 'gstRate', e.target.value)}
                          className="px-2 py-0.5 rounded bg-black/40 border border-white/10 text-xs text-white"
                        >
                          <option value="5">5%</option>
                          <option value="12">12%</option>
                          <option value="18">18%</option>
                          <option value="28">28%</option>
                        </select>
                      </div>

                      <div className="text-right">
                        <span className="text-[11px] text-[#9295A5] mr-2">Tax: {formatINR(item.cgst + item.sgst + item.igst)}</span>
                        <span className="font-bold text-white">Line Total: {formatINR(item.total)}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <button
              onClick={handleDownloadInvoice}
              className="w-full py-3.5 rounded-xl bg-gradient-to-r from-[#9466FF] to-[#6C8FFF] hover:opacity-95 text-white font-semibold text-xs sm:text-sm shadow-glow transition-all flex items-center justify-center gap-2"
            >
              <Download className="w-4 h-4" />
              <span>Download Tax Invoice PDF</span>
            </button>
          </div>

          {/* Right 5 Cols: Live Invoice Visual Preview */}
          <div className="lg:col-span-5 bg-[#0D0F15] rounded-2xl border border-white/10 p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <h3 className="text-sm font-bold text-white font-display">Live Invoice Preview</h3>
              <span className="text-[10px] px-2 py-0.5 rounded bg-white/5 text-[#9295A5] font-mono">
                {invoiceNumber}
              </span>
            </div>

            {/* Simulated Paper Invoice Card */}
            <div className="p-5 rounded-xl bg-[#12151D] border border-white/5 space-y-4 text-xs">
              <div className="flex items-start justify-between border-b border-white/5 pb-3">
                <div>
                  <h4 className="font-bold text-white">{currentProfile.businessName}</h4>
                  <p className="text-[10px] text-[#9295A5]">GSTIN: {currentProfile.gstin || SAMPLE_SUPPLIER_GSTIN}</p>
                  <p className="text-[10px] text-[#9295A5]">State: {currentProfile.locationState}</p>
                </div>
                <div className="text-right">
                  <span className="text-xs font-bold text-[#9466FF] block">TAX INVOICE</span>
                  <span className="text-[10px] text-gray-400 block">{invoiceDate}</span>
                </div>
              </div>

              <div>
                <p className="text-[10px] uppercase font-mono text-[#9295A5]">Billed To:</p>
                <p className="font-bold text-white">{customerName}</p>
                <p className="text-[10px] text-gray-400 font-mono">GSTIN: {customerGSTIN}</p>
                <p className="text-[10px] text-gray-400">Place of Supply: {placeOfSupply}</p>
              </div>

              {/* Items summary */}
              <div className="space-y-1.5 border-t border-white/5 pt-3">
                {items.map((it, i) => (
                  <div key={i} className="flex justify-between text-[11px]">
                    <span className="text-gray-300 truncate max-w-[200px]">{it.quantity}x {it.description}</span>
                    <span className="text-white font-mono">{formatINR(it.total)}</span>
                  </div>
                ))}
              </div>

              {/* Calculation Totals */}
              <div className="border-t border-white/10 pt-3 space-y-1 text-right">
                <div className="flex justify-between text-xs text-[#9295A5]">
                  <span>Taxable Subtotal:</span>
                  <span>{formatINR(invoiceSubtotal)}</span>
                </div>
                <div className="flex justify-between text-xs text-[#9295A5]">
                  <span>Tax ({isIntraState ? 'CGST + SGST' : 'IGST'}):</span>
                  <span className="text-[#B69AFF]">{formatINR(invoiceTaxTotal)}</span>
                </div>
                <div className="flex justify-between text-sm font-bold text-white pt-2 border-t border-white/5">
                  <span>Grand Total:</span>
                  <span className="text-emerald-400">{formatINR(invoiceGrandTotal)}</span>
                </div>
              </div>
            </div>

            <div className="p-3 rounded-xl bg-white/[0.02] border border-white/5 text-[11px] text-[#9295A5] flex items-center gap-2">
              <FileCheck className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>Complies with reverse charge and HSN mandatory disclosure clauses.</span>
            </div>
          </div>

        </div>
      )}

      {/* TAB 2: AGREEMENT STUDIO */}
      {activeTab === 'agreements' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left 5 Cols: Template Configuration */}
          <div className="lg:col-span-5 bg-[#0D0F15] rounded-2xl border border-white/10 p-6 space-y-5">
            <div>
              <h3 className="text-base font-bold text-white font-display">Agreement Templates</h3>
              <p className="text-xs text-[#9295A5]">Generate standard editable commercial agreements for startup operations.</p>
            </div>

            <div>
              <label className="block text-xs font-medium text-[#9295A5] mb-1.5">Agreement Type</label>
              <select
                value={agreementType}
                onChange={(e) => {
                  setAgreementType(e.target.value);
                  setTimeout(() => setAgreementBody(generateAgreementContent()), 50);
                }}
                className="w-full px-3 py-2.5 rounded-xl bg-[#12151D] border border-white/10 text-white text-xs focus:outline-none focus:border-[#9466FF]"
              >
                <option value="Non-Disclosure Agreement (NDA)">Non-Disclosure Agreement (Mutual NDA)</option>
                <option value="Master Service Agreement (MSA)">Master Service Agreement (MSA)</option>
                <option value="Independent Contractor Agreement">Freelance / Contractor Agreement</option>
                <option value="Founder Employment Agreement">Standard Employment Agreement</option>
                <option value="Advisory & Consulting Agreement">Advisory & Consulting Agreement</option>
                <option value="Partnership MOU">Commercial Partnership Agreement</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-medium text-[#9295A5] mb-1.5">First Party (Disclosing)</label>
              <input
                type="text"
                value={party1}
                onChange={(e) => setParty1(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-[#12151D] border border-white/10 text-white text-xs focus:outline-none focus:border-[#9466FF]"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-[#9295A5] mb-1.5">Second Party (Counterparty)</label>
              <input
                type="text"
                value={party2}
                onChange={(e) => setParty2(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-[#12151D] border border-white/10 text-white text-xs focus:outline-none focus:border-[#9466FF]"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-[#9295A5] mb-1.5">Authorized Purpose / Scope</label>
              <textarea
                rows={2}
                value={purpose}
                onChange={(e) => setPurpose(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-[#12151D] border border-white/10 text-white text-xs focus:outline-none focus:border-[#9466FF]"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-medium text-[#9295A5] mb-1.5">Duration</label>
                <input
                  type="text"
                  value={duration}
                  onChange={(e) => setDuration(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-[#12151D] border border-white/10 text-white text-xs focus:outline-none focus:border-[#9466FF]"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-[#9295A5] mb-1.5">Jurisdiction</label>
                <input
                  type="text"
                  value={jurisdiction}
                  onChange={(e) => setJurisdiction(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-[#12151D] border border-white/10 text-white text-xs focus:outline-none focus:border-[#9466FF]"
                />
              </div>
            </div>

            <div className="p-3.5 rounded-xl bg-amber-500/10 border border-amber-500/20 text-xs text-amber-300 flex items-start gap-2">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-amber-400" />
              <span>
                <strong>Legal Draft Notice:</strong> This agreement is a draft for review. Obtain appropriate legal advice before signing.
              </span>
            </div>
          </div>

          {/* Right 7 Cols: Editable Document Preview & Actions */}
          <div className="lg:col-span-7 bg-[#0D0F15] rounded-2xl border border-white/10 p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-white/10 pb-4">
              <div>
                <h3 className="text-base font-bold text-white font-display">Draft Agreement Editor</h3>
                <p className="text-xs text-[#9295A5]">You can directly edit clauses below before exporting.</p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={handleCopyAgreement}
                  className="px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-xs font-medium text-white border border-white/10 transition-colors flex items-center gap-1.5"
                >
                  {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5 text-[#B69AFF]" />}
                  <span>{copied ? 'Copied' : 'Copy Text'}</span>
                </button>

                <button
                  onClick={handleDownloadAgreement}
                  className="px-3.5 py-1.5 rounded-lg bg-gradient-to-r from-[#9466FF] to-[#6C8FFF] hover:opacity-95 text-xs font-semibold text-white shadow-glow transition-all flex items-center gap-1.5"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Download PDF Draft</span>
                </button>
              </div>
            </div>

            {/* Editable Content Body */}
            <textarea
              rows={18}
              value={agreementBody}
              onChange={(e) => setAgreementBody(e.target.value)}
              className="w-full p-4 rounded-xl bg-[#12151D] border border-white/10 text-gray-200 text-xs font-mono leading-relaxed focus:outline-none focus:border-[#9466FF] resize-y"
            />
          </div>

        </div>
      )}

    </div>
  );
};

