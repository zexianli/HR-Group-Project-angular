// src/app/housing/components/report-card.component.ts
import { Component, Input, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FacilityReport, ReportComment } from './models';
import { HousingApiService } from './housing-api.service';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatChipsModule } from '@angular/material/chips';
import { MatButtonModule } from '@angular/material/button';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';

@Component({
  standalone: true,
  selector: 'app-report-card',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatCardModule,
    MatChipsModule,
    MatButtonModule,
    MatSnackBarModule,
    MatFormFieldModule,
    MatInputModule,
  ],
  template: `
    <mat-card class="report">
      <mat-card-title class="titleRow">
        <span>{{ report.title }}</span>
        <mat-chip-set>
          <mat-chip [ngClass]="report.status">{{
            label(report.status)
          }}</mat-chip>
        </mat-chip-set>
      </mat-card-title>

      <mat-card-subtitle>
        {{ report.createdByName }} · {{ report.createdAt | date: 'medium' }}
      </mat-card-subtitle>

      <mat-card-content>
        <p class="desc">{{ report.description }}</p>

        <div class="comments">
          <div class="commentsTitle">Comments</div>

          <div class="comment" *ngFor="let c of report.comments">
            <div class="bubble">
              <div class="commentText">{{ c.description }}</div>
              <div class="meta">
                <span class="by">{{ c.createdByName }}</span>
                <span>·</span>
                <span>{{ c.updatedAt ?? c.createdAt | date: 'short' }}</span>
                <span *ngIf="isMine(c)" class="mineTag">You</span>
              </div>
            </div>

            <button
              *ngIf="isMine(c)"
              mat-button
              (click)="startEdit(c)"
              class="editBtn">
              Edit
            </button>
          </div>

          <form class="composer" [formGroup]="form" (ngSubmit)="submit()">
            <mat-form-field appearance="outline" class="full">
              <mat-label>{{
                editingCommentId ? 'Update your comment' : 'Add a comment'
              }}</mat-label>
              <textarea
                matInput
                rows="3"
                formControlName="description"></textarea>
            </mat-form-field>

            <div class="actions">
              <button
                *ngIf="editingCommentId"
                mat-button
                type="button"
                (click)="cancelEdit()">
                Cancel
              </button>

              <button
                mat-flat-button
                color="primary"
                type="submit"
                [disabled]="form.invalid || saving">
                {{ editingCommentId ? 'Update' : 'Post' }}
              </button>
            </div>
          </form>
        </div>
      </mat-card-content>
    </mat-card>
  `,
  styles: [
    `
      .report {
        border-radius: 16px;
      }
      .titleRow {
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 10px;
      }
      .desc {
        margin: 10px 0 12px;
        color: rgba(0, 0, 0, 0.75);
        white-space: pre-wrap;
      }
      mat-chip.OPEN {
      }
      mat-chip.IN_PROGRESS {
      }
      mat-chip.CLOSED {
      }

      .comments {
        margin-top: 8px;
        display: grid;
        gap: 10px;
      }
      .commentsTitle {
        font-weight: 700;
      }
      .comment {
        display: flex;
        align-items: flex-start;
        justify-content: space-between;
        gap: 10px;
      }
      .bubble {
        flex: 1;
        padding: 10px 12px;
        border: 1px solid rgba(0, 0, 0, 0.08);
        border-radius: 12px;
        background: rgba(0, 0, 0, 0.02);
      }
      .commentText {
        white-space: pre-wrap;
      }
      .meta {
        display: flex;
        gap: 8px;
        margin-top: 6px;
        font-size: 12px;
        color: rgba(0, 0, 0, 0.6);
        align-items: center;
        flex-wrap: wrap;
      }
      .mineTag {
        padding: 1px 8px;
        border-radius: 999px;
        border: 1px solid rgba(0, 0, 0, 0.12);
        font-size: 11px;
      }
      .editBtn {
        margin-top: 4px;
      }
      .composer {
        display: grid;
        gap: 8px;
      }
      .full {
        width: 100%;
      }
      .actions {
        display: flex;
        justify-content: flex-end;
        gap: 10px;
      }
    `,
  ],
})
export class ReportCardComponent {
  private api = inject(HousingApiService);
  private fb = inject(FormBuilder);
  private snack = inject(MatSnackBar);

  /** You should wire this from your auth state */
  @Input({ required: true }) currentUserId!: string;

  @Input({ required: true }) houseId!: string;
  @Input({ required: true }) report!: FacilityReport;

  saving = false;
  editingCommentId: string | null = null;

  form = this.fb.group({
    description: [
      '',
      [
        Validators.required,
        Validators.minLength(1),
        Validators.maxLength(2000),
      ],
    ],
  });

  label(s: string) {
    return s === 'OPEN'
      ? 'Open'
      : s === 'IN_PROGRESS'
        ? 'In Progress'
        : 'Closed';
  }

  isMine(c: ReportComment) {
    return c.createdById === this.currentUserId;
  }

  startEdit(c: ReportComment) {
    this.editingCommentId = c.id;
    this.form.patchValue({ description: c.description });
  }

  cancelEdit() {
    this.editingCommentId = null;
    this.form.reset({ description: '' });
  }

  submit() {
    if (this.form.invalid) return;
    const description = this.form.value.description!.trim();
    if (!description) return;

    this.saving = true;

    const done = {
      next: (saved: ReportComment) => {
        // optimistic update in-place (simple, no re-fetch required)
        if (this.editingCommentId) {
          const idx = this.report.comments.findIndex(
            c => c.id === this.editingCommentId
          );
          if (idx >= 0)
            this.report.comments[idx] = {
              ...this.report.comments[idx],
              ...saved,
            };
          this.snack.open('Comment updated', 'Close', { duration: 2000 });
        } else {
          this.report.comments = [...this.report.comments, saved];
          this.snack.open('Comment posted', 'Close', { duration: 2000 });
        }

        this.cancelEdit();
        this.saving = false;
      },
      error: () => {
        this.saving = false;
        this.snack.open('Failed to save comment', 'Close', { duration: 2500 });
      },
    };

    if (this.editingCommentId) {
      this.api
        .updateMyComment(this.houseId, this.report.id, this.editingCommentId, {
          description,
        })
        .subscribe(done);
    } else {
      this.api
        .addComment(this.houseId, this.report.id, { description })
        .subscribe(done);
    }
  }
}
