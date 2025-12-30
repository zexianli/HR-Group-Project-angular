import { createFeatureSelector, createSelector } from '@ngrx/store';
import { HousingState } from '../reducers/housing.reducer';

export const selectHousingState =
  createFeatureSelector<HousingState>('housing');

export const selectAllHouses = createSelector(
  selectHousingState,
  (state: HousingState) => state.houses
);

export const selectSelectedHouse = createSelector(
  selectHousingState,
  (state: HousingState) => state.selectedHouse
);

export const selectHousingLoading = createSelector(
  selectHousingState,
  (state: HousingState) => state.loading
);

export const selectHousingError = createSelector(
  selectHousingState,
  (state: HousingState) => state.error
);

export const selectHouseReports = createSelector(
  selectHousingState,
  (state: HousingState) => state.reports
);

export const selectHouseReportsPagination = createSelector(
  selectHousingState,
  (state: HousingState) => state.reportsPagination
);

export const selectCurrentReport = createSelector(
  selectHousingState,
  (state: HousingState) => state.currentReport
);

export const selectReportComments = createSelector(
  selectHousingState,
  (state: HousingState) => state.comments
);
