import { Routes } from '@angular/router';
import { Passenger } from '../passenger/passenger/passenger';
import { authGuard } from '../auth.guard';
import { Login } from './login/login/login';
import { Home } from './home/home';
import { Bordereau } from './bordereau/bordereau';

export const routes: Routes = [
  // 1. Redirection initiale
  { path: '', redirectTo: 'auth/login', pathMatch: 'full' },

  // 2. Groupe de routes protégées (Sécurité renforcée)
  {
    path: '',
    canActivate: [authGuard],
    children: [
      { path: 'home', component: Home },
      { path: 'passenger', component: Passenger },
      { path: 'bordereau', component: Bordereau },
    ]
  },

  // 3. Route publique
  { path: 'auth/login', component: Login },

  // 4. Wildcard (toujours en dernier)
  { path: '**', redirectTo: 'auth/login' }
];