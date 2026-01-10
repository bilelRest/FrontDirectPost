import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
export interface Operation {
  opId: number;
  formattedId: string;
  createdAt: string;
  validated: boolean;
  cancelled: boolean;
  parcel: any[];
  pochette: any[];
}
@Injectable({
  providedIn: 'root',
})
export class PassengerService {
constructor(private http: HttpClient) { }

  getPassengerData() {
    const baserUrl='https://directpost.apirest.pro/api/operation/passenger';
    return this.http.get<Operation>(baserUrl+'/new');
  }  
}
