import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Store } from '@ngrx/store';
import { switchMap, take } from 'rxjs';
import { EmployeeProfileService } from 'src/app/service/employee-profile.service';
import { selectToken } from 'src/app/store/selectors/auth.selectors';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { EmployeeProfileObject } from 'src/model/employee-profile.model';

@Component({
  selector: 'employee-profile-card',
  standalone: true,
  templateUrl: './card.component.html',
  styleUrls: ['./card.component.css'],
  imports: [CommonModule, MatProgressSpinnerModule],
})
export class EPCardComponent implements OnInit {
  constructor(
    private store: Store,
    private employeeProfileService: EmployeeProfileService
  ) {}

  @Input() employeeId!: string;
  @Output() close = new EventEmitter<void>();

  employeeProfile: EmployeeProfileObject | null = null;
  isLoading = true;
  ngOnInit(): void {
    this.store
      .select(selectToken)
      .pipe(
        take(1),
        switchMap(token => {
          if (!token) {
            throw new Error('Token invalid:: getEmployeeSummary');
          }
          return this.employeeProfileService.getEmployeeProfile(
            token,
            this.employeeId
          );
        })
      )
      .subscribe({
        next: data => {
          // this.employeeSummaries = data;
          // console.log(data);
          this.employeeProfile = new EmployeeProfileObject(data.employee);
          console.log(this.employeeProfile);
          this.isLoading = false;
          // console.log('employeeSummaries:', data.employees);
        },
        error: err => {
          this.isLoading = false;
          console.error('Getting employee summary error: ', err);
        },
      });
  }

  closeCard() {
    this.close.emit();
  }
}
