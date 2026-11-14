import { UserProfile, ComplianceItem, ComplianceStatus } from '../types';

export interface RuleDefinition {
  id: string;
  name: string;
  category: ComplianceItem['category'];
  description: string;
  responsibleAuthority: string;
  frequency: ComplianceItem['frequency'];
  priority: ComplianceItem['priority'];
  samplePenalty: string;
  sourceUrl: string;
  defaultDueDayOffset: number; // days from now for demo date calculation
  evaluateApplicability: (profile: UserProfile) => {
    isApplicable: boolean;
    reason: string;
    requiresVerification: boolean;
    status: ComplianceStatus;
    riskLevel: 'high' | 'medium' | 'low';
  };
}

// Generate demo ISO date string based on relative days
export const getDemoDateString = (dayOffset: number): string => {
  const target = new Date();
  target.setDate(target.getDate() + dayOffset);
  return target.toISOString().split('T')[0];
};

export const MASTER_COMPLIANCE_RULES: RuleDefinition[] = [
  {
    id: 'gst-gstr3b',
    name: 'GSTR-3B Monthly Summary Return',
    category: 'Tax & GST',
    description: 'Mandatory self-declared summary return detailing summary of outward supplies, input tax credit (ITC) claimed, and tax payment for the month.',
    responsibleAuthority: 'Goods and Services Tax Network (GSTN) / CBIC',
    frequency: 'Monthly',
    priority: 'high',
    samplePenalty: 'Illustrative demo penalty: ₹50/day (₹20 for NIL return) up to maximum ₹10,000 + 18% annual interest on unpaid tax.',
    sourceUrl: 'https://www.gst.gov.in',
    defaultDueDayOffset: 6, // 6 days remaining
    evaluateApplicability: (profile) => {
      if (profile.gstRegistered) {
        return {
          isApplicable: true,
          reason: `Applicable because ${profile.businessName} is registered under GST. Monthly tax liability must be settled.`,
          requiresVerification: false,
          status: 'pending',
          riskLevel: 'high'
        };
      }
      if (profile.turnoverRange !== 'Below ₹20 lakh') {
        return {
          isApplicable: true,
          reason: `Turnover (${profile.turnoverRange}) exceeds the ₹20L/₹40L threshold. GST registration and subsequent monthly filing is likely mandatory.`,
          requiresVerification: true,
          status: 'needs_ca_verification',
          riskLevel: 'high'
        };
      }
      return {
        isApplicable: false,
        reason: 'Not applicable: Turnover is below threshold and entity is not GST registered.',
        requiresVerification: false,
        status: 'pending',
        riskLevel: 'low'
      };
    }
  },
  {
    id: 'gst-gstr1',
    name: 'GSTR-1 Outward Supplies Statement',
    category: 'Tax & GST',
    description: 'Statement of outward supplies of goods and services containing invoice-level details to enable recipient input tax credit matching.',
    responsibleAuthority: 'GSTN / Central Board of Indirect Taxes & Customs',
    frequency: 'Monthly',
    priority: 'high',
    samplePenalty: 'Illustrative demo penalty: ₹50/day late fee for delayed filing; blocks downstream buyers from claiming input tax credit.',
    sourceUrl: 'https://www.gst.gov.in',
    defaultDueDayOffset: -3, // 3 days overdue to demonstrate overdue state
    evaluateApplicability: (profile) => {
      if (profile.gstRegistered) {
        return {
          isApplicable: true,
          reason: `Mandatory for all GST registered entities to report monthly sales and outward supplies.`,
          requiresVerification: false,
          status: 'overdue', // simulated demo overdue
          riskLevel: 'high'
        };
      }
      return {
        isApplicable: false,
        reason: 'Not registered under GST.',
        requiresVerification: false,
        status: 'pending',
        riskLevel: 'low'
      };
    }
  },
  {
    id: 'mca-aoc4',
    name: 'MCA Form AOC-4 (Financial Statements)',
    category: 'Corporate & MCA',
    description: 'Filing of audited financial statements, balance sheet, profit and loss account, and board report with the Registrar of Companies.',
    responsibleAuthority: 'Ministry of Corporate Affairs (MCA) / ROC',
    frequency: 'Annual',
    priority: 'high',
    samplePenalty: 'Illustrative demo penalty: ₹100 per day of continuous default for company + penal fines on directors under Section 137.',
    sourceUrl: 'https://www.mca.gov.in',
    defaultDueDayOffset: 16,
    evaluateApplicability: (profile) => {
      if (profile.businessType === 'Private Limited Company') {
        return {
          isApplicable: true,
          reason: `Every Private Limited Company incorporated under the Companies Act 2013 must file audited financials within 30 days of AGM.`,
          requiresVerification: false,
          status: 'pending',
          riskLevel: 'medium'
        };
      }
      return {
        isApplicable: false,
        reason: `${profile.businessType} does not require Form AOC-4 (applicable only to registered companies).`,
        requiresVerification: false,
        status: 'pending',
        riskLevel: 'low'
      };
    }
  },
  {
    id: 'mca-mgt7',
    name: 'MCA Form MGT-7A / MGT-7 (Annual Return)',
    category: 'Corporate & MCA',
    description: 'Annual return filed with the Registrar of Companies containing details of shareholding structure, directorship changes, and management.',
    responsibleAuthority: 'Ministry of Corporate Affairs (MCA)',
    frequency: 'Annual',
    priority: 'medium',
    samplePenalty: 'Illustrative demo penalty: ₹100 per day of delay without any maximum ceiling under Companies Act.',
    sourceUrl: 'https://www.mca.gov.in',
    defaultDueDayOffset: 34,
    evaluateApplicability: (profile) => {
      if (profile.businessType === 'Private Limited Company') {
        return {
          isApplicable: true,
          reason: `Annual filing mandatory for private companies within 60 days of holding the Annual General Meeting (AGM).`,
          requiresVerification: false,
          status: 'pending',
          riskLevel: 'medium'
        };
      }
      return {
        isApplicable: false,
        reason: 'Only applicable to companies registered under the Companies Act.',
        requiresVerification: false,
        status: 'pending',
        riskLevel: 'low'
      };
    }
  },
  {
    id: 'llp-form11',
    name: 'LLP Form 11 (Annual Return of LLP)',
    category: 'Corporate & MCA',
    description: 'Annual return containing statement of partners, business activities, and management for Limited Liability Partnerships.',
    responsibleAuthority: 'Ministry of Corporate Affairs (MCA)',
    frequency: 'Annual',
    priority: 'high',
    samplePenalty: 'Illustrative demo penalty: ₹100 per day till default continues under LLP Act 2008.',
    sourceUrl: 'https://www.mca.gov.in',
    defaultDueDayOffset: 25,
    evaluateApplicability: (profile) => {
      if (profile.businessType === 'LLP') {
        return {
          isApplicable: true,
          reason: `Applicable to ${profile.businessName} as a registered Limited Liability Partnership. Due annually by May 30.`,
          requiresVerification: false,
          status: 'pending',
          riskLevel: 'medium'
        };
      }
      return {
        isApplicable: false,
        reason: 'Applicable solely to Limited Liability Partnerships (LLP).',
        requiresVerification: false,
        status: 'pending',
        riskLevel: 'low'
      };
    }
  },
  {
    id: 'mca-dir3-kyc',
    name: 'DIR-3 KYC (Director Identification Verification)',
    category: 'Corporate & MCA',
    description: 'Annual electronic KYC verification for every individual who holds a Director Identification Number (DIN) or Designated Partner DIN.',
    responsibleAuthority: 'Ministry of Corporate Affairs (MCA)',
    frequency: 'Annual',
    priority: 'medium',
    samplePenalty: 'Illustrative demo penalty: Deactivation of DIN + ₹5,000 late fee for reactivation after due date.',
    sourceUrl: 'https://www.mca.gov.in',
    defaultDueDayOffset: -60, // previously completed
    evaluateApplicability: (profile) => {
      if (profile.businessType === 'Private Limited Company' || profile.businessType === 'LLP') {
        return {
          isApplicable: true,
          reason: `Directors and designated partners holding active DINs must complete annual biometric/web verification.`,
          requiresVerification: false,
          status: 'completed', // completed in demo
          riskLevel: 'low'
        };
      }
      return {
        isApplicable: false,
        reason: 'Sole proprietorships and un-registered partnerships do not have DIN holders.',
        requiresVerification: false,
        status: 'pending',
        riskLevel: 'low'
      };
    }
  },
  {
    id: 'tax-tds-quarterly',
    name: 'TDS Quarterly Return (Form 26Q / 24Q)',
    category: 'Tax & GST',
    description: 'Quarterly statement of tax deducted at source for payments made towards salaries, vendor contractor fees, and professional fees.',
    responsibleAuthority: 'Income Tax Department / TRACES',
    frequency: 'Quarterly',
    priority: 'high',
    samplePenalty: 'Illustrative demo penalty: ₹200 per day under Section 234E + penalty up to ₹1,00,000 under Section 271H.',
    sourceUrl: 'https://incometax.gov.in',
    defaultDueDayOffset: 12,
    evaluateApplicability: (profile) => {
      const hasEmployees = profile.employeeCount > 0;
      const isCorporate = profile.businessType === 'Private Limited Company' || profile.businessType === 'LLP';
      if (isCorporate || hasEmployees) {
        return {
          isApplicable: true,
          reason: `Entities paying salaries or vendor fees exceeding TDS thresholds must deduct tax and file quarterly returns.`,
          requiresVerification: false,
          status: 'pending',
          riskLevel: 'medium'
        };
      }
      return {
        isApplicable: true,
        reason: 'Sole proprietorships without audit or contractor payouts may be exempt. Requires review of annual expenditure ledger.',
        requiresVerification: true,
        status: 'needs_ca_verification',
        riskLevel: 'low'
      };
    }
  },
  {
    id: 'tax-advance-tax',
    name: 'Advance Tax Instalment (Q3)',
    category: 'Tax & GST',
    description: 'Payment of quarterly advance income tax where estimated annual tax liability exceeds ₹10,000 after TDS credits.',
    responsibleAuthority: 'Central Board of Direct Taxes (CBDT)',
    frequency: 'Quarterly',
    priority: 'high',
    samplePenalty: 'Illustrative demo penalty: Simple interest at 1% per month under Sections 234B & 234C on shortfall.',
    sourceUrl: 'https://incometax.gov.in',
    defaultDueDayOffset: 28,
    evaluateApplicability: (_profile) => {
      return {
        isApplicable: true,
        reason: 'Applies to all businesses whose estimated net income tax liability exceeds ₹10,000 for the financial year.',
        requiresVerification: false,
        status: 'pending',
        riskLevel: 'medium'
      };
    }
  },
  {
    id: 'labour-epf',
    name: 'EPF Monthly Contribution & ECR Filing',
    category: 'Labour & Employment',
    description: 'Employees’ Provident Fund monthly deposit and Electronic Challan cum Return (ECR) for eligible employees earning basic wages.',
    responsibleAuthority: 'Employees’ Provident Fund Organisation (EPFO)',
    frequency: 'Monthly',
    priority: 'high',
    samplePenalty: 'Illustrative demo penalty: Damages ranging from 5% to 25% per annum plus 12% statutory interest under Section 7Q.',
    sourceUrl: 'https://www.epfindia.gov.in',
    defaultDueDayOffset: 4,
    evaluateApplicability: (profile) => {
      if (profile.employeeCount >= 20) {
        return {
          isApplicable: true,
          reason: `Mandatory statutory requirement because headcount (${profile.employeeCount}) meets or exceeds the statutory threshold of 20 employees.`,
          requiresVerification: false,
          status: 'pending',
          riskLevel: 'high'
        };
      }
      if (profile.employeeCount >= 10 && profile.employeeCount < 20) {
        return {
          isApplicable: true,
          reason: `Headcount is ${profile.employeeCount}. Statutory threshold is 20, but voluntary registration or client contract clauses often require compliance.`,
          requiresVerification: true,
          status: 'needs_ca_verification',
          riskLevel: 'medium'
        };
      }
      return {
        isApplicable: false,
        reason: `Employee count (${profile.employeeCount}) is below the threshold of 20 employees required for mandatory EPF.`,
        requiresVerification: false,
        status: 'pending',
        riskLevel: 'low'
      };
    }
  },
  {
    id: 'labour-pt',
    name: 'Professional Tax (PT) Monthly / Annual Return',
    category: 'Labour & Employment',
    description: 'State-level statutory tax levied on professions, trades, and employments deducted from employee salaries and remitted to state commercial taxes.',
    responsibleAuthority: 'State Commercial Taxes Department',
    frequency: 'Monthly',
    priority: 'medium',
    samplePenalty: 'Illustrative demo penalty: Penalty up to 2% per month on delayed remittances depending on State enactments.',
    sourceUrl: 'https://mytaxes.telangana.gov.in',
    defaultDueDayOffset: 8,
    evaluateApplicability: (profile) => {
      const ptStates = ['Telangana', 'Maharashtra', 'Karnataka', 'West Bengal', 'Tamil Nadu', 'Gujarat', 'Andhra Pradesh'];
      const isPTState = ptStates.some(st => profile.locationState.toLowerCase().includes(st.toLowerCase()));
      if (isPTState) {
        return {
          isApplicable: true,
          reason: `Applicable because ${profile.locationState} mandates Professional Tax registration (PTEC/PTRC) for operating commercial businesses.`,
          requiresVerification: false,
          status: 'pending',
          riskLevel: 'medium'
        };
      }
      return {
        isApplicable: false,
        reason: `${profile.locationState} currently does not levy Professional Tax or relies on local municipality dues.`,
        requiresVerification: true,
        status: 'needs_ca_verification',
        riskLevel: 'low'
      };
    }
  },
  {
    id: 'reg-shops-est',
    name: 'Shops & Commercial Establishments Act Registration',
    category: 'Registrations & Licences',
    description: 'Local state municipal registration regulating terms of employment, working hours, leave rules, and operational premises validity.',
    responsibleAuthority: 'State Labour Department / Municipal Corporation',
    frequency: 'Annual',
    priority: 'medium',
    samplePenalty: 'Illustrative demo penalty: Closure notices and fines ranging from ₹1,000 to ₹10,000 upon municipal inspection.',
    sourceUrl: 'https://labour.gov.in',
    defaultDueDayOffset: -90, // already completed
    evaluateApplicability: (_profile) => {
      return {
        isApplicable: true,
        reason: 'Mandatory for any commercial office, shop, or startup workspace operating within municipal limits.',
        requiresVerification: false,
        status: 'completed',
        riskLevel: 'low'
      };
    }
  },
  {
    id: 'startup-dpiit',
    name: 'DPIIT Startup India Recognition & Self-Certification',
    category: 'Startup & Banking',
    description: 'Recognition by Department for Promotion of Industry and Internal Trade granting tax exemptions (Section 80-IAC, Angel Tax) and fast-track IPR.',
    responsibleAuthority: 'DPIIT / Ministry of Commerce and Industry',
    frequency: 'One-time',
    priority: 'low',
    samplePenalty: 'Illustrative demo note: Voluntary recognition scheme; non-enrolment forfeits seed fund grants and 3-year tax holiday eligibility.',
    sourceUrl: 'https://www.startupindia.gov.in',
    defaultDueDayOffset: -120, // completed
    evaluateApplicability: (profile) => {
      if (profile.businessType === 'Private Limited Company' || profile.businessType === 'LLP') {
        return {
          isApplicable: true,
          reason: `Eligible entity structure. Offers 100% deduction on profits for 3 consecutive years out of 10 years if certified by IMB.`,
          requiresVerification: false,
          status: 'completed',
          riskLevel: 'low'
        };
      }
      return {
        isApplicable: false,
        reason: 'Sole proprietorships are not eligible for DPIIT startup recognition (requires Pvt Ltd or LLP).',
        requiresVerification: false,
        status: 'pending',
        riskLevel: 'low'
      };
    }
  },
  {
    id: 'rbi-fema-fla',
    name: 'RBI Foreign Liabilities and Assets (FLA) / FC-GPR',
    category: 'Startup & Banking',
    description: 'Mandatory reporting to the Reserve Bank of India on the FIRMS portal for foreign direct investment (FDI) inflows and annual external assets.',
    responsibleAuthority: 'Reserve Bank of India (RBI) - FEMA Division',
    frequency: 'Annual',
    priority: 'high',
    samplePenalty: 'Illustrative demo penalty: Compounding proceedings and penalty up to thrice the foreign sum involved under Section 13 FEMA 1999.',
    sourceUrl: 'https://firms.rbi.org.in',
    defaultDueDayOffset: 45,
    evaluateApplicability: (profile) => {
      if (profile.foreignInvestment === 'Yes') {
        return {
          isApplicable: true,
          reason: `Applicable because ${profile.businessName} has received foreign investment/capital. Annual FLA return must be submitted by July 15.`,
          requiresVerification: false,
          status: 'pending',
          riskLevel: 'high'
        };
      }
      if (profile.foreignInvestment === 'Not sure') {
        return {
          isApplicable: true,
          reason: 'Foreign capital or overseas convertible note status is unconfirmed. Requires FEMA compliance audit.',
          requiresVerification: true,
          status: 'needs_ca_verification',
          riskLevel: 'medium'
        };
      }
      return {
        isApplicable: false,
        reason: 'No foreign investment reported.',
        requiresVerification: false,
        status: 'pending',
        riskLevel: 'low'
      };
    }
  }
];

