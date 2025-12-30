import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {
  HiringManagementApiService,
  OnboardingApplicationListItem,
  OnboardingApplicationDetail,
} from './hiring-management-api.service';

@Component({
  standalone: true,
  selector: 'app-applications-tab',
  imports: [CommonModule, FormsModule],
  template: `
    <div class="page">
      <!-- ================= Pending ================= -->
      <section class="card">
        <header class="card-hd">
          <div>
            <h2>Pending</h2>
            <p>
              View submitted applications. You can approve or reject with
              feedback.
            </p>
          </div>
          <button
            class="btn-ghost"
            (click)="load('Pending')"
            [disabled]="loadingPending">
            {{ loadingPending ? 'Loading...' : 'Refresh' }}
          </button>
        </header>

        <ng-container *ngIf="pending.length; else noPending">
          <div class="row" *ngFor="let app of pending">
            <div class="info">
              <div class="name">{{ app.fullName }}</div>
              <div class="email">{{ app.email }}</div>
            </div>

            <button class="btn-ghost" (click)="openPreview(app.id)">
              View Application
            </button>
          </div>
        </ng-container>

        <ng-template #noPending>
          <div class="empty">No pending applications.</div>
        </ng-template>
      </section>

      <!-- ================= Approved ================= -->
      <section class="card">
        <header class="card-hd">
          <div>
            <h2>Approved</h2>
            <p>Read-only view.</p>
          </div>
          <button
            class="btn-ghost"
            (click)="load('Approved')"
            [disabled]="loadingApproved">
            {{ loadingApproved ? 'Loading...' : 'Refresh' }}
          </button>
        </header>

        <ng-container *ngIf="approved.length; else noApproved">
          <div class="row" *ngFor="let app of approved">
            <div class="info">
              <div class="name">{{ app.fullName }}</div>
              <div class="email">{{ app.email }}</div>
            </div>

            <button class="btn-ghost" (click)="openPreview(app.id)">
              View Application
            </button>
          </div>
        </ng-container>

        <ng-template #noApproved>
          <div class="empty">No approved applications.</div>
        </ng-template>
      </section>

      <!-- ================= Rejected ================= -->
      <section class="card">
        <header class="card-hd">
          <div>
            <h2>Rejected</h2>
            <p>Read-only view.</p>
          </div>
          <button
            class="btn-ghost"
            (click)="load('Rejected')"
            [disabled]="loadingRejected">
            {{ loadingRejected ? 'Loading...' : 'Refresh' }}
          </button>
        </header>

        <ng-container *ngIf="rejected.length; else noRejected">
          <div class="row" *ngFor="let app of rejected">
            <div class="info">
              <div class="name">{{ app.fullName }}</div>
              <div class="email">{{ app.email }}</div>
            </div>

            <button class="btn-ghost" (click)="openPreview(app.id)">
              View Application
            </button>
          </div>
        </ng-container>

        <ng-template #noRejected>
          <div class="empty">No rejected applications.</div>
        </ng-template>
      </section>
    </div>

    <!-- ================= Preview Modal ================= -->
    <div class="backdrop" *ngIf="previewOpen" (click)="closePreview()"></div>

    <div class="modal" *ngIf="previewOpen" role="dialog" aria-modal="true">
      <div class="modal-hd">
        <div>
          <div class="title">Onboarding Application</div>
          <div class="sub" *ngIf="previewApp">
            Status:
            <span
              class="badge"
              [class.pending]="previewApp.status === 'PENDING'"
              [class.approved]="previewApp.status === 'APPROVED'"
              [class.rejected]="previewApp.status === 'REJECTED'">
              {{ previewApp.status }}
            </span>
          </div>
        </div>

        <button class="x" (click)="closePreview()">✕</button>
      </div>

      <div class="modal-body">
        <div class="loading" *ngIf="previewLoading">Loading application...</div>

        <ng-container *ngIf="!previewLoading && previewApp">
          <!-- Render snapshot nicely (minimal fields + full JSON below) -->
          <div class="section">
            <h3>Summary</h3>

            <div class="grid">
              <div>
                <b>First Name:</b> {{ previewApp.snapshot?.firstName ?? '—' }}
              </div>
              <div>
                <b>Last Name:</b> {{ previewApp.snapshot?.lastName ?? '—' }}
              </div>
              <div><b>SSN:</b> {{ previewApp.snapshot?.ssn ?? '—' }}</div>
              <div>
                <b>DOB:</b> {{ previewApp.snapshot?.dateOfBirth ?? '—' }}
              </div>
              <div><b>Gender:</b> {{ previewApp.snapshot?.gender ?? '—' }}</div>
              <div>
                <b>Cell Phone:</b> {{ previewApp.snapshot?.cellPhone ?? '—' }}
              </div>
              <div>
                <b>Work Auth:</b>
                {{ previewApp.snapshot?.workAuthorizationType ?? '—' }}
              </div>
            </div>
          </div>

          <div class="section" *ngIf="previewApp.snapshot?.address">
            <h3>Address</h3>
            <div class="muted">
              {{ previewApp.snapshot.address.street }},
              {{ previewApp.snapshot.address.city }},
              {{ previewApp.snapshot.address.state }}
              {{ previewApp.snapshot.address.zip }}
            </div>
          </div>

          <div
            class="section"
            *ngIf="previewApp.status === 'REJECTED' && previewApp.feedback">
            <h3>Feedback</h3>
            <div class="feedback">{{ previewApp.feedback }}</div>
          </div>

          <!-- Actions: Pending only -->
          <div class="section" *ngIf="previewApp.status === 'PENDING'">
            <h3>HR Review</h3>

            <label class="lbl">Feedback (required for reject)</label>
            <textarea
              [(ngModel)]="rejectFeedback"
              rows="4"
              placeholder="Explain what needs to be fixed..."></textarea>

            <div class="actions">
              <button
                class="btn-approve"
                (click)="approveInModal()"
                [disabled]="actionLoading">
                {{ actionLoading ? 'Working...' : 'Approve' }}
              </button>

              <button
                class="btn-reject"
                (click)="rejectInModal()"
                [disabled]="actionLoading || !rejectFeedback.trim()">
                {{ actionLoading ? 'Working...' : 'Reject' }}
              </button>
            </div>
          </div>

          <!-- Optional: show full snapshot JSON for “entire form” -->
          <details class="section">
            <summary>Show full application JSON</summary>
            <pre class="json">{{ previewApp.snapshot | json }}</pre>
          </details>
        </ng-container>

        <div class="error" *ngIf="previewError">{{ previewError }}</div>
      </div>
    </div>
  `,
  styles: [
    `
      .page {
        display: grid;
        gap: 16px;
      }
      .card {
        background: #fff;
        border: 1px solid #e5e7eb;
        border-radius: 14px;
        padding: 16px;
      }
      .card-hd {
        display: flex;
        justify-content: space-between;
        gap: 12px;
        align-items: flex-start;
      }
      h2 {
        margin: 0;
        font-size: 18px;
      }
      p {
        margin: 6px 0 0;
        color: #6b7280;
      }
      .row {
        margin-top: 10px;
        border: 1px solid #e5e7eb;
        border-radius: 12px;
        padding: 12px;
        display: flex;
        justify-content: space-between;
        align-items: center;
        gap: 12px;
        background: #fafafa;
      }
      .name {
        font-weight: 800;
      }
      .email {
        color: #6b7280;
        font-size: 13px;
        margin-top: 4px;
      }

      .btn-ghost {
        height: 36px;
        padding: 0 12px;
        border: 1px solid #e5e7eb;
        background: #fff;
        border-radius: 10px;
        font-weight: 700;
        cursor: pointer;
      }
      .empty {
        margin-top: 12px;
        padding: 14px;
        border: 1px dashed #e5e7eb;
        border-radius: 12px;
        color: #6b7280;
        text-align: center;
      }

      /* Modal */
      .backdrop {
        position: fixed;
        inset: 0;
        background: rgba(0, 0, 0, 0.35);
        z-index: 50;
      }
      .modal {
        position: fixed;
        left: 50%;
        top: 50%;
        transform: translate(-50%, -50%);
        width: min(900px, calc(100vw - 24px));
        max-height: min(85vh, 900px);
        background: #fff;
        border: 1px solid #e5e7eb;
        border-radius: 16px;
        z-index: 51;
        display: flex;
        flex-direction: column;
        overflow: hidden;
        box-shadow: 0 18px 40px rgba(0, 0, 0, 0.18);
      }
      .modal-hd {
        padding: 14px 16px;
        border-bottom: 1px solid #f3f4f6;
        display: flex;
        justify-content: space-between;
        gap: 12px;
        align-items: flex-start;
      }
      .title {
        font-weight: 900;
        font-size: 16px;
      }
      .sub {
        margin-top: 4px;
        color: #6b7280;
        font-size: 13px;
        display: flex;
        gap: 8px;
        align-items: center;
      }
      .x {
        border: 1px solid #e5e7eb;
        background: #fff;
        border-radius: 10px;
        height: 34px;
        width: 34px;
        cursor: pointer;
      }

      .modal-body {
        padding: 14px 16px;
        overflow: auto;
      }

      .badge {
        padding: 4px 10px;
        border-radius: 999px;
        font-weight: 800;
        font-size: 12px;
        border: 1px solid #e5e7eb;
      }
      .badge.pending {
        background: #fff7ed;
        border-color: #fed7aa;
        color: #9a3412;
      }
      .badge.approved {
        background: #ecfdf5;
        border-color: #a7f3d0;
        color: #065f46;
      }
      .badge.rejected {
        background: #fef2f2;
        border-color: #fecaca;
        color: #991b1b;
      }

      .section {
        margin-top: 14px;
      }
      h3 {
        margin: 0 0 8px;
        font-size: 14px;
      }
      .grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
        gap: 10px;
      }
      .muted {
        color: #6b7280;
      }
      .feedback {
        background: #fef2f2;
        border: 1px solid #fecaca;
        color: #991b1b;
        border-radius: 12px;
        padding: 10px 12px;
      }

      .lbl {
        font-size: 12px;
        color: #6b7280;
        font-weight: 800;
        display: block;
        margin-bottom: 6px;
      }
      textarea {
        width: 100%;
        border-radius: 12px;
        border: 1px solid #e5e7eb;
        padding: 10px 12px;
        outline: none;
        resize: vertical;
      }
      textarea:focus {
        border-color: #111827;
        box-shadow: 0 0 0 3px rgba(17, 24, 39, 0.08);
      }

      .actions {
        display: flex;
        gap: 10px;
        margin-top: 10px;
      }
      .btn-approve {
        height: 36px;
        padding: 0 12px;
        border-radius: 10px;
        border: 1px solid #16a34a;
        background: #ecfdf5;
        font-weight: 800;
        cursor: pointer;
      }
      .btn-reject {
        height: 36px;
        padding: 0 12px;
        border-radius: 10px;
        border: 1px solid #ef4444;
        background: #fef2f2;
        font-weight: 800;
        cursor: pointer;
      }
      .loading {
        color: #6b7280;
        padding: 10px 0;
      }
      .error {
        color: #991b1b;
        margin-top: 10px;
      }
      .json {
        background: #0b1020;
        color: #e5e7eb;
        padding: 12px;
        border-radius: 12px;
        overflow: auto;
      }
    `,
  ],
})
export class ApplicationsTabComponent {
  private api = inject(HiringManagementApiService);

