export interface QAPair {
  keywords: string[];
  title: string;
  response: string;
}

export const AI_KNOWLEDGE_BASE: QAPair[] = [
  {
    keywords: ['gst', 'goods and services tax', 'what is gst', 'gst return', 'gstr'],
    title: 'Goods and Services Tax (GST)',
    response: 'GST stands for Goods and Services Tax. It is a comprehensive, multi-stage, destination-based indirect tax levied on every value addition in India.\n\nKey takeaways for startups:\n• Mandatory registration if turnover exceeds ₹20 Lakhs (services) or ₹40 Lakhs (goods), or for inter-state e-commerce sellers.\n• Regular filings include GSTR-1 (sales details) and GSTR-3B (monthly tax computation and ITC).\n• Failure to file blocks Input Tax Credit (ITC) for your enterprise customers!'
  },
  {
    keywords: ['roc', 'mca', 'roc filing', 'registrar of companies', 'annual filing', 'aoc 4', 'mgt 7'],
    title: 'ROC & Ministry of Corporate Affairs (MCA) Filings',
    response: 'ROC stands for Registrar of Companies. Companies and LLPs incorporated under the Companies Act 2013 have mandatory annual filing obligations with the Ministry of Corporate Affairs (MCA).\n\nKey forms include:\n• Form AOC-4: Audited Balance Sheet, P&L Account, and Directors’ Report (due within 30 days of AGM).\n• Form MGT-7: Annual Return of company shareholding & directorship details (due within 60 days of AGM).\n• Late filing attracts a statutory penalty of ₹100 per day of continuous delay without any maximum ceiling.'
  },
  {
    keywords: ['pf', 'epf', 'provident fund', 'epfo', 'employee provident fund'],
    title: 'Employees’ Provident Fund (EPF)',
    response: 'Employees’ Provident Fund (EPF) is a statutory retirement benefit scheme governed by EPFO for salaried employees.\n\nRules for startups:\n• Mandatory once your total headcount reaches 20 or more employees.\n• Total contribution is 24% of basic wages + DA (12% deducted from employee salary, 12% paid by employer).\n• Even below 20 employees, startups can register voluntarily to attract senior talent.'
  },
  {
    keywords: ['miss', 'deadline', 'late', 'penalty', 'what happens if i miss'],
    title: 'Consequences of Missing Compliance Deadlines',
    response: 'Missing a statutory compliance deadline can trigger compound consequences:\n\n1. Monetary Late Fees: Recurring daily fines (e.g. ₹50/day for GST, ₹100/day for MCA, ₹200/day for TDS).\n2. Interest Penalties: Statutory interest (typically 12% to 18% p.a.) on unpaid taxes.\n3. Operational Lockout: Deactivation of Director Identification Number (DIN) or suspension of GST portal e-way bill generation.\n4. Investor Red Flags: Unresolved defaults show up during Series-A due diligence and will delay fundraising.\n\n*Note: In COMPLIO, all listed dates and penalties are illustrative demo models to support planning—always verify statutory provisions with your qualified CA.*'
  },
  {
    keywords: ['dir 3', 'dir3', 'kyc', 'director kyc', 'din'],
    title: 'DIR-3 KYC for Directors',
    response: 'DIR-3 KYC is an annual verification mandated by the MCA for all individuals holding a Director Identification Number (DIN) or Designated Partner ID.\n\n• For first-time DIN holders, e-form DIR-3 KYC with OTP verification and CA digital signature is required.\n• For directors whose details haven’t changed, a simple web-service OTP confirmation suffices.\n• Deactivation of DIN occurs if not filed, with a standard ₹5,000 late reactivation fee.'
  },
  {
    keywords: ['pt', 'professional tax', 'ptrc', 'ptec'],
    title: 'Professional Tax (PT)',
    response: 'Professional Tax is a state-level statutory tax levied on professions, employment, and trades.\n\n• It is governed by individual state legislation (e.g. Telangana, Maharashtra, Karnataka, Tamil Nadu enforce PT; Delhi currently does not).\n• PTEC (Professional Tax Enrolment Certificate) is paid by the company on its own entity.\n• PTRC (Registration Certificate) is deducted monthly from employees earning above the state threshold and remitted to state commercial tax offices.'
  },
  {
    keywords: ['advance tax', 'tax instalment', 'cbdt', 'income tax'],
    title: 'Advance Tax Instalments',
    response: 'Advance tax is the payment of income tax in instalments throughout the financial year rather than a lump sum at year-end.\n\n• Mandatory if estimated tax payable after TDS credits exceeds ₹10,000 in a financial year.\n• Paid in 4 quarterly instalments: June 15 (15%), September 15 (45%), December 15 (75%), and March 15 (100%).\n• Shortfalls incur interest penalties under Sections 234B and 234C.'
  },
  {
    keywords: ['dpiit', 'startup india', 'seed fund', '80iac', 'angel tax'],
    title: 'Startup India / DPIIT Recognition',
    response: 'DPIIT (Department for Promotion of Industry and Internal Trade) recognition certifies your business as an innovative startup under the Startup India initiative.\n\nKey Benefits:\n• Eligibility for 3-year 100% tax holiday under Section 80-IAC (subject to Inter-Ministerial Board approval).\n• Exemption from Angel Tax provisions (Section 56(2)(viib)).\n• Fast-tracked 80% rebate on patent filings and 50% rebate on trademark filings.\n• Easier procurement norms in government tenders.'
  },
  {
    keywords: ['foreign', 'fdi', 'fema', 'rbi', 'fla', 'fcgpr'],
    title: 'Foreign Investment & FEMA Regulations',
    response: 'If your startup receives foreign direct investment (FDI) or venture capital from international investors:\n\n• Form FC-GPR must be filed on the RBI FIRMS portal within 30 days of equity share allotment.\n• Annual Return on Foreign Liabilities and Assets (FLA) must be submitted annually by July 15 directly to the Reserve Bank of India.\n• Non-compliance requires costly compounding procedures under Section 13 of FEMA 1999.'
  }
];

export const getAIResponseForPrompt = (prompt: string): string => {
  const normalized = prompt.toLowerCase().trim();

  for (const item of AI_KNOWLEDGE_BASE) {
    if (item.keywords.some(k => normalized.includes(k))) {
      return item.response;
    }
  }

  // Fallback intelligent response
  return `Thank you for asking about "${prompt}". 

While this specific term is not in my rapid reference index, COMPLIO's rule engine evaluates compliance obligations based on statutory triggers (entity structure, turnover, headcount, and interstate commerce). 

**Recommendation:**
1. Check whether this relates to direct taxes (CBDT), indirect taxes (GSTN), corporate filing (MCA), or state labor laws.
2. Because this is a decision-support demonstration, please consult with your practicing Chartered Accountant (CA) or Company Secretary (CS) to review specific statutory notifications applicable to your business.

Would you like me to walk through your business profile to check which standard compliances apply?`;
};

