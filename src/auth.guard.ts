import { inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { Router, CanActivateFn } from '@angular/router';

export const authGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);
  const platformId = inject(PLATFORM_ID);

  if (isPlatformBrowser(platformId)) {
    const token = localStorage.getItem('token');

    if (token && !isTokenExpired(token)) {
      return true; // Le token existe ET il est valide
    }

    // Si le token est expiré ou absent, on nettoie et on redirige
    localStorage.removeItem('token'); 
    return router.createUrlTree(['/auth/login']);
  }
  return false;
};

// Fonction utilitaire pour vérifier l'expiration (exemple simple)
function isTokenExpired(token: string): boolean {
  try {
    const expiry = (JSON.parse(atob(token.split('.')[1]))).exp;
    return (Math.floor((new Date).getTime() / 1000)) >= expiry;
  } catch {
    return true; // Si le token est malformé, on considère qu'il est expiré
  }
}