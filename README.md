# COMPLIO – AI-Powered Business Compliance & Document Automation Platform

> **Tagline:** *"Your business. Your obligations. Never miss a deadline."*

COMPLIO is an intelligent business compliance and document automation assistant designed to help Indian startup founders understand their statutory obligations, prepare essential tax and legal documents, reconcile GST registers, and stay ahead of filing deadlines.

---

## ⚡ Quick Start (Running Locally)

The application is running locally on your laptop:
👉 **[http://localhost:5173/](http://localhost:5173/)**

If you restart the dev server in any terminal:
```bash
cd c:\Users\bella\Desktop\buildathon
npm install
npm run dev
```

To create a production build:
```bash
npm run build
```

---

## 🏆 Four Core Capabilities

### 1. 📊 GST Automation Studio (Highest Priority Feature)
- **Multi-Step Guided Workflow:**
  1. **Upload Documents:** Client-side spreadsheet parser (`xlsx`) for `.xlsx`, `.xls`, and `.csv` sales registers and credit notes. Drag-and-drop dropzone with sample template download.
  2. **1-Click Sample Dataset:** `"Load Sample GST Data"` immediately loads **18 realistic records** (15 B2B invoices + 3 credit notes across Telangana, Karnataka, Maharashtra, Delhi, and Tamil Nadu).
  3. **Statutory Validation Engine:**
     - Duplicate invoice detection (flags duplicate `INV-2026-004`).
     - Missing Recipient GSTIN detection (flags unregistered B2B records).
     - Missing Credit Note original reference check (flags `CRN-2026-003`).
     - Place of Supply vs. Tax Type mismatch (verifies intra-state CGST+SGST vs. inter-state IGST).
     - Tax arithmetic reconciliation (detects manual rounding and rate mismatch errors).
  4. **Dynamic Net Tax Calculation:** Computes total gross taxable value, credit note deductions, net taxable value, CGST, SGST, IGST, and grand total tax liability across 5%, 12%, 18%, and 28% tax slabs.
  5. **Review Dashboard:** Comprehensive filterable audit table with record inspection drawer.
  6. **Export Suite:**
     - **GST Preparation Report PDF:** Professional multi-page report with business profile, tax breakdown, rate-wise slabs, and sample audit trail.
     - **Validated Data CSV:** Detailed register with all validation flags.
     - **Structured GST JSON Export:** Formatted schema clearly labeled: *"Demo structured GST export – not validated for direct GST portal upload."*

### 2. 🤖 AI Compliance Intelligence
- **Interactive Business Onboarding:** 7-step conversational interview assessing legal structure, state of incorporation, annual revenue scale, GST status, employee headcount, and foreign investment.
- **Deterministic Rules Database:** Evaluates MCA (Companies Act), GSTN, CBDT (Income Tax & TDS), EPFO/ESIC (Labour rules), and State Commercial Tax (Professional Tax) rules.
- **Transparent Classification:** Marks ambiguous thresholds with **"Needs CA Verification"** tags to prevent hallucination.
- **Contextual Knowledge Assistant:** Answers questions about GST returns, ROC filings, DIR-3 KYC, Section 80-IAC Startup India benefits, and penalty consequences.

### 3. 📄 Document Studio (Invoices & Agreements)
- **Tax Invoice Generator:**
  - Section 31 compliant B2B tax invoice generator.
  - Automatically splits tax into **CGST + SGST** (Intra-state) or **IGST** (Inter-state) based on Place of Supply.
  - Add/remove line items, customize HSN/SAC codes, and view a live invoice preview.
  - Generates and downloads a clean, printable PDF tax invoice.
- **Agreement Studio:**
  - 6 draft legal agreement templates: Mutual Non-Disclosure Agreement (NDA), Master Service Agreement (MSA), Contractor Agreement, Employment Agreement, Consulting Agreement, and Commercial MOU.
  - Customizable party details, purpose, duration, and governing jurisdiction.
  - In-browser editable clause text editor with copy-to-clipboard and formatted PDF draft export.

### 4. 🗄️ Document Vault & Deadline Management
- **Centralized Document Vault:** Stores all generated GST reports, tax invoices, and legal agreements with metadata persistence in `localStorage`.
- **Interactive Compliance Calendar:** Monthly grid and chronological list views with date inspection and status filtering.
- **Simulated Reminder Engine:** In-app notification center that triggers automated 7-day proactive deadline alerts.

---

## 🎭 Preconfigured Demo Personas

1. **Aarav Sharma** – *NovaTech Solutions Private Limited* (Primary Demo)
   - Hyderabad, Telangana • Private Limited Company • ₹40L–₹1Cr • 12 Employees • GST Registered
2. **Priya Patel** – *ArtisanKraft Studio*
   - Ahmedabad, Gujarat • Sole Proprietorship • ₹20–₹40L • 3 Employees • GST Registered
3. **Rohan Deshmukh** – *Vertex Global Advisory LLP*
   - Bengaluru, Karnataka • LLP • ₹1–₹5Cr • 24 Employees • Foreign Investment (FDI)

Switch profiles anytime using the top switcher or sidebar dropdown to see the compliance checklist and dashboard recalibrate in real time!

---

## 🎯 Suggested Demonstration Flow for Judges

1. **Landing Page:** Walk through the value proposition, the 4 floating document previews (GST Summary, Invoice, Agreement, Calendar), the problem statement, and 4-step workflow.
2. **One-Click Demo Entry:** Choose **NovaTech Solutions Pvt Ltd** to enter the dashboard.
3. **Dashboard Overview:** Highlight the 82% Compliance Health Score, upcoming deadlines, the **Document Automation Overview** cards, and recent document activity.
4. **GST Automation Studio (Core Feature):**
   - Click **"GST Automation"** in the sidebar.
   - Click **"Load Sample GST Data"** to watch the processing animation extract 18 records.
   - Show the **Validation Attention Banner** highlighting duplicate invoice `INV-2026-004` and missing recipient GSTINs.
   - Inspect the **Tax Component Split** (CGST, SGST, IGST) and **Tax Rate-Wise Aggregation**.
   - Click **"Download GST Preparation PDF"** to demonstrate client-side PDF generation.
   - Click **"Export JSON"** and note the clear statutory disclaimer label.
5. **Document Studio:**
   - Click **"Document Studio"** in the sidebar.
   - Show how changing the Place of Supply between Telangana and Karnataka automatically switches the tax calculation between CGST+SGST and IGST.
   - Click **"Download Tax Invoice PDF"**.
   - Switch to **"Agreement Studio"**, select Mutual NDA, edit the purpose, and click **"Download PDF Draft"**.
6. **Document Vault:**
   - Open **"Document Vault"** to show all newly generated files cataloged with metadata and download actions.
7. **AI Assistant & Onboarding:**
   - Ask: *"Prepare my GST summary"* or click *"🚀 What compliances apply to my business?"* to demonstrate the 7-step conversational interview and rule calibration.
8. **Compliance Calendar & Tasks:**
   - Open **"My Compliance"**, click on GSTR-3B to open the detail drawer, click **"Prepare Document"** to show seamless navigation, and mark a task as completed to trigger celebratory confetti and live dashboard updates.

---

## 🔒 Legal Disclaimer
COMPLIO is a decision-support and document-preparation tool. It does not replace professional CA, tax or legal advice. All regulatory requirements, penalties and due dates must be verified with official authorities and a qualified professional.
