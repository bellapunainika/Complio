import React, { createContext, useContext, useState, useEffect, useMemo } from 'react';
import { 
  UserProfile, 
  ComplianceItem, 
  NotificationItem, 
  ComplianceSummary, 
  ComplianceStatus,
  GSTRecord,
  GSTSummaryData,
  VaultDocument
} from '../types';
import { DEFAULT_USER, DEMO_PROFILES } from '../data/demoProfiles';
import { generateChecklistForProfile } from '../data/complianceRules';
import { 
  getInitialValidatedSampleData, 
  computeGSTSummary, 
  validateGSTRecords, 
  RAW_SAMPLE_GST_RECORDS 
} from '../data/sampleGSTRecords';
import confetti from 'canvas-confetti';

interface ComplianceContextType {
  currentProfile: UserProfile;
  complianceList: ComplianceItem[];
  notifications: NotificationItem[];
  activeView: string;
  setActiveView: (view: string) => void;
  selectedComplianceDetail: ComplianceItem | null;
  setSelectedComplianceDetail: (item: ComplianceItem | null) => void;
  summary: ComplianceSummary;
  switchProfile: (profileId: string) => void;
  updateProfile: (updatedData: Partial<UserProfile>) => void;
  toggleTaskStatus: (taskId: string, newStatus?: ComplianceStatus) => void;
  applyNewOnboardingData: (onboardingData: Partial<UserProfile>) => ComplianceItem[];
  markNotificationRead: (id: string) => void;
  markAllNotificationsRead: () => void;
  resetToDemoDefaults: () => void;
  demoProfiles: UserProfile[];

  // GST Automation additions
  gstRecords: GSTRecord[];
  gstSummary: GSTSummaryData;
  loadSampleGSTData: () => void;
  setParsedGSTRecords: (records: Omit<GSTRecord, 'validationStatus' | 'validationIssues'>[]) => void;
  clearGSTRecords: () => void;

  // Document Vault additions
  vaultDocuments: VaultDocument[];
  addVaultDocument: (doc: Omit<VaultDocument, 'id' | 'generatedDate'>) => void;
  deleteVaultDocument: (id: string) => void;
}

const STORAGE_KEYS = {
  PROFILE: 'complio_v2_profile',
  CHECKLIST: 'complio_v2_checklist',
  NOTIFICATIONS: 'complio_v2_notifications',
  ACTIVE_VIEW: 'complio_v2_view',
  GST_RECORDS: 'complio_v2_gst_records',
  VAULT_DOCUMENTS: 'complio_v2_vault_documents'
};

const INITIAL_VAULT_DOCUMENTS: VaultDocument[] = [
  {
    id: 'vault-1',
    title: 'GST Preparation & Reconciliation Report (Nov 2026)',
    category: 'GST Reports',
    fileType: 'PDF',
    generatedDate: '2026-11-14',
    associatedBusiness: 'NovaTech Solutions Private Limited',
    fileSize: '142 KB',
    dataSummary: '18 Records processed • Net Tax: ₹4,12,300 • Ready for CA verification'
  },
  {
    id: 'vault-2',
    title: 'Tax Invoice #INV-2026-001 (Telangana CloudWorks)',
    category: 'Invoices',
    fileType: 'PDF',
    generatedDate: '2026-11-02',
    associatedBusiness: 'NovaTech Solutions Private Limited',
    fileSize: '88 KB',
    dataSummary: 'B2B Intra-State Tax Invoice • 18% GST • ₹1,77,000'
  },
  {
    id: 'vault-3',
    title: 'Standard Mutual Non-Disclosure Agreement (Draft)',
    category: 'Agreements',
    fileType: 'PDF',
    generatedDate: '2026-10-28',
    associatedBusiness: 'NovaTech Solutions Private Limited',
    fileSize: '115 KB',
    dataSummary: '2-Year Term • Governing Law: Telangana • Dual signature draft'
  },
  {
    id: 'vault-4',
    title: 'DIR-3 KYC Director Verification Acknowledgment',
    category: 'Other Compliance Documents',
    fileType: 'PDF',
    generatedDate: '2026-09-20',
    associatedBusiness: 'NovaTech Solutions Private Limited',
    fileSize: '64 KB',
    dataSummary: 'MCA DIN Verification • SRN: V98451293'
  }
];

