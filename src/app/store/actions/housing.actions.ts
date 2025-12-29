import { createActionGroup, emptyProps, props } from '@ngrx/store';
import { HouseSummary, HouseDetail } from '../../interfaces/house.interface';

export const HousingActions = createActionGroup({
  source: 'Housing',
  events: {
    'Load Houses': emptyProps(),
    'Load Houses Success': props<{ houses: HouseSummary[] }>(),
    'Load Houses Failure': props<{ error: string }>(),

    'Load House Detail': props<{ id: string }>(),
    'Load House Detail Success': props<{ house: HouseDetail }>(),
    'Load House Detail Failure': props<{ error: string }>(),

    'Clear House Detail': emptyProps(),
  },
});
