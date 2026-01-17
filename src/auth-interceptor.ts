import { HttpInterceptorFn, HttpErrorResponse, HttpClient } from "@angular/common/http";
import { inject } from "@angular/core";
import { Router } from "@angular/router";
import { catchError, switchMap, throwError, BehaviorSubject, filter, take, finalize } from "rxjs";

// On utilise une variable hors de la fonction pour garder l'état du refresh entre les appels
let isRefreshing = false;
let refreshTokenSubject: BehaviorSubject<string | null> = new BehaviorSubject<string | null>(null);

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const router = inject(Router);
  const http = inject(HttpClient);
  const token = localStorage.getItem('token');

  // 1. Ne pas toucher aux requêtes d'authentification
  if (req.url.includes('/api/auth/')) {
    return next(req);
  }

  // 2. Ajouter le token si présent
  let authReq = req;
  if (token) {
    authReq = req.clone({ setHeaders: { Authorization: `Bearer ${token}` } });
  }

  return next(authReq).pipe(
    catchError((error: HttpErrorResponse) => {
      // On écoute le 401 ET le 403 car Spring renvoie 403 quand le token est mort
      if (error.status === 401 || error.status === 403) {
        const refreshToken = localStorage.getItem('refresh');

        if (refreshToken) {
          if (!isRefreshing) {
            isRefreshing = true;
            refreshTokenSubject.next(null);

            // APPEL AU BACKEND : Attention à la clé { refresh } pour correspondre au Java
            return http.post<any>('https://directpost.apirest.pro/api/auth/refresh', { refresh: refreshToken }).pipe(
//                          return http.post<any>('http://localhost:6161/api/auth/refresh', { refresh: refreshToken }).pipe(

              switchMap((res) => {
                isRefreshing = false;
                localStorage.setItem('token', res.token);
                refreshTokenSubject.next(res.token); // Libère les requêtes en attente
                
                return next(req.clone({ setHeaders: { Authorization: `Bearer ${res.token}` } }));
              }),
              catchError((refreshErr) => {
                isRefreshing = false;
                localStorage.clear();
                router.navigate(['/login']);
                return throwError(() => refreshErr);
              })
            );
          } else {
            // Si un refresh est déjà lancé, on attend que le premier finisse
            return refreshTokenSubject.pipe(
              filter(newToken => newToken !== null),
              take(1),
              switchMap((newToken) => {
                return next(req.clone({ setHeaders: { Authorization: `Bearer ${newToken}` } }));
              })
            );
          }
        }
      }
      return throwError(() => error);
    })
  );
};