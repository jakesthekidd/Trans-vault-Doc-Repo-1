import { Routes } from '@angular/router';
import { ViewerComponent } from './pages/viewer/viewer.component';
import { SearchComponent } from './pages/search/search.component';
import { ResultsComponent } from './pages/results/results.component';

export const routes: Routes = [
  { path: '', redirectTo: '/search', pathMatch: 'full' },
  { path: 'search', component: SearchComponent },
  { path: 'results', component: ResultsComponent },
  { path: 'viewer/:id', component: ViewerComponent },
  { path: '**', redirectTo: '/search' } // Wildcard for 404
];