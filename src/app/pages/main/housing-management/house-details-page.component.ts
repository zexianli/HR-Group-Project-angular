// src/app/housing/pages/house-details-page.component.ts
import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { HousingApiService } from './housing-api.service';
import { HouseDetails, FacilityReport, PagedResult } from './models';

import { MatCardModule } from '@angular/material/card';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatButtonModule } from '@angular/material/button';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';

import { ReportCardComponent } from './report-card.component';

@Component({
  standalone: true,
  selector: 'app-house-details-page',
  imports: [
    CommonModule,
    RouterModule,
    MatCardModule,
    MatTableModule,
    MatPaginatorModule,
    MatButtonModule,
    MatSnackBarModule,
    ReportCardComponent,
  ],
  template: `
    <div class="page" *ngIf="house; else loading">
      <!-- Header -->
      <div class="topbar">
        <a mat-button routerLink="/housing-management">← Back</a>

        <div class="titleBlock">
          <h1>{{ house.address }}</h1>
          <div class="sub">
            Landlord:
            {{ house.landlord.fullName }} · {{ house.landlord.phone }} ·
            {{ house.landlord.email }}
            · Residents: {{ house.residents.length }}
          </div>
        </div>
      </div>

      <div class="layout">
        <!-- Facility Information -->
        <mat-card class="card">
          <mat-card-title>Facility Information</mat-card-title>
          <mat-card-content class="kv">
            <div class="kvRow">
              <div class="k">Bedrooms</div>
              <div class="v">{{ house.facility.bedrooms }}</div>
            </div>
            <div class="kvRow">
              <div class="k">Bathrooms</div>
              <div class="v">{{ house.facility.bathrooms }}</div>
            </div>
            <div class="kvRow">
              <div class="k">Mattresses</div>
              <div class="v">{{ house.facility.mattresses }}</div>
            </div>
            <div class="kvRow">
              <div class="k">Tables</div>
              <div class="v">{{ house.facility.tables }}</div>
            </div>
            <div class="kvRow">
              <div class="k">Chairs</div>
              <div class="v">{{ house.facility.chairs }}</div>
            </div>
          </mat-card-content>
        </mat-card>

        <!-- Employee Residents -->
        <mat-card class="card">
          <mat-card-title>Employee Residents</mat-card-title>

          <mat-card-content *ngIf="house.residents.length; else noResidents">
            <table mat-table [dataSource]="house.residents" class="table">
              <ng-container matColumnDef="name">
                <th mat-header-cell *matHeaderCellDef>Name</th>
                <td mat-cell *matCellDef="let r">{{ r.displayName }}</td>
              </ng-container>

              <ng-container matColumnDef="phone">
                <th mat-header-cell *matHeaderCellDef>Phone</th>
                <td mat-cell *matCellDef="let r">{{ r.phone }}</td>
              </ng-container>

              <ng-container matColumnDef="email">
                <th mat-header-cell *matHeaderCellDef>Email</th>
                <td mat-cell *matCellDef="let r">{{ r.email }}</td>
              </ng-container>

              <ng-container matColumnDef="car">
                <th mat-header-cell *matHeaderCellDef>Car</th>
                <td mat-cell *matCellDef="let r">
                  <span class="muted" *ngIf="!r.car">—</span>
                  <span *ngIf="r.car">
                    {{ r.car.make }} {{ r.car.model }} {{ r.car.color }}
                  </span>
                </td>
              </ng-container>

              <tr mat-header-row *matHeaderRowDef="residentCols"></tr>
              <tr mat-row *matRowDef="let row; columns: residentCols"></tr>
            </table>
          </mat-card-content>

          <ng-template #noResidents>
            <mat-card-content class="muted"
              >No residents assigned</mat-card-content
            >
          </ng-template>
        </mat-card>
      </div>
    </div>

    <ng-template #loading>
      <div class="page muted">Loading…</div>
    </ng-template>
  `,
  styles: [
    `
      /* Page */
      .page {
        padding: 24px;
        max-width: 1200px;
        margin: 0 auto;
        background: linear-gradient(180deg, #ffffff 0%, #f9fafb 100%);
      }

      /* Header */
      .topbar {
        display: flex;
        gap: 16px;
        align-items: flex-start;
        margin-bottom: 24px;
      }

      .titleBlock h1 {
        margin: 0;
        font-size: 28px;
        font-weight: 700;
        letter-spacing: -0.02em;
      }

      .sub {
        margin-top: 6px;
        color: #6b7280; /* gray-500 */
        font-size: 14px;
        line-height: 1.5;
      }

      /* Layout */
      .layout {
        display: grid;
        grid-template-columns: 1fr;
        gap: 20px;
      }

      /* Cards */
      .card {
        border-radius: 18px;
        box-shadow: 0 6px 18px rgba(0, 0, 0, 0.06);
        transition:
          box-shadow 0.15s ease,
          transform 0.15s ease;
        background: #ffffff;
      }

      .card:hover {
        box-shadow: 0 12px 28px rgba(0, 0, 0, 0.08);
        transform: translateY(-1px);
      }

      mat-card-title {
        font-size: 18px;
        font-weight: 600;
        padding-bottom: 4px;
      }

      /* Facility key-value grid */
      .kv {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
        gap: 12px 20px;
        margin-top: 12px;
      }

      .kvRow {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 10px 12px;
        border-radius: 12px;
        background: #f9fafb;
      }

      .k {
        font-size: 13px;
        font-weight: 600;
        color: #6b7280;
        text-transform: uppercase;
        letter-spacing: 0.04em;
      }

      .v {
        font-size: 16px;
        font-weight: 700;
        color: #111827;
      }

      /* Table */
      .table {
        width: 100%;
        margin-top: 12px;
        border-radius: 12px;
        overflow: hidden;
      }

      th.mat-header-cell {
        font-size: 12px;
        text-transform: uppercase;
        letter-spacing: 0.05em;
        color: #6b7280;
        font-weight: 600;
        background: #f9fafb;
      }

      td.mat-cell {
        padding: 14px 12px;
        font-size: 14px;
        color: #111827;
      }

      tr.mat-row:hover {
        background: #f9fafb;
      }

      /* Muted text */
      .muted {
        color: #6b7280;
        font-size: 13px;
      }

      /* Reports */
      .reportList {
        display: grid;
        gap: 16px;
        margin: 16px 0;
      }

      mat-paginator {
        margin-top: 12px;
        border-top: 1px solid #e5e7eb;
      }

      /* Back link */
      a[mat-button] {
        font-weight: 500;
      }

      /* Loading */
      .page.muted {
        text-align: center;
        padding: 48px;
        font-size: 14px;
      }

      /* Mobile */
      @media (max-width: 640px) {
        .topbar {
          flex-direction: column;
        }

        .kv {
          grid-template-columns: 1fr;
        }
      }
    `,
  ],
})
export class HouseDetailsPageComponent {
  private api = inject(HousingApiService);
  private route = inject(ActivatedRoute);
  private snack = inject(MatSnackBar);

