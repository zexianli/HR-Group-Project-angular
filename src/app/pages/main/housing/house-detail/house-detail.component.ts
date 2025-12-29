import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { HouseDetail } from '../../../../interfaces/house.interface';
import { HousingActions } from '../../../../store/actions/housing.actions';
import {
  selectSelectedHouse,
  selectHousingLoading,
  selectHousingError,
} from '../../../../store/selectors/housing.selectors';

@Component({
  selector: 'app-house-detail',
  templateUrl: './house-detail.component.html',
  styleUrls: ['./house-detail.component.css'],
})
export class HouseDetailComponent implements OnInit, OnDestroy {
  house$: Observable<HouseDetail | null>;
  loading$: Observable<boolean>;
  error$: Observable<string | null>;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private store: Store
  ) {
    this.house$ = this.store.select(selectSelectedHouse);
    this.loading$ = this.store.select(selectHousingLoading);
    this.error$ = this.store.select(selectHousingError);
  }

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.store.dispatch(HousingActions.loadHouseDetail({ id }));
    }
  }

  ngOnDestroy(): void {
    this.store.dispatch(HousingActions.clearHouseDetail());
  }

  goBack(): void {
    this.router.navigate(['/housing-management']);
  }

  getFullAddress(house: HouseDetail | null): string {
    if (!house) return '';
    const { unit, street, city, state, zip } = house.address;
    return unit
      ? `${unit} ${street}, ${city}, ${state} ${zip}`
      : `${street}, ${city}, ${state} ${zip}`;
  }

  getResidentName(resident: any): string {
    return resident.name.preferredName
      ? `${resident.name.preferredName} ${resident.name.lastName}`
      : `${resident.name.firstName} ${resident.name.lastName}`;
  }
}