// Helper to evaluate profile against all rules and return ComplianceItems
export const generateChecklistForProfile = (profile: UserProfile): ComplianceItem[] => {
  return MASTER_COMPLIANCE_RULES.map((rule) => {
    const evaluation = rule.evaluateApplicability(profile);
    if (!evaluation.isApplicable) return null;

    const dueDate = getDemoDateString(rule.defaultDueDayOffset);
    const dueDaysRemaining = rule.defaultDueDayOffset;

    let finalStatus = evaluation.status;
    if (evaluation.requiresVerification) {
      finalStatus = 'needs_ca_verification';
    }

    return {
      id: rule.id,
      name: rule.name,
      category: rule.category,
      description: rule.description,
      applicabilityReason: evaluation.reason,
      responsibleAuthority: rule.responsibleAuthority,
      dueDate,
      dueDaysRemaining,
      status: finalStatus,
      priority: rule.priority,
      frequency: rule.frequency,
      samplePenalty: rule.samplePenalty,
      sourceUrl: rule.sourceUrl,
      isVerified: !evaluation.requiresVerification,
      riskLevel: evaluation.riskLevel,
      completedAt: finalStatus === 'completed' ? '2026-10-15' : undefined,
    } as ComplianceItem;
  }).filter(Boolean) as ComplianceItem[];
};

