import { Injectable } from '@angular/core';
import axios, { AxiosInstance } from 'axios';
import { Observable, from } from 'rxjs';
import { environment } from '../../environments/environment';
import {
  EmployeeProfileResponse,
  EmployeeSummaryResponse,
} from '../interfaces/employee-profile.interface';

@Injectable({
  providedIn: 'root',
})
export class EmployeeProfileService {
  private api: AxiosInstance;

  constructor() {
    this.api = axios.create({
      baseURL: environment.apiBaseUrl,
    });
  }

  getEmployeeSummary(token: string): Observable<EmployeeSummaryResponse> {
    return from(
      this.api
        .get<EmployeeSummaryResponse>('/hr/employees/', {
          headers: { Authorization: `Bearer ${token}` },
        })
        .then(response => response.data)
    );
  }

  getEmployeeProfile(
    token: string,
    id: string
  ): Observable<EmployeeProfileResponse> {
    return from(
      this.api
        .get<EmployeeProfileResponse>(`hr/employees/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        })
        .then(response => response.data)
    );
  }
}
