import { Routes } from '@angular/router';
import { Simulation } from './pages/simulation/simulation';
import { Home } from './pages/home/home';
import { About } from './pages/about/about';

export const routes: Routes = [
    // pathmatch full zodat niet alles naar home geredirect wordt (elk path start met '')
    { path: '', redirectTo: 'home', pathMatch: 'full'},
    { path : 'simulation', component: Simulation},
    { path : 'home', component : Home},
    { path : 'about', component : About}
];
