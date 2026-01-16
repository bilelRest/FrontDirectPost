import { HttpInterceptorFn, HttpErrorResponse } from "@angular/common/http";
import { inject } from "@angular/core";
import { Router } from "@angular/router";
import { catchError, throwError } from "rxjs";

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const token = localStorage.getItem('token');
  const router = inject(Router);

  // 1. On ajoute le token si il existe
  let authReq = req;
  if (token) {
    authReq = req.clone({
      setHeaders: { Authorization: `Bearer ${token}` }
    });
  }

  // 2. On traite la réponse et on guette les erreurs
  return next(authReq).pipe(
    catchError((error: HttpErrorResponse) => {
      // Si le serveur répond 401, le token n'est plus valide
      if (error.status === 401) {
        console.warn("Session expirée ou invalide, redirection...");
        
        // On nettoie le localStorage pour que le Guard ne nous laisse plus passer
        localStorage.removeItem('token');
        
        // On renvoie l'utilisateur au login
        router.navigate(['/auth/login']);
      }
      return throwError(() => error);
    })
  );
};