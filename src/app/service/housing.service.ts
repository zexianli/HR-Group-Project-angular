import { Injectable } from '@angular/core';
import axios, { AxiosInstance } from 'axios';
import { Observable, from } from 'rxjs';
import { HouseSummary, HouseDetail } from '../interfaces/house.interface';
import { environment } from '../../environments/environment';

export interface HousesResponse {
  message: string;
  data: HouseSummary[];
}

export interface HouseDetailResponse {
  message: string;
  data: HouseDetail;
}

@Injectable({
  providedIn: 'root',
})
export class HousingService {
  private api: AxiosInstance;

  constructor() {
    this.api = axios.create({
      baseURL: environment.apiBaseUrl,
    });

    this.api.interceptors.request.use(config => {
      const token = localStorage.getItem('token');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    });
  }

  getAllHouses(): Observable<HouseSummary[]> {
    return from(
      this.api
        .get<HousesResponse>('/hr/housing')
        .then(response => response.data.data)
    );
  }

  getHouseById(id: string): Observable<HouseDetail> {
    return from(
      this.api
        .get<HouseDetailResponse>(`/hr/housing/${id}`)
        .then(response => response.data.data)
    );
  }
}
