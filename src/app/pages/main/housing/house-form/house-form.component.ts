import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { Actions, ofType } from '@ngrx/effects';
import { Observable, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { HousingActions } from '../../../../store/actions/housing.actions';
import {
  selectHousingLoading,
  selectHousingError,
} from '../../../../store/selectors/housing.selectors';

@Component({
  selector: 'app-house-form',
  templateUrl: './house-form.component.html',
  styleUrls: ['./house-form.component.css'],
})
export class HouseFormComponent implements OnInit, OnDestroy {
  houseForm!: FormGroup;
  loading$: Observable<boolean>;
  error$: Observable<string | null>;
  private destroy$ = new Subject<void>();

  constructor(
    private fb: FormBuilder,
    private store: Store,
    private router: Router,
    private actions$: Actions
  ) {
    this.loading$ = this.store.select(selectHousingLoading);
    this.error$ = this.store.select(selectHousingError);
  }

  ngOnInit(): void {
    this.houseForm = this.fb.group({
      address: this.fb.group({
        unit: [''],
        street: ['', Validators.required],
        city: ['', Validators.required],
        state: ['', Validators.required],
        zip: ['', Validators.required],
      }),
      landlord: this.fb.group({
        fullName: ['', Validators.required],
        phone: ['', Validators.required],
        email: ['', [Validators.required, Validators.email]],
      }),
      facility: this.fb.group({
        bedrooms: [0, [Validators.required, Validators.min(0)]],
        bathrooms: [0, [Validators.required, Validators.min(0)]],
        mattresses: [0, Validators.min(0)],
        tables: [0, Validators.min(0)],
        chairs: [0, Validators.min(0)],
      }),
      description: [''],
    });

    // Listen for successful house creation and navigate
    this.actions$
      .pipe(ofType(HousingActions.createHouseSuccess), takeUntil(this.destroy$))
      .subscribe(() => {
        this.router.navigate(['/housing-management']);
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  onSubmit(): void {
    if (this.houseForm.valid) {
      const formValue = this.houseForm.value;
      this.store.dispatch(HousingActions.createHouse(formValue));
    }
  }

  onCancel(): void {
    this.router.navigate(['/housing-management']);
  }
}
