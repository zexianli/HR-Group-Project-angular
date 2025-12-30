import { AuthState } from './reducers/auth.reducer';
import { HousingState } from './reducers/housing.reducer';

export interface RootState {
  auth: AuthState;
  housing: HousingState;
}
