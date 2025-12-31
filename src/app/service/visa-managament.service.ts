import { Injectable } from '@angular/core';
import axios, { AxiosInstance } from 'axios';
import { Observable, from } from 'rxjs';
import { environment } from '../../environments/environment';
import {
  EmployeeProfileResponse,
  EmployeeSummaryResponse,
} from '../interfaces/employee-profile.interface';
import {
  VMAllEmployeesResponse,
  VMPendingEmployeesResponse,
} from '../interfaces/visa-management.interface';

export interface ApiResponse<T> {
  message: string;
  data: T;
}

export interface VMDocumentReviewData {
  documentId: string;
  documentType: string;
  status: string;
  feedback: string;
  reviewedBy: string;
  reviewedAt: string;
}

export interface VMNotifyData {
  employeeId: string;
  employeeName: string;
  email: string;
  documentType: string;
  action: string;
}

export interface VMDocumentURLResponse {
  url: string;
  key: string;
  employeeProfileId: string;
}

@Injectable({
  providedIn: 'root',
})
export class VisaManagementService {
  private api: AxiosInstance;

  constructor() {
    this.api = axios.create({
      baseURL: environment.apiBaseUrl,
    });
  }

  getVMPendingEmployee(token: string): Observable<VMPendingEmployeesResponse> {
    return from(
      this.api
        .get<VMPendingEmployeesResponse>('hr/visa/pending', {
          headers: { Authorization: `Bearer ${token}` },
        })
        .then(response => response.data)
    );
  }

  getVMAllEmployee(token: string): Observable<VMAllEmployeesResponse> {
    return from(
      this.api
        .get<VMAllEmployeesResponse>(`hr/visa/all`, {
          headers: { Authorization: `Bearer ${token}` },
        })
        .then(response => response.data)
    );
  }

  approveDocument(
    token: string,
    documentId: string
  ): Observable<ApiResponse<VMDocumentReviewData>> {
    return from(
      this.api
        .put<ApiResponse<VMDocumentReviewData>>(
          'hr/visa/documents/review',
          {
            documentId,
            action: 'approve',
          },
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        )
        .then(response => response.data)
    );
  }

  rejectDocument(
    token: string,
    documentId: string,
    feedback: string
  ): Observable<ApiResponse<VMDocumentReviewData>> {
    return from(
      this.api
        .put<ApiResponse<VMDocumentReviewData>>(
          'hr/visa/documents/review',
          {
            documentId,
            action: 'reject',
            feedback,
          },
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        )
        .then(response => response.data)
    );
  }

  // /hr/visa/notify/:employeeid
  notifyEmployee(
    token: string,
    employeeId: string
  ): Observable<ApiResponse<VMNotifyData>> {
    return from(
      this.api
        .post<ApiResponse<VMNotifyData>>(
          `hr/visa/documents/${employeeId}`,
          {},
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        )
        .then(response => response.data)
    );
  }

  // hr/preview-url?docType=opt_receipt&download=true&employeeProfileId=695431c3356c960a828d7164
  showDocument(
    token: string,
    docType: string,
    employeeId: string
  ): Observable<VMDocumentURLResponse> {
    return from(
      this.api
        .get<VMDocumentURLResponse>(`hr/preview-url`, {
          headers: { Authorization: `Bearer ${token}` },
          params: {
            docType: docType.toLowerCase(),
            download: false,
            employeeProfileId: employeeId,
          },
        })
        .then(response => response.data)
    );
  }

  downloadDocument(
    token: string,
    docType: string,
    employeeId: string
  ): Observable<VMDocumentURLResponse> {
    return from(
      this.api
        .get<VMDocumentURLResponse>(`hr/preview-url`, {
          headers: { Authorization: `Bearer ${token}` },
          params: {
            docType: docType.toLowerCase(),
            download: true,
            employeeProfileId: employeeId,
          },
        })
        .then(response => response.data)
    );
  }
}