  pending: OnboardingApplicationListItem[] = [];
  approved: OnboardingApplicationListItem[] = [];
  rejected: OnboardingApplicationListItem[] = [];

  loadingPending = false;
  loadingApproved = false;
  loadingRejected = false;

  // preview modal state
  previewOpen = false;
  previewLoading = false;
  previewError = '';
  previewApp: OnboardingApplicationDetail | null = null;

  // action state
  actionLoading = false;
  rejectFeedback = '';

  ngOnInit() {
    this.load('Pending');
    this.load('Approved');
    this.load('Rejected');
  }

  load(status: 'Pending' | 'Approved' | 'Rejected') {
    if (status === 'Pending') this.loadingPending = true;
    if (status === 'Approved') this.loadingApproved = true;
    if (status === 'Rejected') this.loadingRejected = true;

    this.api.getOnboardingByStatus(status).subscribe({
      next: items => {
        if (status === 'Pending') this.pending = items;
        if (status === 'Approved') this.approved = items;
        if (status === 'Rejected') this.rejected = items;
      },
      error: () => {},
      complete: () => {
        if (status === 'Pending') this.loadingPending = false;
        if (status === 'Approved') this.loadingApproved = false;
        if (status === 'Rejected') this.loadingRejected = false;
      },
    });
  }

