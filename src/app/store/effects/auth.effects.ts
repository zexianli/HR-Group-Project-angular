import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { of } from 'rxjs';
import { map, catchError, switchMap, tap } from 'rxjs/operators';
import { AuthActions } from '../actions/auth.actions';
import { AuthService } from '../../service/auth.service';
import { Router } from '@angular/router';

@Injectable()
export class AuthEffects {
  constructor(
    private actions$: Actions,
    private authService: AuthService,
    private router: Router
  ) {}

  login$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AuthActions.login),
      switchMap(({ username, password }) =>
        this.authService.login(username, password).pipe(
          map(response =>
            AuthActions.setCredentials({
              user: response.data.user,
              token: response.data.token,
              role: response.data.user.role,
            })
          ),
          catchError(error => {
            console.error('Login failed:', error);
            return of({ type: '[Auth] Login Error' });
          })
        )
      ),
      tap(() => {
        this.router.navigate(['/dashboard'], { replaceUrl: true });
      })
    )
  );

  logout$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(AuthActions.logout),
        tap(() => {
          this.router.navigate(['/login'], { replaceUrl: true });
        })
      ),
    { dispatch: false }
  );
}
