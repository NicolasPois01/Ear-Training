import { Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { IntervalsComponent } from './intervals/intervals.component';

export const routes: Routes = [
    { path: '', component: HomeComponent },
    { path: 'intervals', component: IntervalsComponent}
];