  openPreview(id: string) {
    this.previewOpen = true;
    this.previewLoading = true;
    this.previewError = '';
    this.previewApp = null;
    this.rejectFeedback = '';

    // ✅ This is the request you wanted:
    // GET http://localhost:3000/api/hr/onboarding/:id
    this.api.getOnboardingDetail(id).subscribe({
      next: app => {
        this.previewApp = app;
        // if already rejected, show existing feedback (read-only)
        if (app.status === 'REJECTED') this.rejectFeedback = app.feedback ?? '';
      },
      error: () => {
        this.previewError = 'Failed to load onboarding application detail.';
      },
      complete: () => {
        this.previewLoading = false;
      },
    });
  }

  closePreview() {
    this.previewOpen = false;
    this.previewLoading = false;
    this.previewError = '';
    this.previewApp = null;
    this.rejectFeedback = '';
    this.actionLoading = false;
  }

  approveInModal() {
    if (!this.previewApp) return;

    this.actionLoading = true;
    this.api.approveOnboarding(this.previewApp.id).subscribe({
      next: () => {
        this.actionLoading = false;
        this.closePreview();
        this.load('Pending');
        this.load('Approved');
      },
      error: () => {
        this.actionLoading = false;
        this.previewError = 'Approve failed.';
      },
    });
  }

  rejectInModal() {
    if (!this.previewApp) return;
    if (!this.rejectFeedback.trim()) return;

    this.actionLoading = true;
    this.api
      .rejectOnboarding(this.previewApp.id, this.rejectFeedback.trim())
      .subscribe({
        next: () => {
          this.actionLoading = false;
          this.closePreview();
          this.load('Pending');
          this.load('Rejected');
        },
        error: () => {
          this.actionLoading = false;
          this.previewError = 'Reject failed.';
        },
      });
  }
}
