import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HiringManagementApiService } from './hiring-management-api.service';
import { TokenTabComponent } from './token-tab.component';
import { ApplicationsTabComponent } from './applications-tab.component';

@Component({
  standalone: true,
  selector: 'app-hiring-management-page',
  imports: [CommonModule, TokenTabComponent, ApplicationsTabComponent],
  template: `
    <div class="page">
      <header class="header">
        <div>
          <h1>Hiring Management</h1>
          <p class="sub">
            Generate registration tokens and review onboarding applications.
          </p>
        </div>
      </header>

      <div class="tabs">
        <button
          class="tab"
          [class.active]="activeTab === 'tokens'"
          (click)="activeTab = 'tokens'">
          Registration Tokens
        </button>
        <button
          class="tab"
          [class.active]="activeTab === 'apps'"
          (click)="activeTab = 'apps'">
          Onboarding Application Review
        </button>
      </div>

      <section class="content">
        <app-token-tab *ngIf="activeTab === 'tokens'"></app-token-tab>
        <app-applications-tab
          *ngIf="activeTab === 'apps'"></app-applications-tab>
      </section>
    </div>
  `,
  styles: [
    `
      .page {
        padding: 24px;
        max-width: 1100px;
        margin: 0 auto;
      }
      .header {
        display: flex;
        align-items: flex-end;
        justify-content: space-between;
        gap: 16px;
        margin-bottom: 16px;
      }
      h1 {
        margin: 0;
        font-size: 28px;
        letter-spacing: -0.02em;
      }
      .sub {
        margin: 6px 0 0;
        color: #6b7280;
      }
      .tabs {
        display: flex;
        gap: 8px;
        margin: 18px 0;
      }
      .tab {
        padding: 10px 12px;
        border: 1px solid #e5e7eb;
        background: #fff;
        border-radius: 10px;
        cursor: pointer;
        font-weight: 600;
        color: #111827;
      }
      .tab.active {
        border-color: #111827;
        box-shadow: 0 1px 0 rgba(0, 0, 0, 0.06);
      }
      .content {
        margin-top: 8px;
      }
    `,
  ],
})
export class HiringManagementPageComponent {
  activeTab: 'tokens' | 'apps' = 'tokens';
  api = inject(HiringManagementApiService);
}
