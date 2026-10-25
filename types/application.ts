export type ApplicationStatus =
  | "pending"
  | "under_review"
  | "returned"
  | "approved"
  | "rejected";

export type DocumentStatus =
  | "submitted"
  | "missing"
  | "pending_verification"
  | "needs_clarification";

export interface Applicant {
  id: string;
  name: string;
  village: string;
  occupation: string;
  declaredAnnualIncome: number;
  familyMembers: number;
}

export interface DocumentItem {
  id: string;
  name: string;
  status: DocumentStatus;
  reviewNotes: string;
  required: boolean;
}

export type TimelineEventType =
  | "system"
  | "document"
  | "decision"
  | "ai"
  | "verification";

export interface TimelineEvent {
  id: string;
  type: TimelineEventType;
  title: string;
  description: string;
  timestamp: string;
}

export interface OfficerDecision {
  id: string;
  type: "approved" | "rejected" | "returned";
  officerName: string;
  officerId: string;
  reason: string;
  timestamp: string;
}

export interface ReviewFinding {
  id: string;
  severity: "info" | "warning" | "critical";
  category: "missing" | "inconsistency" | "verification" | "recommendation";
  field: string;
  message: string;
  evidence: string;
}

export interface AIReview {
  summary: string;
  requiredDocuments: string[];
  inconsistencies: string[];
  verificationPoints: string[];
  nextAction: string;
  reasons: string[];
  recommendation: string;
  mode: "rule-based";
}

export interface Application {
  id: string;
  applicant: Applicant;
  status: ApplicationStatus;
  assignedOfficer: string;
  submittedAt: string;
  reviewDeadline: string;
  documents: DocumentItem[];
  incomeDetails: {
    declaredAnnualIncome: number;
    reportedIncome: number | null;
    verifierIncome: number | null;
    source: string;
  };
  timeline: TimelineEvent[];
  decisions: OfficerDecision[];
}

export type PriorityLevel = "critical" | "high" | "medium" | "low";

export interface PriorityResult {
  level: PriorityLevel;
  score: number;
  label: string;
  reason: string;
}
