import { UserProfile } from '../types';

export const DEMO_PROFILES: UserProfile[] = [
  {
    id: 'novatech-pvt-ltd',
    name: 'Aarav Sharma',
    email: 'aarav@example.com',
    businessName: 'NovaTech Solutions Private Limited',
    locationState: 'Telangana',
    businessType: 'Private Limited Company',
    turnoverRange: '₹40 lakh–₹1 crore',
    gstRegistered: true,
    employeeCount: 12,
    foreignInvestment: 'No',
    avatarInitials: 'AS',
    remindersEnabled: true,
    reminderDaysBefore: 7
  },
  {
    id: 'artisankraft-sole-prop',
    name: 'Priya Patel',
    email: 'priya@artisankraft.in',
    businessName: 'ArtisanKraft Studio',
    locationState: 'Gujarat',
    businessType: 'Sole Proprietorship',
    turnoverRange: '₹20–40 lakh',
    gstRegistered: true,
    employeeCount: 3,
    foreignInvestment: 'No',
    avatarInitials: 'PP',
    remindersEnabled: true,
    reminderDaysBefore: 5
  },
  {
    id: 'vertex-advisory-llp',
    name: 'Rohan Deshmukh',
    email: 'rohan@vertexconsulting.com',
    businessName: 'Vertex Global Advisory LLP',
    locationState: 'Karnataka',
    businessType: 'LLP',
    turnoverRange: '₹1–5 crore',
    gstRegistered: true,
    employeeCount: 24,
    foreignInvestment: 'Yes',
    avatarInitials: 'RD',
    remindersEnabled: true,
    reminderDaysBefore: 10
  }
];

export const DEFAULT_USER = DEMO_PROFILES[0];

