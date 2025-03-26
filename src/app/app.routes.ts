import { Routes } from '@angular/router';
import { CalendarComponent } from './calendar/calendar.component';
import { DayComponent } from './day/day.component';

export const routes: Routes = [
  { path: '', redirectTo: '/calendar', pathMatch: 'full' },
  { path: 'calendar', component: CalendarComponent },
  { path: 'day/:date', component: DayComponent }
];
