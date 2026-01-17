import { Routes } from '@angular/router';
import { Passenger } from '../passenger/passenger/passenger';
import { authGuard } from '../auth.guard';
import { Login } from './login/login/login';
import { Home } from './home/home';
import { Bordereau } from './bordereau/bordereau';
import { Operations } from './operation/operations';
import { App } from './app';
import { MainLayout } from './main-layout/main-layout';
import { Administrateur } from './administrateur/administrateur';
import { Situation } from './situation/situation';
import { Situationprint } from './situationprint/situationprint';

export const routes: Routes = [
  // 1. Route LOGIN (Pas de sidebar ici, car AppComponent est vide)
  { path: 'auth/login', component: Login },

  // 2. Groupe PROTEGE (Utilise MainLayout qui contient votre Sidebar)
  {
    path: '',
    component: MainLayout, // On charge votre design ici
    canActivate: [authGuard],
    children: [
      { path: 'home', component: Home },
      {path:'situationprint',component:Situationprint},
      {path:'situation',component:Situation},
      {path:'manage',component:Administrateur},
      { path: 'passenger', component: Passenger },
      { path: 'bordereau', component: Bordereau },
      { path: 'operation', component: Operations },
      { path: '', redirectTo: 'home', pathMatch: 'full' }
    ]
  },

  { path: '**', redirectTo: 'auth/login' }
];