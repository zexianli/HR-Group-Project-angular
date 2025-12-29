import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './pages/login/login.component';
import { DashboardComponent } from './pages/main/dashboard/dashboard.component';
import { authGuard, loginGuard } from './guards/auth.guard';
import { LayoutComponent } from './components/main/layout/layout.component';
import { EmployeeProfileComponent } from './pages/main/employee-profile/employee-profile.component';
import { VisaManagementComponent } from './pages/main/visa-management/visa-management.component';
import { HiringManagementComponent } from './pages/main/hiring-management/hiring-management.component';
import { HousingManagementComponent } from './pages/main/housing-management/housing-management.component';

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
      { path: 'hiring-management', component: HiringManagementComponent },
      { path: 'housing-management', component: HousingManagementComponent },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
