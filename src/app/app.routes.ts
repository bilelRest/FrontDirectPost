import { Routes } from '@angular/router';
import { Passenger } from '../passenger/passenger/passenger';
import { authGuard } from '../auth.guard';
import { Login } from './login/login/login';
import { Home } from './home/home';

export const routes: Routes = [
  // 1. Redirection de la racine vers login
  { path: '', redirectTo: 'auth/login', pathMatch: 'full' },

  // 2. Route protégée
  { 
    path: 'passenger', 
    component: Passenger, 
    canActivate: [authGuard] 
  },
  {path:'home',component:Home},

  // 3. Route de login
  { path: 'auth/login', component: Login },

  // 4. Wildcard : Tout URL inconnu redirige vers login
  { path: '**', redirectTo: 'auth/login' }
];