import { Component, OnInit, AfterViewInit, ViewChild } from '@angular/core';
import { Store } from '@ngrx/store';
import { take, switchMap } from 'rxjs/operators';
import {
  EmployeeSummaryResponse,
  EmployeeSummaryProfile,
} from 'src/app/interfaces/employee-profile.interface';
import { EmployeeProfileService } from 'src/app/service/employee-profile.service';
import { selectToken } from 'src/app/store/selectors/auth.selectors';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { CommonModule } from '@angular/common';

//  Allows HR to see a summary of each employee’s profile, search for a
// particular employee, and view their entire profile.

@Component({
  selector: 'app-employee-profile',
  standalone: true,
  templateUrl: './employee-profile.component.html',
  styleUrls: ['./employee-profile.component.css'],
  imports: [
    CommonModule,
    MatTableModule,
    MatPaginatorModule,
    MatProgressSpinnerModule,
  ],
})
export class EmployeeProfileComponent implements OnInit, AfterViewInit {
  employeeSummaries: EmployeeSummaryResponse | null = null;
  dataSource = new MatTableDataSource<EmployeeSummaryProfile>([]);
  displayedColumns: string[] = [
    'name',
    'ssn',
    'workAuthorizationTitle',
    'phone',
    'email',
  ];
  isLoading = true;
  totalCount = -1;
  @ViewChild(MatPaginator) paginator!: MatPaginator;

  constructor(
    private store: Store,
    private employeeProfileService: EmployeeProfileService
  ) {}

  // call the API to get all EmployeeProfiles
  // token$ = this.store.select(selectToken);
  ngOnInit() {
    this.store
      .select(selectToken)
      .pipe(
        take(1),
        switchMap(token => {
          if (!token) {
            throw new Error('Token invalid:: getEmployeeSummary');
          }
          return this.employeeProfileService.getEmployeeSummary(token);
        })
      )
      .subscribe({
        next: data => {
          this.employeeSummaries = data;
          this.dataSource.data = data.employees;
          this.totalCount = data.totalCount;
          this.isLoading = false;
          this.dataSource.paginator = this.paginator;
          console.log('employeeSummaries:', data.employees);
        },
        error: err => {
          this.isLoading = false;
          console.error('Getting employee summary error: ', err);
        },
      });
  }

  ngAfterViewInit(): void {
    if (this.dataSource) {
      this.dataSource.paginator = this.paginator;
    }
  }

  handleElementClick() {
    console.log('hello world');
  }
}
