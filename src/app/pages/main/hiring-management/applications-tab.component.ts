// ./applications-tab.component.ts
import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { forkJoin, of } from 'rxjs';

import { HiringManagementApiService } from './hiring-management-api.service';
import {
  OnboardingApplicationListItem,
  OnboardingApplicationDetail,
  EmployeeDetail,
} from './hiring-management.models';

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

            <button
              class="btn-ghost"
              (click)="openPreview(app.id, app.employeeId)">
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

            <button
              class="btn-ghost"
              (click)="openPreview(app.id, app.employeeId)">
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

            <button
              class="btn-ghost"
              (click)="openPreview(app.id, app.employeeId)">
              View Application
            </button>
          </div>
        </ng-container>

        <ng-template #noRejected>
          <div class="empty">No rejected applications.</div>
        </ng-template>
      </section>
    </div>

    <!-- ================= Modal ================= -->
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
        <!-- ================= Loading ================= -->
        <div class="loading" *ngIf="previewLoading">Loading application...</div>

        <ng-container *ngIf="!previewLoading && previewApp">
          <!-- ================= Employee Information ================= -->
          <div class="section" *ngIf="employee">
            <h3>Employee Information</h3>

            <div class="grid">
              <div><b>Employee ID:</b> {{ employee.id }}</div>

              <div><b>First Name:</b> {{ employee.firstName }}</div>
              <div><b>Middle Name:</b> {{ employee.middleName || '—' }}</div>
              <div><b>Last Name:</b> {{ employee.lastName }}</div>
              <div>
                <b>Preferred Name:</b> {{ employee.preferredName || '—' }}
              </div>

              <div><b>SSN:</b> {{ employee.ssn }}</div>

              <div>
                <b>Date of Birth:</b>
                {{ employee.dateOfBirth | date: 'longDate' }}
              </div>

              <div><b>Gender:</b> {{ employee.gender }}</div>
              <div><b>Cell Phone:</b> {{ employee.cellPhone }}</div>
              <div><b>Work Phone:</b> {{ employee.workPhone || '—' }}</div>

              <div>
                <b>Work Authorization:</b> {{ employee.workAuthorizationType }}
              </div>

              <div>
                <b>Authorization Period:</b>
                {{ employee.workAuthorizationStart | date }} →
                {{ employee.workAuthorizationEnd | date }}
              </div>
            </div>

            <!-- Address -->
            <div class="section" *ngIf="employee.address">
              <h4>Address</h4>
              <div class="muted">
                {{ employee.address.buildingApt }},
                {{ employee.address.street }}, {{ employee.address.city }},
                {{ employee.address.state }}
                {{ employee.address.zip }}
              </div>
            </div>

            <!-- Emergency Contact -->
            <div class="section" *ngIf="employee.emergencyContacts?.length">
              <h4>Emergency Contact</h4>

              <div class="grid">
                <div>
                  <b>Name:</b>
                  {{ employee.emergencyContacts[0].firstName }}
                  {{ employee.emergencyContacts[0].lastName }}
                </div>
                <div>
                  <b>Relationship:</b>
                  {{ employee.emergencyContacts[0].relationship }}
                </div>
                <div>
                  <b>Phone:</b> {{ employee.emergencyContacts[0].phone }}
                </div>
                <div>
                  <b>Email:</b> {{ employee.emergencyContacts[0].email }}
                </div>
              </div>
            </div>
          </div>

          <!-- ================= Submitted Application Snapshot ================= -->
          <div class="section" *ngIf="previewApp.snapshot">
            <h3>Submitted Application</h3>

            <div class="grid">
              <div><b>First Name:</b> {{ previewApp.snapshot.firstName }}</div>
              <div><b>Last Name:</b> {{ previewApp.snapshot.lastName }}</div>
              <div><b>Gender:</b> {{ previewApp.snapshot.gender }}</div>
              <div><b>Phone:</b> {{ previewApp.snapshot.cellPhone }}</div>
              <div>
                <b>Work Auth:</b>
                {{ previewApp.snapshot.workAuthorizationType }}
              </div>
            </div>
          </div>

          <!-- ================= Snapshot Address ================= -->
          <div class="section" *ngIf="previewApp.snapshot?.address">
            <h3>Application Address</h3>
            <div class="muted">
              {{ previewApp.snapshot.address.street }},
              {{ previewApp.snapshot.address.city }},
              {{ previewApp.snapshot.address.state }}
              {{ previewApp.snapshot.address.zip }}
            </div>
          </div>

          <!-- ================= REJECTED ================= -->
          <div class="section" *ngIf="previewApp.status === 'REJECTED'">
            <h3>Rejection Feedback</h3>
            <div class="feedback">
              {{ previewApp.feedback || 'No feedback provided.' }}
            </div>
          </div>

          <!-- ================= APPROVED ================= -->
          <div class="section" *ngIf="previewApp.status === 'APPROVED'">
            <h3>Approval Summary</h3>
            <div class="muted">
              This onboarding application has been approved.
            </div>
          </div>

          <!-- ================= PENDING ================= -->
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
        background: #fafafa;
      }
      .name {
        font-weight: 800;
      }
      .email {
        color: #6b7280;
        font-size: 13px;
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
        max-height: 85vh;
        background: #fff;
        border-radius: 16px;
        z-index: 51;
        display: flex;
        flex-direction: column;
        overflow: hidden;
      }
      .modal-hd {
        padding: 14px 16px;
        border-bottom: 1px solid #f3f4f6;
        display: flex;
        justify-content: space-between;
      }
      .title {
        font-weight: 900;
      }
      .sub {
        color: #6b7280;
        font-size: 13px;
      }
      .badge {
        padding: 4px 10px;
        border-radius: 999px;
        font-weight: 800;
        font-size: 12px;
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
      .modal-body {
        padding: 14px 16px;
        overflow: auto;
      }
      .grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
        gap: 10px;
      }
      .feedback {
        background: #fef2f2;
        padding: 10px;
        border-radius: 12px;
        color: #991b1b;
      }
      textarea {
        width: 100%;
        border-radius: 12px;
        border: 1px solid #e5e7eb;
        padding: 10px;
      }
      .actions {
        display: flex;
        gap: 10px;
        margin-top: 10px;
      }
      .btn-approve {
        border: 1px solid #16a34a;
        background: #ecfdf5;
        border-radius: 10px;
        padding: 6px 12px;
      }
      .btn-reject {
        border: 1px solid #ef4444;
        background: #fef2f2;
        border-radius: 10px;
        padding: 6px 12px;
      }
      .json {
        background: #0b1020;
        color: #e5e7eb;
        padding: 12px;
        border-radius: 12px;
      }
    `,
  ],
})
export class ApplicationsTabComponent {
  private api = inject(HiringManagementApiService);

  // ================= Lists =================
  pending: OnboardingApplicationListItem[] = [];
  approved: OnboardingApplicationListItem[] = [];
  rejected: OnboardingApplicationListItem[] = [];

  loadingPending = false;
  loadingApproved = false;
  loadingRejected = false;

  // ================= Preview Modal =================
  previewOpen = false;
  previewLoading = false;
  previewError = '';

  previewApp: OnboardingApplicationDetail | null = null;

  // ================= Employee =================
  employee: EmployeeDetail | null = null;
  employeeLoading = false;
  employeeError = '';
  selectedEmployeeId = '';

  // ================= Actions =================
  actionLoading = false;
  rejectFeedback = '';

  // ================= Lifecycle =================
  ngOnInit() {
    this.load('Pending');
    this.load('Approved');
    this.load('Rejected');
  }

  // ================= List Loading =================
  load(status: 'Pending' | 'Approved' | 'Rejected') {
    this.setListLoading(status, true);

    this.api.getOnboardingByStatus(status).subscribe({
      next: apps => this.assignList(status, apps),
      error: () => {},
      complete: () => this.setListLoading(status, false),
    });
  }

  private assignList(
    status: 'Pending' | 'Approved' | 'Rejected',
    apps: OnboardingApplicationListItem[]
  ) {
    if (status === 'Pending') this.pending = apps;
    if (status === 'Approved') this.approved = apps;
    if (status === 'Rejected') this.rejected = apps;
  }

  private setListLoading(
    status: 'Pending' | 'Approved' | 'Rejected',
    value: boolean
  ) {
    if (status === 'Pending') this.loadingPending = value;
    if (status === 'Approved') this.loadingApproved = value;
    if (status === 'Rejected') this.loadingRejected = value;
  }

  // ================= Preview =================
  openPreview(documentId: string, employeeId: string) {
    this.resetPreviewState();
    this.previewOpen = true;
    this.previewLoading = true;
    this.employeeLoading = true;
    this.selectedEmployeeId = employeeId;

    const application$ = this.api.getOnboardingDetail(documentId);
    const employee$ = employeeId
      ? this.api.getEmployeeDetail(employeeId)
      : of(null);

    forkJoin({
      application: application$,
      employee: employee$,
    }).subscribe({
      next: ({ application, employee }) => {
        console.log('Application loaded:', application);
        console.log('Employee loaded:', employee); // 👈 ADD THIS
        this.previewApp = application;
        this.employee = employee ?? null;

        if (application.status === 'REJECTED') {
          this.rejectFeedback = application.feedback ?? '';
        }
      },
      error: () => {
        this.previewError =
          'Failed to load application or employee information.';
      },
      complete: () => {
        this.previewLoading = false;
        this.employeeLoading = false;
      },
    });
  }

  closePreview() {
    this.previewOpen = false;
    this.resetPreviewState();
  }

  private resetPreviewState() {
    this.previewLoading = false;
    this.previewError = '';
    this.previewApp = null;

    this.employee = null;
    this.employeeLoading = false;
    this.employeeError = '';
    this.selectedEmployeeId = '';

    this.rejectFeedback = '';
    this.actionLoading = false;
  }

  // ================= Actions =================
  approveInModal() {
    if (!this.previewApp) return;

    this.actionLoading = true;

    this.api.approveOnboarding(this.previewApp.id).subscribe({
      next: () => {
        this.closePreview();
        this.load('Pending');
        this.load('Approved');
      },
      error: () => {
        this.previewError = 'Approve failed.';
        this.actionLoading = false;
      },
    });
  }

  rejectInModal() {
    if (!this.previewApp || !this.rejectFeedback.trim()) return;

    this.actionLoading = true;

    this.api
      .rejectOnboarding(this.previewApp.id, this.rejectFeedback.trim())
      .subscribe({
        next: () => {
          this.closePreview();
          this.load('Pending');
          this.load('Rejected');
        },
        error: () => {
          this.previewError = 'Reject failed.';
          this.actionLoading = false;
        },
      });
  }
}
