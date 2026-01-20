import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AppUser } from './passenger_service/passenger-service';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class Admin {
  constructor(private http:HttpClient){}
 baserUrl='https://directpost.apirest.pro/api/admin';
  // baserUrl='http://localhost:6161/api/admin';  
   addUser(appUser:AppUser){
    return this.http.post<AppUser>(this.baserUrl+"/adduser",appUser);
   }
addroletouser(username:string,role:string):Observable<AppUser>{
  return this.http.get<AppUser>(this.baserUrl+"/addroletouser?user="+username+"&role="+role);
}
}
