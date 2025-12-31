import { Component, EventEmitter, Input, Output } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { Store } from '@ngrx/store';
import { switchMap, take } from 'rxjs';
import { VisaManagementService } from 'src/app/service/visa-managament.service';
import { selectToken } from 'src/app/store/selectors/auth.selectors';

@Component({
  selector: 'visa-management-approve',
  standalone: true,
  templateUrl: './approve.component.html',
  styleUrls: ['./approve.component.css'],
  imports: [MatButtonModule],
})
export class ApproveComponent {
  constructor(
    private store: Store,
    private visaManagementService: VisaManagementService
  ) {}

  @Input() documentId!: string | undefined;
  @Output() close = new EventEmitter<void>();

  closeDialog() {
    console.log(this.documentId);
    this.close.emit();
  }

  approveDocument() {
    if (!this.documentId) {
      console.error('No documentId provided');
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
          return this.visaManagementService.approveDocument(
            token,
            this.documentId!
          );
        })
      )
      .subscribe({
        next: response => {
          console.log('Approved successfully:', response);
          this.close.emit(); // close overlay/dialog
        },
        error: err => {
          console.error('Approve failed:', err);
        },
      });

    this.closeDialog();
  }
}
