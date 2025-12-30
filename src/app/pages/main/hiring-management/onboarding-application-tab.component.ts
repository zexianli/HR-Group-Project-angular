import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import {
  HiringManagementApiService,
  OnboardingApplicationDetail,
} from './hiring-management-api.service';

@Component({
  standalone: true,
  selector: 'app-onboarding-application-tab',
  imports: [CommonModule, FormsModule],
  template: `
    <div class="page" *ngIf="app; else loading">
      <!-- Header -->
      <header class="header">
        <div>
          <h1>Onboarding Application</h1>
          <p class="sub">
            Status:
            <span
              class="badge"
              [class.approved]="app.status === 'APPROVED'"
              [class.rejected]="app.status === 'REJECTED'"
              [class.pending]="app.status === 'PENDING'">
              {{ app.status }}
            </span>
          </p>
        </div>

        <button class="btn-ghost" (click)="goBack()">Back</button>
      </header>

      <!-- Snapshot (read-only) -->
      <section class="card">
        <h2>Submitted Information</h2>

        <div class="grid">
          <div>
            <b>Name:</b> {{ app.snapshot?.firstName }}
            {{ app.snapshot?.lastName }}
          </div>
          <div><b>Date of Birth:</b> {{ app.snapshot?.dateOfBirth }}</div>
          <div><b>Gender:</b> {{ app.snapshot?.gender }}</div>
          <div><b>Phone:</b> {{ app.snapshot?.cellPhone }}</div>
          <div>
            <b>Work Authorization:</b> {{ app.snapshot?.workAuthorizationType }}
          </div>
        </div>

        <div class="address" *ngIf="app.snapshot?.address">
          <b>Address:</b>
          {{ app.snapshot.address.street }}, {{ app.snapshot.address.city }},
          {{ app.snapshot.address.state }}
          {{ app.snapshot.address.zip }}
        </div>
      </section>

      <!-- Feedback (Rejected) -->
      <section class="card" *ngIf="app.status === 'REJECTED' && app.feedback">
        <h2>Rejection Feedback</h2>
        <p class="feedback">{{ app.feedback }}</p>
      </section>

      <!-- HR Actions (Pending Only) -->
      <section class="card actions" *ngIf="app.status === 'PENDING'">
        <h2>HR Review</h2>

        <label class="label">Rejection Feedback (required if rejecting)</label>
        <textarea
          [(ngModel)]="feedback"
          rows="4"
          placeholder="Explain why this application is rejected..."></textarea>

        <div class="action-buttons">
          <button
            class="btn-approve"
            (click)="approve()"
            [disabled]="loadingAction">
            Approve
          </button>

          <button
            class="btn-reject"
            (click)="reject()"
            [disabled]="loadingAction || !feedback.trim()">
            Reject
          </button>
        </div>
      </section>
    </div>

    <ng-template #loading>
      <div class="loading">Loading application...</div>
    </ng-template>
  `,
  styles: [
    `
      .page {
        max-width: 900px;
        margin: 0 auto;
        padding: 20px;
        display: grid;
        gap: 20px;
      }

      .header {
        display: flex;
        justify-content: space-between;
        align-items: flex-end;
        gap: 12px;
      }

      h1 {
        margin: 0;
        font-size: 22px;
      }

      .sub {
        margin-top: 6px;
        color: #6b7280;
      }

      .badge {
        padding: 4px 10px;
        border-radius: 999px;
        font-weight: 700;
        font-size: 12px;
        margin-left: 6px;
      }

      .badge.pending {
        background: #fff7ed;
        color: #9a3412;
      }
      .badge.approved {
        background: #ecfdf5;
        color: #065f46;
      }
      .badge.rejected {
        background: #fef2f2;
        color: #991b1b;
      }

      .card {
        border: 1px solid #e5e7eb;
        border-radius: 14px;
        padding: 16px;
        background: #fff;
      }

      h2 {
        margin-top: 0;
        font-size: 16px;
      }

      .grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
        gap: 10px;
        margin-top: 10px;
      }

      .address {
        margin-top: 12px;
      }

      .feedback {
        color: #991b1b;
        background: #fef2f2;
        padding: 12px;
        border-radius: 10px;
      }

      .actions textarea {
        width: 100%;
        margin-top: 6px;
        border-radius: 10px;
        border: 1px solid #e5e7eb;
        padding: 10px;
        resize: vertical;
      }

      .label {
        font-size: 13px;
        font-weight: 700;
        color: #374151;
      }

      .action-buttons {
        display: flex;
        gap: 10px;
        margin-top: 12px;
      }

      .btn-approve {
        border: 1px solid #22c55e;
        background: #ecfdf5;
        color: #065f46;
        border-radius: 10px;
        padding: 8px 14px;
        font-weight: 700;
        cursor: pointer;
      }

      .btn-reject {
        border: 1px solid #ef4444;
        background: #fef2f2;
        color: #991b1b;
        border-radius: 10px;
        padding: 8px 14px;
        font-weight: 700;
        cursor: pointer;
      }

      .btn-ghost {
        border: 1px solid #e5e7eb;
        background: #fff;
        border-radius: 10px;
        padding: 6px 12px;
        font-weight: 600;
        cursor: pointer;
      }

      .loading {
        padding: 24px;
        color: #6b7280;
        text-align: center;
      }
    `,
  ],
})
export class OnboardingApplicationTabComponent {
  private api = inject(HiringManagementApiService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);

  app!: OnboardingApplicationDetail;
  feedback = '';
  loadingAction = false;

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');
    if (!id) return;

    this.api.getOnboardingDetail(id).subscribe(app => {
      this.app = app;
    });
  }

  approve() {
    this.loadingAction = true;
    this.api.approveOnboarding(this.app.id).subscribe(() => {
      this.router.navigate(['/hr/hiring']);
    });
  }

  reject() {
    if (!this.feedback.trim()) return;

    this.loadingAction = true;
    this.api
      .rejectOnboarding(this.app.id, this.feedback.trim())
      .subscribe(() => {
        this.router.navigate(['/hr/hiring']);
      });
  }

  goBack() {
    this.router.navigate(['/hr/hiring']);
  }
}
