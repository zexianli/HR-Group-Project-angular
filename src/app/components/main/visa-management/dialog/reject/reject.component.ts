import { Component, EventEmitter, Input, Output } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { Store } from '@ngrx/store';
import { switchMap, take } from 'rxjs';
import { VisaManagementService } from 'src/app/service/visa-managament.service';
import { selectToken } from 'src/app/store/selectors/auth.selectors';

@Component({
  selector: 'visa-management-reject',
  standalone: true,
  templateUrl: './reject.component.html',
  styleUrls: ['./reject.component.css'],
  imports: [MatButtonModule],
})
export class RejectComponent {
  constructor(
    private store: Store,
    private visaManagementService: VisaManagementService
  ) {}

  @Input() documentId!: string | undefined;
  @Output() close = new EventEmitter<void>();
  feedbackErrMsg = '';

  closeDialog() {
    this.close.emit();
  }

  rejectDocument(feedback: string) {
    if (!this.documentId) {
      console.error('No documentId provided');
      return;
    }
    // validate feedback
    if (feedback.length < 100) {
      this.feedbackErrMsg = 'Minimal 100 characters';
      return;
    }

    this.store
      .select(selectToken)
      .pipe(
        take(1),
        switchMap(token => {
          if (!token) {
            throw new Error('No auth token');
          }
          return this.visaManagementService.rejectDocument(
            token,
            this.documentId!,
            feedback
          );
        })
      )
      .subscribe({
        next: response => {
          console.log('Rejected successfully:', response);
          this.close.emit(); // close overlay/dialog
        },
        error: err => {
          console.error('Reject failed:', err);
        },
      });

    this.closeDialog();
  }
}
