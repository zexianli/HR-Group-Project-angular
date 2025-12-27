import { createReducer, on } from '@ngrx/store';
import { User, UserRole } from '../../interfaces/user.interface';
import { AuthActions } from '../actions/auth.actions';

export interface AuthState {
  user: User | null;
  token: string | null;
  role: UserRole | null;
  status: 'idle' | 'loading' | 'success' | 'error';
  error: string | null;
}

const getUserFromStorage = (): User | null => {
  const userJson = localStorage.getItem('user');
  return userJson ? JSON.parse(userJson) : null;
};

export const initialState: AuthState = {
  user: getUserFromStorage(),
  token: localStorage.getItem('token'),
  role: localStorage.getItem('role') as UserRole | null,
  status: 'idle',
  error: null,
};

export const authReducer = createReducer(
  initialState,
  on(AuthActions.login, (state) => ({
    ...state,
    status: 'loading' as const,
    error: null,
  })),
  on(AuthActions.setCredentials, (state, { user, token, role }) => {
    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(user));
    localStorage.setItem('role', role);

    return {
      ...state,
      user,
      token,
      role,
      status: 'success' as const,
      error: null,
    };
  }),
  on(AuthActions.logout, (state) => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    localStorage.removeItem('role');

    return {
      ...state,
      user: null,
      token: null,
      role: null,
      status: 'idle' as const,
      error: null,
    };
  })
);
