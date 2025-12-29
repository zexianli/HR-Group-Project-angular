import { NgModule, isDevMode } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';
import { StoreDevtoolsModule } from '@ngrx/store-devtools';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { CommonModule } from '@angular/common';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { authReducer } from './store/reducers/auth.reducer';
import { housingReducer } from './store/reducers/housing.reducer';
import { AuthEffects } from './store/effects/auth.effects';
import { HousingEffects } from './store/effects/housing.effects';
import { HousingManagementComponent } from './pages/main/housing/housing-management/housing-management.component';
import { HouseDetailComponent } from './pages/main/housing/house-detail/house-detail.component';

@NgModule({
  declarations: [
    AppComponent,
    HousingManagementComponent,
    HouseDetailComponent,
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    CommonModule,
    AppRoutingModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatProgressSpinnerModule,
    StoreModule.forRoot({ auth: authReducer, housing: housingReducer }),
    EffectsModule.forRoot([AuthEffects, HousingEffects]),
    StoreDevtoolsModule.instrument({
      maxAge: 25,
      logOnly: !isDevMode(),
    }),
  ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
