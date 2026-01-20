import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, tap } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  constructor(private http:HttpClient) { }
 baseurl = 'https://directpost.apirest.pro/api/auth';
 // baseurl = 'http://localhost:6161/api/auth';
  private isRefreshing = false;
private refreshTokenSubject: BehaviorSubject<any> = new BehaviorSubject<any>(null);

refreshToken(token: string) {
  // On appelle votre nouvel endpoint Spring Boot
  return this.http.post<any>(this.baseurl+'/refresh', { refresh: token });
}
 // auth.service.ts
login(credentials: {username: string, password: string}) {
  return this.http.post<{token: string,refresh:string}>(this.baseurl+'/login', credentials)
    .pipe(
      tap(response => {
        // On stocke uniquement la valeur brute : "eyJhbGci..."
        localStorage.setItem('token', response.token);
        localStorage.setItem('refresh', response.refresh);
       try {
    // 1. Récupérer la partie centrale (Payload)
    const payloadBase64 = response.token.split('.')[1];
    
    // 2. Décoder le Base64
    const decodedJson = atob(payloadBase64);
    
    // 3. Parser le JSON
    const payload = JSON.parse(decodedJson);
    localStorage.setItem('username', payload.sub);
    localStorage.setItem('role', payload.role);
    localStorage.setItem('agence', payload.agence);
    localStorage.setItem('nomPrenom', payload.nomPrenom);
    console.log(payload)
    // 4. Retourner le subject ('sub')
    return payload.sub; 
  } catch (e) {
    console.error("Erreur lors du décodage du token", e);
    return null;
  }

      })
    );
}

  
}
