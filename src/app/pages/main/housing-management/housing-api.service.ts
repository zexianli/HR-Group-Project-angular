// src/app/housing/housing-api.service.ts
import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import {
  HouseDetails,
  HouseSummary,
  FacilityReport,
  PagedResult,
  ReportComment,
  ApiHousingResponse,
  ApiHouseDetailsResponse,
  CreateHousePayload,
} from './models';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { map } from 'rxjs/operators';

@Injectable({ providedIn: 'root' })
export class HousingApiService {
  private http = inject(HttpClient);
  private baseUrl = `${environment.apiBaseUrl}`;

  // Houses
  listHouses(): Observable<HouseSummary[]> {
    return this.http.get<ApiHousingResponse>(`${this.baseUrl}/hr/housing`).pipe(
      map(res =>
        res.data.map(h => ({
          id: h.id,
          address: `${h.address.street}, ${h.address.city}, ${h.address.state} ${h.address.zip}`,
          landlord: {
            fullName: h.landlord.name,
            phone: h.landlord.phone,
            email: h.landlord.email,
          },
          employeeResidentCount: h.residentCount,
        }))
      )
    );
  }

  getHouse(houseId: string) {
    return this.http
      .get<ApiHouseDetailsResponse>(`${this.baseUrl}/hr/housing/${houseId}`)
      .pipe(
        map(res => {
          const h = res.data;

          return {
            id: h.id,
            address: [
              h.address.unit,
              h.address.street,
              `${h.address.city}, ${h.address.state} ${h.address.zip}`,
            ]
              .filter(Boolean)
              .join(', '),

            landlord: {
              fullName: h.landlord.fullName,
              phone: h.landlord.phone,
              email: h.landlord.email,
            },

            facility: h.facility,
            status: h.status,
            description: h.description,

            residents: h.residents.map(r => ({
              displayName:
                r.name.preferredName?.trim() ||
                `${r.name.firstName} ${r.name.lastName}`,
              phone: r.phone,
              email: r.email,
              car: r.car,
            })),

            createdAt: h.createdAt,
            updatedAt: h.updatedAt,
          } satisfies HouseDetails;
        })
      );
  }

  createHouse(payload: CreateHousePayload) {
    return this.http.post(`${this.baseUrl}/hr/housing`, payload);
  }

  deleteHouse(houseId: string) {
    return this.http.delete<void>(`${this.baseUrl}/housing/${houseId}`);
  }

  // Reports (paged, sorted by createdAt desc)
  listReports(
    houseId: string,
    page: number,
    pageSize: number
  ): Observable<PagedResult<FacilityReport>> {
    const params = new HttpParams()
      .set('page', String(page))
      .set('pageSize', String(pageSize))
      .set('sort', 'createdAt:desc');

    return this.http.get<PagedResult<FacilityReport>>(
      `${this.baseUrl}/housing/${houseId}/reports`,
      { params }
    );
  }

  // Comments
  addComment(
    houseId: string,
    reportId: string,
    payload: { description: string }
  ) {
    return this.http.post<ReportComment>(
      `${this.baseUrl}/housing/${houseId}/reports/${reportId}/comments`,
      payload
    );
  }

  updateMyComment(
    houseId: string,
    reportId: string,
    commentId: string,
    payload: { description: string }
  ) {
    return this.http.patch<ReportComment>(
      `${this.baseUrl}/housing/${houseId}/reports/${reportId}/comments/${commentId}`,
      payload
    );
  }
}
