// src/app/housing/models.ts
export type ReportStatus = 'OPEN' | 'IN_PROGRESS' | 'CLOSED';

export interface Landlord {
  fullName: string;
  phone: string;
  email: string;
}

export interface FacilityInventory {
  beds: number;
  mattresses: number;
  tables: number;
  chairs: number;
}

export interface EmployeeResident {
  displayName: string;
  phone: string;
  email: string;
  car?: {
    make?: string;
    model?: string;
    color?: string;
  };
}

export interface ReportComment {
  id: string;
  reportId: string;
  description: string;
  createdById: string;
  createdByName: string;
  createdAt: string; // ISO
  updatedAt?: string; // ISO
}

export interface FacilityReport {
  id: string;
  houseId: string;
  title: string;
  description: string;
  status: ReportStatus;
  createdById: string;
  createdByName: string;
  createdAt: string; // ISO
  comments: ReportComment[];
}

export interface HouseSummary {
  id: string;
  address: string;
  landlord: {
    fullName: string;
    phone: string;
    email: string;
  };
  employeeResidentCount: number;
}

export interface HouseDetails {
  id: string;
  address: string;
  landlord: {
    fullName: string;
    phone: string;
    email: string;
  };
  facility: {
    bedrooms: number;
    bathrooms: number;
    mattresses: number;
    tables: number;
    chairs: number;
  };
  status: string;
  description: string;
  residents: EmployeeResident[];
  createdAt: string;
  updatedAt: string;
}

export interface PagedResult<T> {
  items: T[];
  total: number;
  page: number; // 1-based
  pageSize: number;
}

export interface ApiHousingResponse {
  message: string;
  data: ApiHouse[];
}

export interface ApiHouse {
  id: string;
  address: {
    street: string;
    city: string;
    state: string;
    zip: string;
  };
  landlord: {
    name: string;
    phone: string;
    email: string;
  };
  residentCount: number;
}

export interface ApiHouseDetailsResponse {
  message: string;
  data: ApiHouseDetails;
}

export interface ApiHouseDetails {
  id: string;
  address: {
    unit?: string;
    street: string;
    city: string;
    state: string;
    zip: string;
  };
  landlord: {
    fullName: string;
    phone: string;
    email: string;
  };
  facility: {
    bedrooms: number;
    bathrooms: number;
    mattresses: number;
    tables: number;
    chairs: number;
  };
  status: string;
  description: string;
  residents: ApiResident[];
  createdAt: string;
  updatedAt: string;
}

export interface ApiResident {
  name: {
    firstName: string;
    lastName: string;
    preferredName?: string;
  };
  phone: string;
  email: string;
  car?: {
    make?: string;
    model?: string;
    color?: string;
  };
}

export interface CreateHousePayload {
  address: {
    unit?: string;
    street: string;
    city: string;
    state: string;
    zip: string;
  };
  landlord: {
    fullName: string;
    phone: string;
    email: string;
  };
  facility: {
    bedrooms: number;
    bathrooms: number;
    mattresses: number;
    tables: number;
    chairs: number;
  };
  status: 'ACTIVE' | 'INACTIVE';
  description: string;
}
