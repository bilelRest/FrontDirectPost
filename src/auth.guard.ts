import { inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { Router, CanActivateFn } from '@angular/router';

export const authGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);
  const platformId = inject(PLATFORM_ID);

  // Vérifie si on est dans le navigateur (client)
  if (isPlatformBrowser(platformId)) {
    const token = localStorage.getItem('token');
    if (token) return true;
  }

  // Si on est sur le serveur ou sans token, on redirige vers le login
  // Note: le serveur ne fera pas la redirection visuelle, il attendra le client
  if (isPlatformBrowser(platformId)) {
    router.navigate(['/auth/login']);
  }
  return false;
};