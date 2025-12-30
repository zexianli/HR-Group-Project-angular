import { Component, inject } from '@angular/core';
import { FormBuilder, Validators, ReactiveFormsModule } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';

@Component({
  standalone: true,
  selector: 'app-add-house-dialog',
  imports: [
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
  ],
  template: `
    <h2>Add New House</h2>

    <form [formGroup]="form" (ngSubmit)="submit()" class="form">
      <!-- Address -->
      <h3>Address</h3>

      <mat-form-field appearance="outline">
        <mat-label>Unit</mat-label>
        <input matInput formControlName="unit" />
      </mat-form-field>

      <mat-form-field appearance="outline">
        <mat-label>Street</mat-label>
        <input matInput formControlName="street" required />
      </mat-form-field>

      <div class="row">
        <mat-form-field appearance="outline">
          <mat-label>City</mat-label>
          <input matInput formControlName="city" required />
        </mat-form-field>

        <mat-form-field appearance="outline">
          <mat-label>State</mat-label>
          <input matInput formControlName="state" required />
        </mat-form-field>

        <mat-form-field appearance="outline">
          <mat-label>ZIP</mat-label>
          <input matInput formControlName="zip" required />
        </mat-form-field>
      </div>

      <!-- Landlord -->
      <h3>Landlord</h3>

      <mat-form-field appearance="outline">
        <mat-label>Full Name</mat-label>
        <input matInput formControlName="landlordName" required />
      </mat-form-field>

      <mat-form-field appearance="outline">
        <mat-label>Phone</mat-label>
        <input matInput formControlName="landlordPhone" required />
      </mat-form-field>

      <mat-form-field appearance="outline">
        <mat-label>Email</mat-label>
        <input matInput formControlName="landlordEmail" required />
      </mat-form-field>

      <!-- Facility -->
      <h3>Facility</h3>

      <div class="row">
        <mat-form-field appearance="outline">
          <mat-label>Bedrooms</mat-label>
          <input matInput type="number" formControlName="bedrooms" required />
        </mat-form-field>

        <mat-form-field appearance="outline">
          <mat-label>Bathrooms</mat-label>
          <input matInput type="number" formControlName="bathrooms" required />
        </mat-form-field>

        <mat-form-field appearance="outline">
          <mat-label>Mattresses</mat-label>
          <input matInput type="number" formControlName="mattresses" required />
        </mat-form-field>

        <mat-form-field appearance="outline">
          <mat-label>Tables</mat-label>
          <input matInput type="number" formControlName="tables" required />
        </mat-form-field>

        <mat-form-field appearance="outline">
          <mat-label>Chairs</mat-label>
          <input matInput type="number" formControlName="chairs" required />
        </mat-form-field>
      </div>

      <!-- Description -->
      <mat-form-field appearance="outline">
        <mat-label>Description</mat-label>
        <textarea matInput rows="3" formControlName="description"></textarea>
      </mat-form-field>

      <!-- Actions -->
      <div class="actions">
        <button mat-button type="button" (click)="ref.close()">Cancel</button>
        <button
          mat-flat-button
          color="primary"
          type="submit"
          [disabled]="form.invalid">
          Create House
        </button>
      </div>
    </form>
  `,
  styles: [
    `
      :host {
        display: block;
      }

      h2 {
        margin: 0 0 12px;
        font-size: 24px;
        font-weight: 700;
        letter-spacing: -0.02em;
      }

      h3 {
        margin: 20px 0 4px;
        font-size: 14px;
        font-weight: 700;
        color: #374151; /* gray-700 */
        text-transform: uppercase;
        letter-spacing: 0.06em;
      }

      /* Form layout */
      .form {
        display: grid;
        gap: 14px;
        width: min(760px, 96vw);
      }

      /* Grouped rows */
      .row {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(140px, 1fr));
        gap: 12px;
      }

      /* Material fields */
      mat-form-field {
        width: 100%;
      }

      mat-form-field.mat-form-field-appearance-outline .mat-form-field-outline {
        background: #ffffff;
      }

      /* Numeric inputs feel compact */
      input[type='number'] {
        text-align: right;
      }

      /* Section card feel */
      h3 + mat-form-field,
      h3 + .row {
        margin-top: 8px;
      }

      /* Description textarea */
      textarea {
        resize: vertical;
      }

      /* Footer actions */
      .actions {
        display: flex;
        justify-content: flex-end;
        gap: 12px;
        padding-top: 16px;
        margin-top: 8px;
        border-top: 1px solid #e5e7eb; /* gray-200 */
      }

      /* Primary button emphasis */
      button[mat-flat-button] {
        min-width: 140px;
        font-weight: 600;
      }

      /* Mobile tweaks */
      @media (max-width: 600px) {
        h2 {
          font-size: 20px;
        }

        .actions {
          flex-direction: column-reverse;
          align-items: stretch;
        }

        button {
          width: 100%;
        }
      }
    `,
  ],
})
export class AddHouseDialogComponent {
  private fb = inject(FormBuilder);
  ref = inject(MatDialogRef<AddHouseDialogComponent>);

  form = this.fb.group({
    unit: [''],
    street: ['', Validators.required],
    city: ['', Validators.required],
    state: ['', Validators.required],
    zip: ['', Validators.required],

    landlordName: ['', Validators.required],
    landlordPhone: ['', Validators.required],
    landlordEmail: ['', [Validators.required, Validators.email]],

    bedrooms: [1, Validators.required],
    bathrooms: [1, Validators.required],
    mattresses: [1, Validators.required],
    tables: [0, Validators.required],
    chairs: [0, Validators.required],

    description: [''],
  });

  submit() {
    if (this.form.invalid) return;

    const v = this.form.value;

    this.ref.close({
      address: {
        unit: v.unit || '',
        street: v.street!,
        city: v.city!,
        state: v.state!,
        zip: v.zip!,
      },
      landlord: {
        fullName: v.landlordName!,
        phone: v.landlordPhone!,
        email: v.landlordEmail!,
      },
      facility: {
        bedrooms: Number(v.bedrooms),
        bathrooms: Number(v.bathrooms),
        mattresses: Number(v.mattresses),
        tables: Number(v.tables),
        chairs: Number(v.chairs),
      },
      status: 'ACTIVE',
      description: v.description || '',
    });
  }
}
