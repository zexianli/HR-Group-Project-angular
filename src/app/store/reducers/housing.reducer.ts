import { createReducer, on } from '@ngrx/store';
import {
  HouseSummary,
  HouseDetail,
  HouseReport,
  HouseReportsPagination,
} from '../../interfaces/house.interface';
import { HousingActions } from '../actions/housing.actions';

export interface HousingState {
  houses: HouseSummary[];
  selectedHouse: HouseDetail | null;
  reports: HouseReport[];
  reportsPagination: HouseReportsPagination | null;
  loading: boolean;
  error: string | null;
}

export const initialState: HousingState = {
  houses: [],
  selectedHouse: null,
  reports: [],
  reportsPagination: null,
  loading: false,
  error: null,
};

export const housingReducer = createReducer(
  initialState,

  on(HousingActions.loadHouses, state => ({
    ...state,
    loading: true,
    error: null,
  })),

  on(HousingActions.loadHousesSuccess, (state, { houses }) => ({
    ...state,
    houses,
    loading: false,
    error: null,
  })),

  on(HousingActions.loadHousesFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error,
  })),

  on(HousingActions.loadHouseDetail, state => ({
    ...state,
    loading: true,
    error: null,
  })),

  on(HousingActions.loadHouseDetailSuccess, (state, { house }) => ({
    ...state,
    selectedHouse: house,
    loading: false,
    error: null,
  })),

  on(HousingActions.loadHouseDetailFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error,
  })),

  on(HousingActions.clearHouseDetail, state => ({
    ...state,
    selectedHouse: null,
  })),

  on(HousingActions.createHouse, state => ({
    ...state,
    loading: true,
    error: null,
  })),

  on(HousingActions.createHouseSuccess, (state, { house }) => ({
    ...state,
    loading: false,
    error: null,
    selectedHouse: house,
  })),

  on(HousingActions.createHouseFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error,
  })),

  on(HousingActions.loadHouseReports, state => ({
    ...state,
    loading: true,
    error: null,
  })),

  on(
    HousingActions.loadHouseReportsSuccess,
    (state, { reports, pagination }) => ({
      ...state,
      reports,
      reportsPagination: pagination,
      loading: false,
      error: null,
    })
  ),

  on(HousingActions.loadHouseReportsFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error,
  }))
);
