//./hiring-management.models.ts
export type TokenStatus = 'UNUSED' | 'USED' | 'EXPIRED';
export type ApplicationStatus = 'PENDING' | 'REJECTED' | 'APPROVED';
export type OnboardingStatus = 'PENDING' | 'REJECTED' | 'APPROVED';

export interface RegistrationTokenHistoryItem {
  email: string;
  fullName: string;
  registrationLink: string;
  status: TokenStatus;
  expiresAt: string;
}

export interface OnboardingApplicationListItem {
  id: string;
  employeeId: string;
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

export interface OnboardingApplicationDetail {
  id: string;
  status: OnboardingStatus;
  feedback: string;
  submittedAt: string;
  reviewedAt: string | null;
  reviewedBy: string | null;
  snapshot: any; // render-only, backend-owned
}

export interface EmployeeDetail {
  id: string;
  userId: string;

  firstName: string;
  middleName: string;
  lastName: string;
  preferredName: string;

  ssn: string;
  dateOfBirth: string;
  gender: string;

  cellPhone: string;
  workPhone: string;

  workAuthorizationType: string;
  otherWorkAuthorizationTitle: string;
  workAuthorizationStart: string;
  workAuthorizationEnd: string;

  address: {
    buildingApt: string;
    street: string;
    city: string;
    state: string;
    zip: string;
  };

  emergencyContacts: {
    firstName: string;
    lastName: string;
    phone: string;
    email: string;
    relationship: string;
  }[];
}

export interface BackendOnboardingApplication {
  _id: string;
  userId: {
    _id: string;
    email: string;
  } | null;
  status: OnboardingStatus;
  feedback: string;
  submittedAt: string;
  snapshot: {
    firstName: string;
    lastName: string;
  } | null;
}