const INITIAL_NOTIFICATIONS: NotificationItem[] = [
  {
    id: 'notif-1',
    title: 'Upcoming Demo Filing Deadline',
    message: 'Your GST-related demo filing deadline (GSTR-3B) is approaching in 6 days.',
    type: 'warning',
    timestamp: 'Today at 09:30 AM',
    read: false,
    complianceId: 'gst-gstr3b'
  },
  {
    id: 'notif-2',
    title: 'GST Document Preparation Completed',
    message: '18 sales records extracted and validated. 2 warnings detected in GST Studio.',
    type: 'success',
    timestamp: 'Today at 08:45 AM',
    read: false,
  },
  {
    id: 'notif-3',
    title: 'Annual Filing Task Pending',
    message: 'Form AOC-4 (Financial Statements) is due next month for NovaTech Solutions.',
    type: 'info',
    timestamp: 'Yesterday at 04:15 PM',
    read: false,
    complianceId: 'mca-aoc4'
  },
  {
    id: 'notif-4',
    title: 'One Compliance Item Requires CA Verification',
    message: 'EPF voluntary threshold requires CA consultation based on 12 headcount.',
    type: 'warning',
    timestamp: '2 days ago',
    read: true,
    complianceId: 'labour-epf'
  },
  {
    id: 'notif-5',
    title: 'GSTR-1 Outward Supplies Overdue',
    message: 'GSTR-1 is 3 days past the illustrative deadline. Review before buyer ITC is blocked.',
    type: 'danger',
    timestamp: 'Just now',
    read: false,
    complianceId: 'gst-gstr1'
  }
];

const ComplianceContext = createContext<ComplianceContextType | undefined>(undefined);

