export type TokenStatus = 'UNUSED' | 'USED' | 'EXPIRED';
export type ApplicationStatus = 'PENDING' | 'REJECTED' | 'APPROVED';

export interface RegistrationTokenHistoryItem {
  email: string;
  fullName: string;
  registrationLink: string;
  status: TokenStatus;
  expiresAt: string;
}

export interface OnboardingApplicationListItem {
  id: string;
  fullName: string;
  email: string;
  status: ApplicationStatus;
  submittedAt: string; // ISO
}

export interface RejectPayload {
  feedback: string;
}

export interface TokenHistoryItem {
  email: string;
  name: string;
  link: string;
  isUsed: boolean;
  createdAt: string;
}

export type OnboardingStatus = 'PENDING' | 'REJECTED' | 'APPROVED';

export interface OnboardingApplicationListItem {
  id: string;
  fullName: string;
  email: string;
  status: OnboardingStatus;
  submittedAt: string;
}

export interface OnboardingApplicationDetail {
  id: string;
  status: OnboardingStatus;
  feedback: string;
  submittedAt: string | null;
  reviewedAt: string | null;
  reviewedBy: string | null;
  snapshot: any; // render-only, backend-owned
}
