import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from '../../../../environments/environment';

export interface TokenHistoryItem {
  email: string;
  name: string;
  link: string;
  isUsed: boolean;
  createdAt: string;
}

export type OnboardingStatus = 'PENDING' | 'REJECTED' | 'APPROVED';

interface BackendOnboardingApplication {
  _id: string;
  userId: {
    email: string;
  } | null;
  status: OnboardingStatus;
  feedback: string;
  submittedAt: string | null;
  snapshot: {
    firstName: string;
    lastName: string;
  } | null;
}

export interface OnboardingApplicationListItem {
  id: string;
  fullName: string;
  email: string;
  status: OnboardingStatus;
  submittedAt: string | null;
}

export interface OnboardingApplicationDetail {
  id: string;
  status: OnboardingStatus;
  feedback: string;
  submittedAt: string | null;
  reviewedAt: string | null;
  reviewedBy: string | null;
  snapshot: any; // render-only snapshot
}

@Injectable({ providedIn: 'root' })
export class HiringManagementApiService {
  private http = inject(HttpClient);
  private baseUrl = environment.apiBaseUrl;

  generateTokenAndSendEmail(payload: {
    email: string;
    name: string;
  }): Observable<{
    token: string;
    registrationLink: string;
    expiresAt: string;
  }> {
    return this.http.post<{
      token: string;
      registrationLink: string;
      expiresAt: string;
    }>(`${this.baseUrl}/tokens/generate`, payload);
  }

  getTokenHistory(): Observable<TokenHistoryItem[]> {
    return this.http
      .get<{
        message: string;
        data: TokenHistoryItem[];
      }>(`${this.baseUrl}/tokens/history`)
      .pipe(map(res => res.data));
  }

  getOnboardingByStatus(
    status: 'Pending' | 'Rejected' | 'Approved'
  ): Observable<OnboardingApplicationListItem[]> {
    return this.http
      .get<{
        count: number;
        applications: BackendOnboardingApplication[];
      }>(`${this.baseUrl}/hr/onboarding`, { params: { status } })
      .pipe(
        map(res =>
          res.applications.map(app => ({
            id: app._id,
            fullName: app.snapshot
              ? `${app.snapshot.firstName} ${app.snapshot.lastName}`
              : '—',
            email: app.userId?.email ?? '—',
            status: app.status,
            submittedAt: app.submittedAt,
          }))
        )
      );
  }

  getOnboardingDetail(id: string): Observable<OnboardingApplicationDetail> {
    return this.http
      .get<{
        onboardingApplication: any;
      }>(`${this.baseUrl}/hr/onboarding/${id}`)
      .pipe(
        map(res => {
          const app = res.onboardingApplication;
          return {
            id: app._id,
            status: app.status,
            feedback: app.feedback,
            submittedAt: app.submittedAt,
            reviewedAt: app.reviewedAt,
            reviewedBy: app.reviewedBy,
            snapshot: app.snapshot,
          };
        })
      );
  }

  approveOnboarding(id: string): Observable<void> {
    return this.http.put<void>(
      `${this.baseUrl}/hr/onboarding/${id}/approve`,
      {}
    );
  }

  rejectOnboarding(id: string, feedback: string): Observable<void> {
    return this.http.put<void>(`${this.baseUrl}/hr/onboarding/${id}/reject`, {
      feedback,
    });
  }
}
