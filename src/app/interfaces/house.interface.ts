export interface Address {
  unit?: string;
  street: string;
  city: string;
  state: string;
  zip: string;
}

export interface Landlord {
  fullName: string;
  phone: string;
  email: string;
}

export interface Facility {
  bedrooms: number;
  bathrooms: number;
  mattresses?: number;
  tables?: number;
  chairs?: number;
}

export interface HouseSummary {
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

export interface Resident {
  name: {
    firstName: string;
    lastName: string;
    preferredName?: string;
  };
  phone: string;
  email: string;
  car?: {
    make: string;
    model: string;
    color: string;
  } | null;
}

export interface HouseDetail {
  id: string;
  address: Address;
  landlord: Landlord;
  facility: Facility;
  status: 'ACTIVE' | 'INACTIVE';
  description?: string;
  residents: Resident[];
  createdAt: string;
  updatedAt: string;
}

export interface HouseReport {
  id: string;
  title: string;
  description: string;
  status: 'OPEN' | 'IN_PROGRESS' | 'CLOSED';
  createdBy: {
    id: string;
    username: string;
    email: string;
  };
  createdAt: string;
  updatedAt: string;
}

export interface HouseReportsPagination {
  currentPage: number;
  totalPages: number;
  totalReports: number;
  reportsPerPage: number;
}

export interface HouseReportsResponse {
  reports: HouseReport[];
  pagination: HouseReportsPagination;
}
