import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { MatTabsModule } from '@angular/material/tabs';
import { Store } from '@ngrx/store';
import { switchMap, take } from 'rxjs';
import {
  VMAllEmployees,
  VMAllEmployeesApprovedDoc,
  VMAllEmployeesResponse,
  VMPendingEmployees,
  VMPendingEmployeesPendingDoc,
  VMPendingEmployeesResponse,
} from 'src/app/interfaces/visa-management.interface';
import { VisaManagementService } from 'src/app/service/visa-managament.service';
import { selectToken } from 'src/app/store/selectors/auth.selectors';
import { formatDate, formatWorkAuth } from 'src/app/utils/employee';
import { MatButtonModule } from '@angular/material/button';
import { ApproveComponent } from 'src/app/components/main/visa-management/dialog/approve/approve.component';
import { RejectComponent } from 'src/app/components/main/visa-management/dialog/reject/reject.component';

@Component({
  selector: 'app-visa-management',
  standalone: true,
  templateUrl: './visa-management.component.html',
  styleUrls: ['./visa-management.component.css'],
  imports: [
    CommonModule,
    MatTabsModule,
    MatButtonModule,
    RejectComponent,
    ApproveComponent,
  ],
})
export class VisaManagementComponent implements OnInit {
  constructor(
    private store: Store,
    private visaManagementService: VisaManagementService
  ) {}

  pendingEmployees: VMPendingEmployeesResponse | null = null;
  allEmployees: VMAllEmployeesResponse | null = null;
  selectedEmployee: VMPendingEmployees | null = null;
  selectedEmployeeAllEmployees: VMAllEmployees | null = null;
  isLoading = true;
  isSelected = false;
  isSelectedAllEmployees = false;
  showApproveDialog = false;
  showRejectDialog = false;

  // fetch API for in-progress and all
  ngOnInit(): void {
    // fetch in-progress
    this.store
      .select(selectToken)
      .pipe(
        take(1),
        switchMap(token => {
          if (!token) {
            throw new Error('Token invalid:: getVMPendingEmployee');
          }
          return this.visaManagementService.getVMPendingEmployee(token);
        })
      )
      .subscribe({
        next: data => {
          this.pendingEmployees = data;
          this.isLoading = false;
          console.log('VM pending employees:', data.employees);
        },
        error: err => {
          this.isLoading = false;
          console.error(
            'Getting Visa Management pending employee error: ',
            err
          );
        },
      });

    // fetch all
    this.store
      .select(selectToken)
      .pipe(
        take(1),
        switchMap(token => {
          if (!token) {
            throw new Error('Token invalid:: getVMAllEmployee');
          }
          return this.visaManagementService.getVMAllEmployee(token);
        })
      )
      .subscribe({
        next: data => {
          this.allEmployees = data;
          this.isLoading = false;
          console.log('VM all employees:', data.employees);
        },
        error: err => {
          this.isLoading = false;
          console.error('Getting Visa Management all employee error: ', err);
        },
      });
  }

  vmFormatDate(date: string | undefined) {
    return formatDate(date || '');
  }

  vmFormatWorkAuth(date: string | undefined) {
    return formatWorkAuth(date || '');
  }

  daysToYMD(days: number | undefined): string {
    if (days === 0) {
      return 'Expired Today';
    }
    if (days === undefined) {
      return 'N/A';
    }

    const years = Math.abs(Math.floor(days / 365));
    days %= 365;

    const months = Math.abs(Math.floor(days / 30));
    days %= 30;

    const starter = days < 0 ? 'Expired from: ' : 'Remains until: ';
    const ender = days < 0 ? ' ago' : 'later';

    return (
      starter + years + 'Y, ' + months + 'M, ' + Math.abs(days) + 'D' + ender
    );
  }

  handleClickEmployeeCardPendingEmployees(employee: VMPendingEmployees) {
    this.isSelected = true;
    this.selectedEmployee = employee;
    console.log(employee);
  }

  handleClickEmployeeCardAllEmployees(employee: VMAllEmployees) {
    this.isSelectedAllEmployees = true;
    this.selectedEmployeeAllEmployees = employee;
    console.log(employee);
  }

  // approve functions
  handleOpenApproveDialog() {
    this.showApproveDialog = true;
  }

  handleCloseApproveDialog() {
    this.showApproveDialog = false;
  }

  // approve functions
  handleOpenRejectDialog() {
    this.showRejectDialog = true;
  }

  handleCloseRejectDialog() {
    this.showRejectDialog = false;
  }

  //notify employee
  notifyEmployee() {
    if (!this.selectedEmployee?.employeeId) {
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
          return this.visaManagementService.notifyEmployee(
            token,
            this.selectedEmployee?.employeeId || ''
          );
        })
      )
      .subscribe({
        next: response => {
          console.log('Notified successfully:', response);
        },
        error: err => {
          console.error('Notify failed:', err);
        },
      });
  }

  downloadDocument() {
    if (
      !this.selectedEmployee?.employeeId ||
      !this.selectedEmployee?.pendingDocument?.documentType
    ) {
      console.error('Download provided');
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
          return this.visaManagementService.downloadDocument(
            token,
            this.selectedEmployee?.pendingDocument?.documentType || '',
            this.selectedEmployee?.employeeId || ''
          );
        })
      )
      .subscribe({
        next: response => {
          console.log('Download successfully:', response);
          window.open(response.url, '_blank');
        },
        error: err => {
          console.error('Download failed:', err);
        },
      });
  }

  showDocument() {
    if (
      !this.selectedEmployee?.employeeId ||
      !this.selectedEmployee?.pendingDocument?.documentType
    ) {
      console.error('Show provided');
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
          return this.visaManagementService.showDocument(
            token,
            this.selectedEmployee?.pendingDocument?.documentType || '',
            this.selectedEmployee?.employeeId || ''
          );
        })
      )
      .subscribe({
        next: response => {
          console.log('Show successfully:', response);
          window.open(response.url, '_blank');
        },
        error: err => {
          console.error('Show failed:', err);
        },
      });
  }

  downloadDocumentAllEmp(document: VMAllEmployeesApprovedDoc) {
    if (
      !this.selectedEmployeeAllEmployees?.employeeId ||
      !document.documentType
    ) {
      console.error('Download provided');
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
          return this.visaManagementService.downloadDocument(
            token,
            document.documentType,
            this.selectedEmployeeAllEmployees?.employeeId || ''
          );
        })
      )
      .subscribe({
        next: response => {
          console.log('Download successfully:', response);
          window.open(response.url, '_blank');
        },
        error: err => {
          console.error('Download failed:', err);
        },
      });
  }

  showDocumentAllEmp(document: VMAllEmployeesApprovedDoc) {
    if (
      !this.selectedEmployeeAllEmployees?.employeeId ||
      !document.documentType
    ) {
      console.error('Show provided');
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
          return this.visaManagementService.showDocument(
            token,
            document.documentType,
            this.selectedEmployeeAllEmployees?.employeeId || ''
          );
        })
      )
      .subscribe({
        next: response => {
          console.log('Show successfully:', response);
          window.open(response.url, '_blank');
        },
        error: err => {
          console.error('Show failed:', err);
        },
      });
  }
}
