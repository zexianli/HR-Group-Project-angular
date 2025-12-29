import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { of } from 'rxjs';
import { map, catchError, switchMap } from 'rxjs/operators';
import { HousingActions } from '../actions/housing.actions';
import { HousingService } from '../../service/housing.service';

@Injectable()
export class HousingEffects {
  constructor(
    private actions$: Actions,
    private housingService: HousingService
  ) {}

  loadHouses$ = createEffect(() =>
    this.actions$.pipe(
      ofType(HousingActions.loadHouses),
      switchMap(() =>
        this.housingService.getAllHouses().pipe(
          map(houses => HousingActions.loadHousesSuccess({ houses })),
          catchError(error =>
            of(
              HousingActions.loadHousesFailure({
                error: error.message || 'Failed to load houses',
              })
            )
          )
        )
      )
    )
  );

  loadHouseDetail$ = createEffect(() =>
    this.actions$.pipe(
      ofType(HousingActions.loadHouseDetail),
      switchMap(({ id }) =>
        this.housingService.getHouseById(id).pipe(
          map(house => HousingActions.loadHouseDetailSuccess({ house })),
          catchError(error =>
            of(
              HousingActions.loadHouseDetailFailure({
                error: error.message || 'Failed to load house details',
              })
            )
          )
        )
      )
    )
  );

  createHouse$ = createEffect(() =>
    this.actions$.pipe(
      ofType(HousingActions.createHouse),
      switchMap(action =>
        this.housingService.createHouse(action).pipe(
          map(house => HousingActions.createHouseSuccess({ house })),
          catchError(error =>
            of(
              HousingActions.createHouseFailure({
                error: error.message || 'Failed to create house',
              })
            )
          )
        )
      )
    )
  );
}
