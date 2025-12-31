import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { of } from 'rxjs';
import { map, take, switchMap, catchError } from 'rxjs/operators';
import {
  selectToken,
  selectIsAuthenticated,
} from '../store/selectors/auth.selectors';
import { AuthService } from '../service/auth.service';
import { AuthActions } from '../store/actions/auth.actions';

export const authGuard: CanActivateFn = (route, state) => {
  const store = inject(Store);
  const router = inject(Router);
  const authService = inject(AuthService);

  return store.select(selectToken).pipe(
    take(1),
    switchMap(token => {
      if (!token) {
        router.navigate(['/login'], { replaceUrl: true });
        return of(false);
      }

      return authService.getCurrentUser(token).pipe(
        map(() => {
          return true;
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

  return store.select(selectIsAuthenticated).pipe(
    take(1),
    map(isAuthenticated => {
      if (isAuthenticated) {
        router.navigate(['/dashboard'], { replaceUrl: true });
        return false;
      }

      return true;
    })
  );
};
