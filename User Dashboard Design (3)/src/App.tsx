import { useState } from 'react';
import { LoginPage } from './components/LoginPage';
import { Dashboard } from './components/Dashboard';

export interface Project {
  id: string;
  name: string;
}

export interface Feature {
  id: string;
  projectId: string;
  name: string;
}

export interface SubFeature {
  id: string;
  featureId: string;
  name: string;
}

export interface ImpactFeature {
  id: string;
  name: string;
  impactPaths: string[];
  description: string;
}

export interface ImpactArea {
  id: string;
  projectId: string;
  featureId: string;
  subFeatureId?: string;
  impactFeatures: ImpactFeature[];
  description?: string;
  createdBy: string;
  lastUpdatedBy: string;
  createdAt: string;
  updatedAt: string;
}

export interface AppState {
  projects: Project[];
  features: Feature[];
  subFeatures: SubFeature[];
  impactAreas: ImpactArea[];
  setProjects: (projects: Project[]) => void;
  setFeatures: (features: Feature[]) => void;
  setSubFeatures: (subFeatures: SubFeature[]) => void;
  setImpactAreas: (impactAreas: ImpactArea[]) => void;
}

// Mock data
const initialProjects: Project[] = [
  { id: '1', name: 'E-Commerce Platform' },
  { id: '2', name: 'Mobile Banking App' },
  { id: '3', name: 'Healthcare Portal' },
];

const initialFeatures: Feature[] = [
  { id: 'f1', projectId: '1', name: 'Payment Gateway' },
  { id: 'f2', projectId: '1', name: 'Shopping Cart' },
  { id: 'f3', projectId: '1', name: 'User Authentication' },
  { id: 'f4', projectId: '2', name: 'Fund Transfer' },
  { id: 'f5', projectId: '2', name: 'Account Management' },
  { id: 'f6', projectId: '3', name: 'Patient Records' },
  { id: 'f7', projectId: '3', name: 'Appointment Scheduling' },
];

const initialSubFeatures: SubFeature[] = [
  { id: 'sf1', featureId: 'f1', name: 'Stripe Integration' },
  { id: 'sf2', featureId: 'f1', name: 'PayPal Integration' },
  { id: 'sf3', featureId: 'f2', name: 'AWS Inventory Management' },
  { id: 'sf4', featureId: 'f2', name: 'Database Layer Inventory Management' },
  { id: 'sf5', featureId: 'f4', name: 'Wells Fargo Fund Transfer' },
  { id: 'sf6', featureId: 'f4', name: 'Banking API Fund Transfer' },
  { id: 'sf7', featureId: 'f4', name: 'Compliance Service Fund Transfer' },
  { id: 'sf8', featureId: 'f6', name: 'Medical History Access' },
  { id: 'sf9', featureId: 'f6', name: 'HIPAA Compliance' },
  { id: 'sf10', featureId: 'f6', name: 'Data Encryption' },
  { id: 'sf11', featureId: 'f6', name: 'Access Control' },
  { id: 'sf12', featureId: 'f6', name: 'Audit Trail' },
];

