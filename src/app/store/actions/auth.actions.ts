import { createActionGroup, emptyProps, props } from '@ngrx/store';
import { User, UserRole } from '../../interfaces/user.interface';

export const AuthActions = createActionGroup({
  source: 'Auth',
  events: {
    'Login': props<{ email: string; password: string }>(),
    'Set Credentials': props<{ user: User; token: string; role: UserRole }>(),
    'Logout': emptyProps(),
  },
});