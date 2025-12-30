import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './pages/login/login.component';
import { DashboardComponent } from './pages/main/dashboard/dashboard.component';
import { authGuard, loginGuard } from './guards/auth.guard';
import { LayoutComponent } from './components/main/layout/layout.component';
import { EmployeeProfileComponent } from './pages/main/employee-profile/employee-profile.component';
import { VisaManagementComponent } from './pages/main/visa-management/visa-management.component';
import { HousingManagementComponent } from './pages/main/housing/housing-management/housing-management.component';
import { HouseDetailComponent } from './pages/main/housing/house-detail/house-detail.component';
import { HouseFormComponent } from './pages/main/housing/house-form/house-form.component';
import { ReportDetailComponent } from './pages/main/housing/report-detail/report-detail.component';
import { HiringManagementPageComponent } from '../app/pages/main/hiring-management/hiring-management-page.component';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full',
  },
  {
    path: 'login',
    component: LoginComponent,
    canActivate: [loginGuard],
  },
  {
    path: '',
    component: LayoutComponent,
    canActivate: [authGuard],
    children: [
      { path: 'dashboard', component: DashboardComponent },
      { path: 'employee-profile', component: EmployeeProfileComponent },
      { path: 'visa-management', component: VisaManagementComponent },
      { path: 'hiring-management', component: HiringManagementPageComponent },
      { path: 'housing-management', component: HousingManagementComponent },
      { path: 'housing/new', component: HouseFormComponent },
      { path: 'housing/:id', component: HouseDetailComponent },
      { path: 'reports/:id', component: ReportDetailComponent },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
