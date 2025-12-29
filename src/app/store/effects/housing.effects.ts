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

  loadHouseReports$ = createEffect(() =>
    this.actions$.pipe(
      ofType(HousingActions.loadHouseReports),
      switchMap(({ houseId, page }) =>
        this.housingService.getHouseReports(houseId, page).pipe(
          map(({ reports, pagination }) =>
            HousingActions.loadHouseReportsSuccess({ reports, pagination })
          ),
          catchError(error =>
            of(
              HousingActions.loadHouseReportsFailure({
                error: error.message || 'Failed to load house reports',
              })
            )
          )
        )
      )
    )
  );

  loadReportById$ = createEffect(() =>
    this.actions$.pipe(
      ofType(HousingActions.loadReportById),
      switchMap(({ reportId }) =>
        this.housingService.getReportById(reportId).pipe(
          map(report => HousingActions.loadReportByIdSuccess({ report })),
          catchError(error =>
            of(
              HousingActions.loadReportByIdFailure({
                error: error.message || 'Failed to load report',
              })
            )
          )
        )
      )
    )
  );

  loadReportComments$ = createEffect(() =>
    this.actions$.pipe(
      ofType(HousingActions.loadReportComments),
      switchMap(({ reportId }) =>
        this.housingService.getReportComments(reportId).pipe(
          map(comments =>
            HousingActions.loadReportCommentsSuccess({ comments })
          ),
          catchError(error =>
            of(
              HousingActions.loadReportCommentsFailure({
                error: error.message || 'Failed to load comments',
              })
            )
          )
        )
      )
    )
  );

  updateReportStatus$ = createEffect(() =>
    this.actions$.pipe(
      ofType(HousingActions.updateReportStatus),
      switchMap(({ reportId, status }) =>
        this.housingService.updateReportStatus(reportId, status).pipe(
          map(report => HousingActions.updateReportStatusSuccess({ report })),
          catchError(error =>
            of(
              HousingActions.updateReportStatusFailure({
                error: error.message || 'Failed to update report status',
              })
            )
          )
        )
      )
    )
  );
}
