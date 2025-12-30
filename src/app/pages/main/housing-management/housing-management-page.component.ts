// src/app/housing/pages/housing-management-page.component.ts
import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { HousingApiService } from './housing-api.service';
import { HouseSummary } from './models';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { AddHouseDialogComponent } from './add-house-dialog.component';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';

@Component({
  standalone: true,
  selector: 'app-housing-management-page',
  imports: [
    CommonModule,
    RouterModule,
    MatCardModule,
    MatButtonModule,
    MatDialogModule,
    MatIconModule,
    MatSnackBarModule,
  ],
  template: `
    <div class="page">
      <div class="header">
        <h1>Housing Management</h1>
        <button mat-flat-button color="primary" (click)="openAdd()">
          <mat-icon>add</mat-icon>
          Add house
        </button>
      </div>

      <div class="grid" *ngIf="houses?.length; else empty">
        <mat-card class="house" *ngFor="let h of houses">
          <mat-card-title>{{ h.address }}</mat-card-title>

          <mat-card-content class="content">
            <div class="row">
              <div class="label">Landlord</div>
              <div class="value">
                <div>{{ h.landlord.fullName }}</div>
                <div class="muted">
                  {{ h.landlord.phone }} · {{ h.landlord.email }}
                </div>
              </div>
            </div>

            <div class="row">
              <div class="label">Residents</div>
              <div class="value">{{ h.employeeResidentCount }}</div>
            </div>
          </mat-card-content>

          <mat-card-actions align="end">
            <a mat-button [routerLink]="['/housing', h.id]">View details</a>
          </mat-card-actions>
        </mat-card>
      </div>

      <ng-template #empty>
        <mat-card>
          <mat-card-content>No houses yet.</mat-card-content>
        </mat-card>
      </ng-template>
    </div>
  `,
  styles: [
    `
      /* Page container */
      .page {
        padding: 24px;
        max-width: 1200px;
        margin: 0 auto;
        background: linear-gradient(180deg, #ffffff 0%, #f9fafb 100%);
      }

      /* Header */
      .header {
        display: flex;
        align-items: center;
        justify-content: space-between;
        margin-bottom: 24px;
        gap: 16px;
      }

      .header h1 {
        font-size: 28px;
        font-weight: 700;
        margin: 0;
        letter-spacing: -0.02em;
      }

      /* Card grid */
      .grid {
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(340px, 1fr));
        gap: 20px;
      }

      /* House card */
      .house {
        border-radius: 18px;
        transition:
          transform 0.15s ease,
          box-shadow 0.15s ease;
        box-shadow: 0 6px 18px rgba(0, 0, 0, 0.06);
        background: #ffffff;
      }

      .house:hover {
        transform: translateY(-2px);
        box-shadow: 0 12px 28px rgba(0, 0, 0, 0.08);
      }

      mat-card-title {
        font-size: 18px;
        font-weight: 600;
        line-height: 1.4;
        padding-bottom: 8px;
      }

      /* Card content */
      .content {
        display: grid;
        gap: 14px;
        margin-top: 8px;
      }

      .row {
        display: flex;
        justify-content: space-between;
        align-items: flex-start;
        gap: 16px;
      }

      .label {
        font-size: 13px;
        font-weight: 600;
        color: #6b7280; /* gray-500 */
        text-transform: uppercase;
        letter-spacing: 0.04em;
        min-width: 80px;
      }

      .value {
        text-align: right;
        flex: 1;
      }

      .value > div:first-child {
        font-weight: 600;
        color: #111827; /* gray-900 */
      }

      .muted {
        color: #6b7280;
        font-size: 13px;
        margin-top: 2px;
      }

      /* Actions */
      mat-card-actions {
        padding: 8px 16px 16px;
      }

      mat-card-actions a {
        font-weight: 500;
      }

      /* Empty state */
      mat-card mat-card-content {
        color: #6b7280;
        text-align: center;
        padding: 32px 16px;
        font-size: 14px;
      }

      /* Mobile tweaks */
      @media (max-width: 600px) {
        .header {
          flex-direction: column;
          align-items: flex-start;
        }

        .value {
          text-align: left;
        }
      }
    `,
  ],
})
export class HousingManagementPageComponent {
  private api = inject(HousingApiService);
  private dialog = inject(MatDialog);
  private snack = inject(MatSnackBar);

  houses: HouseSummary[] = [];

  ngOnInit() {
    this.reload();
  }

  reload() {
    this.api.listHouses().subscribe({
      next: data => (this.houses = data ?? []),
      error: () =>
        this.snack.open('Failed to load houses', 'Close', { duration: 2500 }),
    });
  }

  openAdd() {
    const ref = this.dialog.open(AddHouseDialogComponent, {
      width: '800px',
      maxHeight: '90vh', // ✅ IMPORTANT
      autoFocus: false,
    });

    ref.afterClosed().subscribe(payload => {
      if (!payload) return;

      this.api.createHouse(payload).subscribe({
        next: () => {
          this.snack.open('House created', 'Close', { duration: 2000 });
          this.reload();
        },
        error: () =>
          this.snack.open('Failed to create house', 'Close', {
            duration: 2500,
          }),
      });
    });
  }

  deleteHouse(h: HouseSummary) {
    // keep it simple; you can swap with MatDialog confirm
    if (!confirm(`Delete this house?\n\n${h.address}`)) return;

    this.api.deleteHouse(h.id).subscribe({
      next: () => {
        this.houses = this.houses.filter(x => x.id !== h.id);
        this.snack.open('House deleted', 'Close', { duration: 2000 });
      },
      error: () =>
        this.snack.open('Failed to delete house', 'Close', { duration: 2500 }),
    });
  }
}
