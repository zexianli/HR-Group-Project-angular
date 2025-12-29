import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormControl, Validators } from '@angular/forms';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import {
  HouseReport,
  ReportComment,
} from '../../../../interfaces/house.interface';
import { HousingService } from '../../../../service/housing.service';
import { HousingActions } from '../../../../store/actions/housing.actions';
import {
  selectCurrentReport,
  selectReportComments,
  selectHousingLoading,
  selectHousingError,
} from '../../../../store/selectors/housing.selectors';

@Component({
  selector: 'app-report-detail',
  templateUrl: './report-detail.component.html',
  styleUrls: ['./report-detail.component.css'],
})
export class ReportDetailComponent implements OnInit {
  report$: Observable<HouseReport | null>;
  comments$: Observable<ReportComment[]>;
  loading$: Observable<boolean>;
  error$: Observable<string | null>;
  commentControl = new FormControl('', [Validators.required]);
  submittingComment = false;
  private reportId: string | null = null;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private store: Store,
    private housingService: HousingService
  ) {
    this.report$ = this.store.select(selectCurrentReport);
    this.comments$ = this.store.select(selectReportComments);
    this.loading$ = this.store.select(selectHousingLoading);
    this.error$ = this.store.select(selectHousingError);
  }

  ngOnInit(): void {
    this.reportId = this.route.snapshot.paramMap.get('id');
    if (!this.reportId) {
      return;
    }

    this.store.dispatch(
      HousingActions.loadReportById({ reportId: this.reportId })
    );
    this.store.dispatch(
      HousingActions.loadReportComments({ reportId: this.reportId })
    );
  }

  submitComment(): void {
    if (this.commentControl.invalid || !this.reportId) {
      return;
    }

    this.submittingComment = true;
    const description = this.commentControl.value || '';

    this.housingService.createComment(this.reportId, description).subscribe({
      next: () => {
        this.commentControl.reset();
        this.submittingComment = false;
        this.store.dispatch(
          HousingActions.loadReportComments({ reportId: this.reportId! })
        );
      },
      error: error => {
        console.error('Error creating comment:', error);
        this.submittingComment = false;
      },
    });
  }

  goBack(): void {
    this.router.navigate(['/housing-management']);
  }
}
