import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HiringManagementApiService } from './hiring-management-api.service';
import {
  RegistrationTokenHistoryItem,
  TokenHistoryItem,
} from './hiring-management.models';

@Component({
  standalone: true,
  selector: 'app-token-tab',
  imports: [CommonModule, FormsModule],
  template: `
    <!-- Generate Token -->
    <div class="card">
      <h2>Registration Token</h2>

      <div class="form">
        <input [(ngModel)]="fullName" placeholder="Employee Name" />
        <input [(ngModel)]="email" placeholder="Employee Email" />

        <button
          class="btn-primary"
          (click)="generate()"
          [disabled]="loading || !fullName || !email">
          {{ loading ? 'Sending...' : 'Generate token and send email' }}
        </button>
      </div>

      <div class="notice" *ngIf="lastLink">
        <b>Registration Link:</b>
        <a [href]="lastLink" target="_blank">{{ lastLink }}</a>
        <div class="muted">
          Expires at: {{ lastExpiresAt | date: 'medium' : 'UTC' }}
        </div>
      </div>
    </div>

    <!-- Token History -->
    <div class="card" style="margin-top:16px;">
      <h2>Token History</h2>

      <table *ngIf="history.length">
        <thead>
          <tr>
            <th>Name</th>
            <th>Email</th>
            <th>Registration Link</th>
            <th>Status</th>
            <th>Expires</th>
          </tr>
        </thead>

        <tbody>
          <tr *ngFor="let r of history">
            <td>{{ r.fullName }}</td>
            <td>{{ r.email }}</td>
            <td>
              <button class="mini" (click)="copy(r.registrationLink)">
                Copy
              </button>
            </td>
            <td>
              <span
                class="badge"
                [class.used]="r.status === 'USED'"
                [class.expired]="r.status === 'EXPIRED'">
                {{ r.status }}
              </span>
            </td>
            <td>{{ r.expiresAt | date: 'short' : 'UTC' }}</td>
          </tr>
        </tbody>
      </table>

      <div class="empty" *ngIf="!history.length">No token history found.</div>
    </div>
  `,
  styles: [
    `
      .card {
        border: 1px solid #e5e7eb;
        border-radius: 12px;
        padding: 16px;
        background: #fff;
      }
      .form {
        display: flex;
        gap: 12px;
        margin-top: 12px;
      }
      input {
        height: 38px;
        padding: 0 10px;
        border-radius: 8px;
        border: 1px solid #e5e7eb;
      }
      .btn-primary {
        background: #111827;
        color: #fff;
        border-radius: 8px;
        padding: 0 14px;
      }
      table {
        width: 100%;
        border-collapse: collapse;
        margin-top: 12px;
      }
      th,
      td {
        padding: 10px;
        border-bottom: 1px solid #e5e7eb;
      }
      th {
        background: #f9fafb;
        text-align: left;
      }
      .badge {
        padding: 4px 8px;
        border-radius: 999px;
        font-weight: 700;
      }
      .badge.used {
        background: #ecfdf5;
      }
      .badge.expired {
        background: #fef2f2;
      }
      .notice {
        margin-top: 12px;
      }
      .muted {
        color: #6b7280;
      }
      .empty {
        margin-top: 12px;
        color: #6b7280;
      }
    `,
  ],
})
export class TokenTabComponent {
  private api = inject(HiringManagementApiService);

  fullName = '';
  email = '';
  loading = false;
  lastLink: string | null = null;
  lastExpiresAt: string | null = null;

  history: RegistrationTokenHistoryItem[] = [];

  async copy(text: string) {
    try {
      await navigator.clipboard.writeText(text);
    } catch (err) {
      console.error('Copy failed', err);
    }
  }

  ngOnInit() {
    this.loadHistory();
  }

  generate() {
    this.loading = true;

    this.api
      .generateTokenAndSendEmail({
        email: this.email.trim(),
        name: this.fullName.trim(),
      })
      .subscribe({
        next: res => {
          this.lastLink = res.registrationLink;
          this.lastExpiresAt = res.expiresAt;
          this.loading = false;
          this.loadHistory();
        },
        error: () => (this.loading = false),
      });
  }

  loadHistory() {
    this.api.getTokenHistory().subscribe(items => {
      this.history = items.map(item => this.mapToUI(item));
    });
  }

  private mapToUI(item: TokenHistoryItem): RegistrationTokenHistoryItem {
    const created = new Date(item.createdAt);
    const expires = new Date(created.getTime() + 3 * 60 * 60 * 1000);

    let status: 'USED' | 'UNUSED' | 'EXPIRED' = 'UNUSED';
    if (item.isUsed) status = 'USED';
    else if (new Date() > expires) status = 'EXPIRED';

    return {
      fullName: item.name,
      email: item.email,
      registrationLink: item.link,
      status,
      expiresAt: expires.toISOString(),
    };
  }
}