  // TODO: replace with real HR user id from auth
  currentUserId = 'CURRENT_HR_USER_ID';

  house: HouseDetails | null = null;

  reports: FacilityReport[] = [];
  reportsTotal = 0;

  pageIndex = 0;
  pageSize = 5;

  residentCols = ['name', 'phone', 'email', 'car'];

  ngOnInit() {
    const houseId = this.route.snapshot.paramMap.get('houseId')!;
    this.loadHouse(houseId);
    this.loadReports(houseId, 1, this.pageSize);
  }

  private loadHouse(houseId: string) {
    this.api.getHouse(houseId).subscribe({
      next: h => (this.house = h),
      error: () =>
        this.snack.open('Failed to load house details', 'Close', {
          duration: 2500,
        }),
    });
  }

  private loadReports(houseId: string, page: number, pageSize: number) {
    this.api.listReports(houseId, page, pageSize).subscribe({
      next: (res: PagedResult<FacilityReport>) => {
        this.reports = res.items ?? [];
        this.reportsTotal = res.total ?? 0;
      },
      error: () =>
        this.snack.open('Failed to load reports', 'Close', { duration: 2500 }),
    });
  }

  onPage(ev: PageEvent) {
    if (!this.house) return;
    this.pageIndex = ev.pageIndex;
    this.pageSize = ev.pageSize;
    this.loadReports(this.house.id, this.pageIndex + 1, this.pageSize);
  }
}
