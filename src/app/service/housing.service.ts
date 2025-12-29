import { Injectable } from '@angular/core';
import axios, { AxiosInstance } from 'axios';
import { Observable, from } from 'rxjs';
import {
  HouseSummary,
  HouseDetail,
  Address,
  Landlord,
  Facility,
  HouseReport,
  HouseReportsPagination,
  ReportComment,
} from '../interfaces/house.interface';
import { environment } from '../../environments/environment';

export interface HousesResponse {
  message: string;
  data: HouseSummary[];
}

export interface HouseDetailResponse {
  message: string;
  data: HouseDetail;
}

export interface CreateHouseResponse {
  message: string;
  data: HouseDetail;
}

export interface HouseReportsApiResponse {
  message: string;
  data: HouseReport[];
  pagination: HouseReportsPagination;
}

export interface ReportCommentsResponse {
  message: string;
  data: ReportComment[];
}

export interface CreateCommentResponse {
  message: string;
  data: {
    id: string;
    reportId: string;
    message: string;
    createdAt: string;
  };
}

export interface ReportByIdResponse {
  message: string;
  data: HouseReport;
}

@Injectable({
  providedIn: 'root',
})
export class HousingService {
  private api: AxiosInstance;

  constructor() {
    this.api = axios.create({
      baseURL: environment.apiBaseUrl,
    });

    this.api.interceptors.request.use(config => {
      const token = localStorage.getItem('token');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    });
  }

  getAllHouses(): Observable<HouseSummary[]> {
    return from(
      this.api
        .get<HousesResponse>('/hr/housing')
        .then(response => response.data.data)
    );
  }

  getHouseById(id: string): Observable<HouseDetail> {
    return from(
      this.api
        .get<HouseDetailResponse>(`/hr/housing/${id}`)
        .then(response => response.data.data)
    );
  }

  createHouse(houseData: {
    address: Address;
    landlord: Landlord;
    facility: Facility;
    status?: 'ACTIVE' | 'INACTIVE';
    description?: string;
  }): Observable<HouseDetail> {
    return from(
      this.api
        .post<CreateHouseResponse>('/hr/housing', houseData)
        .then(response => response.data.data)
    );
  }

  getHouseReports(
    houseId: string,
    page: number = 1
  ): Observable<{
    reports: HouseReport[];
    pagination: HouseReportsPagination;
  }> {
    return from(
      this.api
        .get<HouseReportsApiResponse>(`/hr/housing/${houseId}/reports`, {
          params: { page: page.toString() },
        })
        .then(response => ({
          reports: response.data.data,
          pagination: response.data.pagination,
        }))
    );
  }

  getReportById(reportId: string): Observable<HouseReport> {
    return from(
      this.api
        .get<ReportByIdResponse>(`/housing/reports/${reportId}`)
        .then(response => response.data.data)
    );
  }

  getReportComments(reportId: string): Observable<ReportComment[]> {
    return from(
      this.api
        .get<ReportCommentsResponse>(`/housing/reports/${reportId}/comments`)
        .then(response => response.data.data)
    );
  }

  createComment(
    reportId: string,
    description: string
  ): Observable<{
    id: string;
    reportId: string;
    message: string;
    createdAt: string;
  }> {
    return from(
      this.api
        .post<CreateCommentResponse>(`/housing/reports/${reportId}/comments`, {
          description,
        })
        .then(response => response.data.data)
    );
  }

  updateReportStatus(
    reportId: string,
    status: string
  ): Observable<HouseReport> {
    return from(
      this.api
        .patch<ReportByIdResponse>(`/housing/reports/${reportId}`, {
          status,
        })
        .then(response => response.data.data)
    );
  }
}
