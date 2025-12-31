import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { MatSnackBar } from '@angular/material/snack-bar';
import { of } from 'rxjs';
import { map, take, switchMap, catchError } from 'rxjs/operators';
import {
  selectToken,
  selectIsAuthenticated,
  selectRole,
} from '../store/selectors/auth.selectors';
import { AuthService } from '../service/auth.service';
import { AuthActions } from '../store/actions/auth.actions';

export const authGuard: CanActivateFn = (route, state) => {
  const store = inject(Store);
  const router = inject(Router);
  const authService = inject(AuthService);
  const snackBar = inject(MatSnackBar);

  return store.select(selectToken).pipe(
    take(1),
    switchMap(token => {
      if (!token) {
        router.navigate(['/login'], { replaceUrl: true });
        return of(false);
      }

      return authService.getCurrentUser(token).pipe(
        switchMap(() => {
          return store.select(selectRole).pipe(
            take(1),
            map(role => {
              if (role !== 'HR') {
                snackBar.open(
                  'Access denied: HR portal is for HR users only',
                  'Close',
                  {
                    duration: 5000,
                    panelClass: ['error-snackbar'],
                  }
                );
                store.dispatch(AuthActions.logout());
                router.navigate(['/login'], { replaceUrl: true });
                return false;
              }
              return true;
            })
          );
        }),
        catchError(error => {
          console.error('Token verification failed:', error);
          store.dispatch(AuthActions.logout());
          router.navigate(['/login'], { replaceUrl: true });
          return of(false);
        })
      );
    })
  );
};

export const loginGuard: CanActivateFn = (route, state) => {
  const store = inject(Store);
  const router = inject(Router);
  const snackBar = inject(MatSnackBar);

  return store.select(selectIsAuthenticated).pipe(
    take(1),
    switchMap(isAuthenticated => {
      if (!isAuthenticated) {
        return of(true);
      }

      return store.select(selectRole).pipe(
        take(1),
        map(role => {
          if (role === 'HR') {
            router.navigate(['/dashboard'], { replaceUrl: true });
            return false;
          } else {
            snackBar.open(
              'Access denied: HR portal is for HR users only',
              'Close',
              {
                duration: 5000,
                panelClass: ['error-snackbar'],
              }
            );
            store.dispatch(AuthActions.logout());
            return true;
          }
        })
      );
    })
  );
};