export const ComplianceProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // 1. User Profile
  const [currentProfile, setCurrentProfile] = useState<UserProfile>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.PROFILE);
      return saved ? JSON.parse(saved) : DEFAULT_USER;
    } catch {
      return DEFAULT_USER;
    }
  });

  // 2. Compliance Checklist
  const [complianceList, setComplianceList] = useState<ComplianceItem[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.CHECKLIST);
      return saved ? JSON.parse(saved) : generateChecklistForProfile(DEFAULT_USER);
    } catch {
      return generateChecklistForProfile(DEFAULT_USER);
    }
  });

  // 3. Notifications
  const [notifications, setNotifications] = useState<NotificationItem[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.NOTIFICATIONS);
      return saved ? JSON.parse(saved) : INITIAL_NOTIFICATIONS;
    } catch {
      return INITIAL_NOTIFICATIONS;
    }
  });

  // 4. GST Records
  const [gstRecords, setGstRecords] = useState<GSTRecord[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.GST_RECORDS);
      return saved ? JSON.parse(saved) : getInitialValidatedSampleData();
    } catch {
      return getInitialValidatedSampleData();
    }
  });

  // 5. Document Vault
  const [vaultDocuments, setVaultDocuments] = useState<VaultDocument[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.VAULT_DOCUMENTS);
      return saved ? JSON.parse(saved) : INITIAL_VAULT_DOCUMENTS;
    } catch {
      return INITIAL_VAULT_DOCUMENTS;
    }
  });

  // 6. Active View state
  const [activeView, setActiveViewState] = useState<string>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.ACTIVE_VIEW);
      return saved || 'landing';
    } catch {
      return 'landing';
    }
  });

  const setActiveView = (view: string) => {
    setActiveViewState(view);
    localStorage.setItem(STORAGE_KEYS.ACTIVE_VIEW, view);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const [selectedComplianceDetail, setSelectedComplianceDetail] = useState<ComplianceItem | null>(null);

  // Sync profile changes
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.PROFILE, JSON.stringify(currentProfile));
    } catch (e) {
      console.error(e);
    }
  }, [currentProfile]);

  // Sync checklist
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.CHECKLIST, JSON.stringify(complianceList));
    } catch (e) {
      console.error(e);
    }
  }, [complianceList]);

  // Sync notifications
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.NOTIFICATIONS, JSON.stringify(notifications));
    } catch (e) {
      console.error(e);
    }
  }, [notifications]);

  // Sync GST records
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.GST_RECORDS, JSON.stringify(gstRecords));
    } catch (e) {
      console.error(e);
    }
  }, [gstRecords]);

  // Sync Vault documents
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.VAULT_DOCUMENTS, JSON.stringify(vaultDocuments));
    } catch (e) {
      console.error(e);
    }
  }, [vaultDocuments]);

  // Dynamic GST Summary
  const gstSummary = useMemo(() => {
    return computeGSTSummary(gstRecords);
  }, [gstRecords]);

  // Dynamic summary computation
  const summary: ComplianceSummary = useMemo(() => {
    const total = complianceList.length;
    const completed = complianceList.filter(item => item.status === 'completed').length;
    const pending = complianceList.filter(item => item.status === 'pending').length;
    const overdue = complianceList.filter(item => item.status === 'overdue').length;
    const needsVerification = complianceList.filter(item => item.status === 'needs_ca_verification').length;

    const dueWithin7Days = complianceList.filter(item => 
      item.status !== 'completed' && item.dueDaysRemaining >= 0 && item.dueDaysRemaining <= 7
    ).length;

    const dueWithin30Days = complianceList.filter(item => 
      item.status !== 'completed' && item.dueDaysRemaining >= 0 && item.dueDaysRemaining <= 30
    ).length;

    let calculatedScore = 82;
    if (total > 0) {
      const baseCompletionRate = (completed / total) * 100;
      const overduePenalty = (overdue / total) * 35;
      calculatedScore = Math.max(10, Math.min(100, Math.round(baseCompletionRate + (100 - baseCompletionRate) * 0.4 - overduePenalty + 15)));
      if (overdue === 0 && completed === total) calculatedScore = 100;
    }

    return {
      healthScore: calculatedScore,
      total,
      completed,
      pending,
      overdue,
      needsVerification,
      dueWithin7Days,
      dueWithin30Days
    };
  }, [complianceList]);

  // Switch between demo profiles
  const switchProfile = (profileId: string) => {
    const found = DEMO_PROFILES.find(p => p.id === profileId);
    if (found) {
      setCurrentProfile(found);
      const newItems = generateChecklistForProfile(found);
      setComplianceList(newItems);
      const switchNotif: NotificationItem = {
        id: `switch-${Date.now()}`,
        title: `Switched Profile: ${found.businessName}`,
        message: `Active business changed to ${found.businessType} in ${found.locationState}. Compliance checklist calibrated.`,
        type: 'info',
        timestamp: 'Just now',
        read: false
      };
      setNotifications(prev => [switchNotif, ...prev]);
    }
  };

  const updateProfile = (updatedData: Partial<UserProfile>) => {
    setCurrentProfile(prev => ({ ...prev, ...updatedData }));
  };

  const toggleTaskStatus = (taskId: string, newStatus?: ComplianceStatus) => {
    setComplianceList(prev => prev.map(item => {
      if (item.id === taskId) {
        const nextStatus = newStatus || (item.status === 'completed' ? 'pending' : 'completed');
        const isNowCompleted = nextStatus === 'completed';

        if (isNowCompleted) {
          try {
            confetti({
              particleCount: 50,
              spread: 60,
              origin: { y: 0.8 },
              colors: ['#9466FF', '#6C8FFF', '#34D399']
            });
          } catch {
            // ignore
          }
        }

        const updatedItem = {
          ...item,
          status: nextStatus,
          completedAt: isNowCompleted ? new Date().toISOString().split('T')[0] : undefined,
          dueDaysRemaining: isNowCompleted ? 0 : item.dueDaysRemaining
        };

        if (selectedComplianceDetail && selectedComplianceDetail.id === taskId) {
          setSelectedComplianceDetail(updatedItem);
        }

        return updatedItem;
      }
      return item;
    }));
  };

  const applyNewOnboardingData = (onboardingData: Partial<UserProfile>): ComplianceItem[] => {
    const updated: UserProfile = {
      ...currentProfile,
      ...onboardingData,
      avatarInitials: (onboardingData.businessName || currentProfile.businessName)
        .split(' ')
        .map(w => w[0])
        .slice(0, 2)
        .join('')
        .toUpperCase()
    };
    setCurrentProfile(updated);
    const newChecklist = generateChecklistForProfile(updated);
    setComplianceList(newChecklist);

    const notif: NotificationItem = {
      id: `ai-gen-${Date.now()}`,
      title: 'AI Checklist Generated',
      message: `Identified ${newChecklist.length} applicable obligations for ${updated.businessName}.`,
      type: 'success',
      timestamp: 'Just now',
      read: false
    };
    setNotifications(prev => [notif, ...prev]);

    return newChecklist;
  };

  const markNotificationRead = (id: string) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
  };

  const markAllNotificationsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  };

  // GST Automation methods
  const loadSampleGSTData = () => {
    const validated = validateGSTRecords(RAW_SAMPLE_GST_RECORDS);
    setGstRecords(validated);

    const notif: NotificationItem = {
      id: `sample-gst-${Date.now()}`,
      title: 'Sample GST Data Loaded',
      message: 'Populated 18 realistic B2B sales invoices and credit notes for demonstration.',
      type: 'info',
      timestamp: 'Just now',
      read: false
    };
    setNotifications(prev => [notif, ...prev]);
  };

  const setParsedGSTRecords = (rawRecords: Omit<GSTRecord, 'validationStatus' | 'validationIssues'>[]) => {
    const validated = validateGSTRecords(rawRecords);
    setGstRecords(validated);
  };

  const clearGSTRecords = () => {
    setGstRecords([]);
  };

  // Document Vault methods
  const addVaultDocument = (doc: Omit<VaultDocument, 'id' | 'generatedDate'>) => {
    const newDoc: VaultDocument = {
      ...doc,
      id: `doc-${Date.now()}`,
      generatedDate: new Date().toISOString().split('T')[0]
    };
    setVaultDocuments(prev => [newDoc, ...prev]);

    const notif: NotificationItem = {
      id: `doc-gen-${Date.now()}`,
      title: `${newDoc.title} Saved`,
      message: `Stored in Document Vault under ${newDoc.category}.`,
      type: 'success',
      timestamp: 'Just now',
      read: false
    };
    setNotifications(prev => [notif, ...prev]);
  };

  const deleteVaultDocument = (id: string) => {
    setVaultDocuments(prev => prev.filter(d => d.id !== id));
  };

  const resetToDemoDefaults = () => {
    setCurrentProfile(DEFAULT_USER);
    setComplianceList(generateChecklistForProfile(DEFAULT_USER));
    setNotifications(INITIAL_NOTIFICATIONS);
    setGstRecords(getInitialValidatedSampleData());
    setVaultDocuments(INITIAL_VAULT_DOCUMENTS);
    localStorage.clear();
    setActiveView('dashboard');
  };

  return (
    <ComplianceContext.Provider
      value={{
        currentProfile,
        complianceList,
        notifications,
        activeView,
        setActiveView,
        selectedComplianceDetail,
        setSelectedComplianceDetail,
        summary,
        switchProfile,
        updateProfile,
        toggleTaskStatus,
        applyNewOnboardingData,
        markNotificationRead,
        markAllNotificationsRead,
        resetToDemoDefaults,
        demoProfiles: DEMO_PROFILES,

        gstRecords,
        gstSummary,
        loadSampleGSTData,
        setParsedGSTRecords,
        clearGSTRecords,

        vaultDocuments,
        addVaultDocument,
        deleteVaultDocument
      }}
    >
      {children}
    </ComplianceContext.Provider>
  );
};

export const useCompliance = () => {
  const context = useContext(ComplianceContext);
  if (!context) {
    throw new Error('useCompliance must be used within a ComplianceProvider');
  }
  return context;
};
