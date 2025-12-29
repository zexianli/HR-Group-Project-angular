import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { HouseSummary } from '../../../../interfaces/house.interface';
import { HousingActions } from '../../../../store/actions/housing.actions';
import {
  selectAllHouses,
  selectHousingLoading,
  selectHousingError,
} from '../../../../store/selectors/housing.selectors';

@Component({
  selector: 'app-housing-management',
  templateUrl: './housing-management.component.html',
  styleUrls: ['./housing-management.component.css'],
})
export class HousingManagementComponent implements OnInit {
  houses$: Observable<HouseSummary[]>;
  loading$: Observable<boolean>;
  error$: Observable<string | null>;

  constructor(
    private store: Store,
    private router: Router
  ) {
    this.houses$ = this.store.select(selectAllHouses);
    this.loading$ = this.store.select(selectHousingLoading);
    this.error$ = this.store.select(selectHousingError);
  }

  ngOnInit(): void {
    this.store.dispatch(HousingActions.loadHouses());
  }

  loadHouses(): void {
    this.store.dispatch(HousingActions.loadHouses());
  }

  viewHouseDetails(houseId: string): void {
    this.router.navigate(['/housing', houseId]);
  }

  addNewHouse(): void {
    this.router.navigate(['/housing/new']);
  }

  getFullAddress(house: HouseSummary): string {
    const { street, city, state, zip } = house.address;
    return `${street}, ${city}, ${state} ${zip}`;
  }
}
