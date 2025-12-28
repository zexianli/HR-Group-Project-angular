import { Injectable } from '@angular/core';
import axios, { AxiosInstance } from 'axios';
import { Observable, from } from 'rxjs';
import { User, UserRole } from '../interfaces/user.interface';
import { environment } from '../../environments/environment';

export interface LoginResponse<T> {
  message: string;
  data: T;
}

export interface LoginResponseData {
  user: User;
  token: string;
  role: UserRole;
}

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private api: AxiosInstance;

  constructor() {
    this.api = axios.create({
      baseURL: environment.apiBaseUrl,
    });
  }

  login(
    username: string,
    password: string
  ): Observable<LoginResponse<LoginResponseData>> {
    return from(
      this.api
        .post<
          LoginResponse<LoginResponseData>
        >('/auth/login', { username, password })
        .then(response => response.data)
    );
  }

  getCurrentUser(token: string): Observable<User> {
    return from(
      this.api
        .get<User>('/auth/me', {
          headers: { Authorization: `Bearer ${token}` },
        })
        .then(response => response.data)
    );
  }
}
