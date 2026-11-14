export type BusinessType = 'Private Limited Company' | 'LLP' | 'Partnership' | 'Sole Proprietorship';
export type TurnoverRange = 'Below ₹20 lakh' | '₹20–40 lakh' | '₹40 lakh–₹1 crore' | '₹1–5 crore' | 'Above ₹5 crore';
export type ForeignInvestmentStatus = 'Yes' | 'No' | 'Not sure';

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  businessName: string;
  locationState: string;
  businessType: BusinessType;
  turnoverRange: TurnoverRange;
  gstRegistered: boolean;
  gstin?: string;
  employeeCount: number;
  foreignInvestment: ForeignInvestmentStatus;
  avatarInitials: string;
  remindersEnabled: boolean;
  reminderDaysBefore: number;
}

export type ComplianceCategory = 
  | 'Tax & GST' 
  | 'Corporate & MCA' 
  | 'Labour & Employment' 
  | 'Registrations & Licences' 
  | 'Startup & Banking';

export type ComplianceStatus = 'completed' | 'pending' | 'overdue' | 'needs_ca_verification';
export type CompliancePriority = 'high' | 'medium' | 'low';
export type ComplianceFrequency = 'Monthly' | 'Quarterly' | 'Annual' | 'One-time' | 'Event-based';

export interface ComplianceItem {
  id: string;
  name: string;
  category: ComplianceCategory;
  description: string;
  applicabilityReason: string;
  responsibleAuthority: string;
  dueDate: string; // ISO date string YYYY-MM-DD
  dueDaysRemaining: number;
  status: ComplianceStatus;
  priority: CompliancePriority;
  frequency: ComplianceFrequency;
  samplePenalty: string;
  sourceUrl: string;
  isVerified: boolean; // false if requires CA verification
  completedAt?: string;
  lastFilingDate?: string;
  riskLevel: 'high' | 'medium' | 'low';
}

export interface NotificationItem {
  id: string;
  title: string;
  message: string;
  type: 'warning' | 'info' | 'success' | 'danger';
  timestamp: string;
  read: boolean;
  complianceId?: string;
}

export interface ChatMessage {
  id: string;
  sender: 'user' | 'ai';
  text: string;
  timestamp: string;
  options?: string[];
  generatedChecklist?: ComplianceItem[];
  step?: string;
}

export interface ComplianceSummary {
  healthScore: number;
  total: number;
  completed: number;
  pending: number;
  overdue: number;
  needsVerification: number;
  dueWithin7Days: number;
  dueWithin30Days: number;
}

// ---------------- GST & DOCUMENT AUTOMATION TYPES ----------------

export type DocumentType = 'B2B Invoice' | 'Credit Note' | 'Debit Note';

export interface GSTRecord {
  id: string;
  docType: DocumentType;
  invoiceNumber: string;
  invoiceDate: string;
  supplierGSTIN: string;
  recipientGSTIN: string;
  recipientName: string;
  placeOfSupply: string;
  taxableValue: number;
  gstRate: number;
  cgst: number;
  sgst: number;
  igst: number;
  totalAmount: number;
  originalInvoiceRef?: string;
  validationStatus: 'valid' | 'warning' | 'error';
  validationIssues: string[];
}

export interface GSTSummaryData {
  totalRecords: number;
  b2bCount: number;
  creditNoteCount: number;
  debitNoteCount: number;
  validCount: number;
  warningCount: number;
  errorCount: number;
  totalTaxableValue: number;
  totalCGST: number;
  totalSGST: number;
  totalIGST: number;
  totalTax: number;
  netAdjustments: number;
  rateWise: {
    rate: number;
    taxable: number;
    cgst: number;
    sgst: number;
    igst: number;
    totalTax: number;
    recordCount: number;
  }[];
  recipientWise: {
    gstin: string;
    name: string;
    count: number;
    taxable: number;
    totalTax: number;
  }[];
}

export type DocumentCategory = 
  | 'GST Reports' 
  | 'Invoices' 
  | 'Credit Notes' 
  | 'Agreements' 
  | 'Other Compliance Documents';

export interface VaultDocument {
  id: string;
  title: string;
  category: DocumentCategory;
  fileType: 'PDF' | 'CSV' | 'XLSX' | 'JSON';
  generatedDate: string;
  associatedBusiness: string;
  fileSize: string;
  dataSummary?: string;
  downloadData?: string; // base64 or raw text for direct download
  mimeType?: string;
}

export interface InvoiceLineItem {
  id: string;
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
}
