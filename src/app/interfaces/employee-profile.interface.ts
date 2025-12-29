//

export type WorkAuth =
  | 'PENDING'
  | 'CITIZEN'
  | 'GREEN_CARD'
  | 'H1B'
  | 'L2'
  | 'F1_CPT_OPT'
  | 'H4'
  | 'OTHER';

export type Gender = 'MALE' | 'FEMALE' | 'NO_ANSWER';

export interface EmergencyContact {
  firstName: string;
  lastName: string;
  middleName: string;
  phone: string;
  email: string;
  relationship: string;
}

export interface Address {
  buildingApt: string;
  street: string;
  city: string;
  state: string;
  zip: string;
}

export interface Car {
  make: string;
  model: string;
  color: string;
}

export interface Reference {
  firstName: string;
  lastName: string;
  middleName: string;
  phone: string;
  email: string;
  relationship: string;
}

export interface DriverLicense {
  expirationDate: string;
  number: string;
}

//

export interface EmployeeSummaryResponse {
  totalCount: number;
  employees: EmployeeSummaryProfile[];
}

export interface EmployeeProfileResponse {
  employee: EmployeeProfile;
}

export interface EmployeeSummaryProfile {
  id: string;
  userId: string;
  name: string;
  ssn: string;
  workAuthorizationTitle: WorkAuth;
  phone: string;
  email: string;
  username: string;
}

export interface EmployeeProfile {
  _id: string;
  userId: string;
  firstName: string;
  lastName: string;
  middleName: string;
  preferredName: string;
  ssn: string;
  dateOfBirth: string;
  gender: Gender;
  profilePictureKey: string;
  cellPhone: string;
  workPhone: string;
  workAuthorizationType: WorkAuth;
  otherWorkAuthorizationTitle: string;
  workAuthorizationStart: string | null;
  workAuthorizationEnd: string | null;
  workAuthorizationDocKey: string;
  driverLicense: DriverLicense | null;
  driverLicenseDocKey: string;
  emergencyContacts: EmergencyContact[];
  houseId: string;
  address: Address;
  carInformation: Car;
  reference: Reference;
}
