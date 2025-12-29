import { createReducer, on } from '@ngrx/store';
import {
  HouseSummary,
  HouseDetail,
  HouseReport,
  HouseReportsPagination,
  ReportComment,
} from '../../interfaces/house.interface';
import { HousingActions } from '../actions/housing.actions';

export interface HousingState {
  houses: HouseSummary[];
  selectedHouse: HouseDetail | null;
  reports: HouseReport[];
  reportsPagination: HouseReportsPagination | null;
  currentReport: HouseReport | null;
  comments: ReportComment[];
  loading: boolean;
  error: string | null;
}

export const initialState: HousingState = {
  houses: [],
  selectedHouse: null,
  reports: [],
  reportsPagination: null,
  currentReport: null,
  comments: [],
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
  })),

  on(HousingActions.loadReportById, state => ({
    ...state,
    loading: true,
    error: null,
  })),

  on(HousingActions.loadReportByIdSuccess, (state, { report }) => ({
    ...state,
    currentReport: report,
    loading: false,
    error: null,
  })),

  on(HousingActions.loadReportByIdFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error,
  })),

  on(HousingActions.loadReportComments, state => ({
    ...state,
    loading: true,
    error: null,
  })),

  on(HousingActions.loadReportCommentsSuccess, (state, { comments }) => ({
    ...state,
    comments,
    loading: false,
    error: null,
  })),

  on(HousingActions.loadReportCommentsFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error,
  })),

  on(HousingActions.updateReportStatus, state => ({
    ...state,
    loading: true,
    error: null,
  })),

  on(HousingActions.updateReportStatusSuccess, (state, { report }) => ({
    ...state,
    currentReport: report,
    loading: false,
    error: null,
  })),

  on(HousingActions.updateReportStatusFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error,
  }))
);
