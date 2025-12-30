import { Routes } from '@angular/router';
import { HiringManagementPageComponent } from './hiring-management-page.component';
import { OnboardingApplicationTabComponent } from './onboarding-application-tab.component';

export const HR_HIRING_MANAGEMENT_ROUTES: Routes = [
  { path: '', component: HiringManagementPageComponent },

  /**
   * Optional: If you want "View Application" to open a new tab to your Angular route
   * (instead of backend HTML URL), you can use this and embed an iframe inside.
   * This file includes a component for that.
   */
  { path: 'applications/:id', component: OnboardingApplicationTabComponent },
];
