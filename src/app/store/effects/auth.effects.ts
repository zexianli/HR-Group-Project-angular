import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { of } from 'rxjs';
import { map, catchError, switchMap } from 'rxjs/operators';
import { AuthActions } from '../actions/auth.actions';
import { AuthService } from '../../service/auth.service';

@Injectable()
export class AuthEffects {
  constructor(private actions$: Actions, private authService: AuthService) {}

  login$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AuthActions.login),
      switchMap(({ email, password }) =>
        this.authService.login(email, password).pipe(
          map((response) =>
            AuthActions.setCredentials({
              user: response.user,
              token: response.token,
              role: response.role,
            })
          ),
          catchError((error) => {
            console.error('Login failed:', error);
            return of({ type: '[Auth] Login Error' });
          })
        )
      )
    )
  );
}