const initialImpactAreas: ImpactArea[] = [
  {
    id: 'ia1',
    projectId: '1',
    featureId: 'f1',
    subFeatureId: 'sf1',
    impactFeatures: [
      {
        id: 'if1',
        name: 'Stripe Inc.',
        impactPaths: ['Payment Processing', 'Transaction Validation', 'Fraud Detection', 'Settlement Processing'],
        description: 'Critical payment infrastructure integration',
      },
      {
        id: 'if2',
        name: 'PayPal',
        impactPaths: ['Payment Processing', 'Transaction Validation', 'Fraud Detection', 'Settlement Processing'],
        description: 'Critical payment infrastructure integration',
      },
    ],
    description: 'Critical payment infrastructure integration',
    createdBy: 'John Doe',
    lastUpdatedBy: 'Jane Smith',
    createdAt: '2024-11-15',
    updatedAt: '2024-11-20',
  },
  {
    id: 'ia2',
    projectId: '1',
    featureId: 'f2',
    subFeatureId: 'sf3',
    impactFeatures: [
      {
        id: 'if3',
        name: 'Amazon Web Services',
        impactPaths: ['Item Management', 'Inventory Sync', 'Price Calculation', 'Cart Validation', 'Session Management'],
        description: 'Real-time inventory management system',
      },
      {
        id: 'if4',
        name: 'Database Layer',
        impactPaths: ['Item Management', 'Inventory Sync', 'Price Calculation', 'Cart Validation', 'Session Management'],
        description: 'Real-time inventory management system',
      },
    ],
    description: 'Real-time inventory management system',
    createdBy: 'Alice Johnson',
    lastUpdatedBy: 'Alice Johnson',
    createdAt: '2024-11-10',
    updatedAt: '2024-11-10',
  },
  {
    id: 'ia3',
    projectId: '2',
    featureId: 'f4',
    subFeatureId: 'sf5',
    impactFeatures: [
      {
        id: 'if5',
        name: 'Wells Fargo',
        impactPaths: ['Balance Verification', 'Transaction Authorization', 'Compliance Check', 'Audit Log', 'Notification Service', 'Transaction History'],
        description: 'Secure fund transfer mechanism',
      },
      {
        id: 'if6',
        name: 'Banking API',
        impactPaths: ['Balance Verification', 'Transaction Authorization', 'Compliance Check', 'Audit Log', 'Notification Service', 'Transaction History'],
        description: 'Secure fund transfer mechanism',
      },
      {
        id: 'if7',
        name: 'Compliance Service',
        impactPaths: ['Balance Verification', 'Transaction Authorization', 'Compliance Check', 'Audit Log', 'Notification Service', 'Transaction History'],
        description: 'Secure fund transfer mechanism',
      },
    ],
    description: 'Secure fund transfer mechanism',
    createdBy: 'Bob Williams',
    lastUpdatedBy: 'Carol Davis',
    createdAt: '2024-11-01',
    updatedAt: '2024-11-18',
  },
  {
    id: 'ia4',
    projectId: '3',
    featureId: 'f6',
    subFeatureId: 'sf8',
    impactFeatures: [
      {
        id: 'if8',
        name: 'Medical History Access',
        impactPaths: ['Medical History Access', 'HIPAA Compliance', 'Data Encryption', 'Access Control', 'Audit Trail'],
        description: 'Patient data management with privacy controls',
      },
      {
        id: 'if9',
        name: 'HIPAA Compliance',
        impactPaths: ['Medical History Access', 'HIPAA Compliance', 'Data Encryption', 'Access Control', 'Audit Trail'],
        description: 'Patient data management with privacy controls',
      },
      {
        id: 'if10',
        name: 'Data Encryption',
        impactPaths: ['Medical History Access', 'HIPAA Compliance', 'Data Encryption', 'Access Control', 'Audit Trail'],
        description: 'Patient data management with privacy controls',
      },
      {
        id: 'if11',
        name: 'Access Control',
        impactPaths: ['Medical History Access', 'HIPAA Compliance', 'Data Encryption', 'Access Control', 'Audit Trail'],
        description: 'Patient data management with privacy controls',
      },
      {
        id: 'if12',
        name: 'Audit Trail',
        impactPaths: ['Medical History Access', 'HIPAA Compliance', 'Data Encryption', 'Access Control', 'Audit Trail'],
        description: 'Patient data management with privacy controls',
      },
    ],
    description: 'Patient data management with privacy controls',
    createdBy: 'Dr. Smith',
    lastUpdatedBy: 'Dr. Smith',
    createdAt: '2024-10-25',
    updatedAt: '2024-11-12',
  },
];

export default function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [projects, setProjects] = useState<Project[]>(initialProjects);
  const [features, setFeatures] = useState<Feature[]>(initialFeatures);
  const [subFeatures, setSubFeatures] = useState<SubFeature[]>(initialSubFeatures);
  const [impactAreas, setImpactAreas] = useState<ImpactArea[]>(initialImpactAreas);

  const appState: AppState = {
    projects,
    features,
    subFeatures,
    impactAreas,
    setProjects,
    setFeatures,
    setSubFeatures,
    setImpactAreas,
  };

  if (!isAuthenticated) {
    return <LoginPage onLogin={() => setIsAuthenticated(true)} />;
  }

  return <Dashboard appState={appState} onLogout={() => setIsAuthenticated(false)} />;
}