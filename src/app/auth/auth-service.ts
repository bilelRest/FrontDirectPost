import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { tap } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  constructor(private http:HttpClient) { }
  baseurl = 'https://directpost.apirest.pro/api/auth/login';
//baseurl = 'http://localhost:6161/api/auth/login';
 // auth.service.ts
login(credentials: {username: string, password: string}) {
  return this.http.post<{token: string}>(this.baseurl, credentials)
    .pipe(
      tap(response => {
        // On stocke uniquement la valeur brute : "eyJhbGci..."
        localStorage.setItem('token', response.token);
      })
    );
}
  
}
