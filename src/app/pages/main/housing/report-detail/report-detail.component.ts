import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable } from 'rxjs';
import {
  HouseReport,
  ReportComment,
} from '../../../../interfaces/house.interface';
import { HousingService } from '../../../../service/housing.service';

@Component({
  selector: 'app-report-detail',
  templateUrl: './report-detail.component.html',
  styleUrls: ['./report-detail.component.css'],
})
export class ReportDetailComponent implements OnInit {
  report: HouseReport | null = null;
  comments$: Observable<ReportComment[]> | null = null;
  error: string | null = null;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private housingService: HousingService
  ) {
    const navigation = this.router.getCurrentNavigation();
    if (navigation?.extras.state) {
      this.report = navigation.extras.state['report'];
    }
  }

  ngOnInit(): void {
    if (!this.report) {
      this.error =
        'Report not found. Please navigate from the house details page.';
      return;
    }

    const reportId = this.route.snapshot.paramMap.get('id');
    if (reportId) {
      this.comments$ = this.housingService.getReportComments(reportId);
    }
  }

  goBack(): void {
    this.router.navigate(['/housing-management']);
  }
}
