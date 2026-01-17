import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
export interface Operation {
  deleted:boolean;
  total:number;
  opId: number;
  banque:string;
  cheque:string;
  formattedId: string;
  createdAt: string;
  validated: boolean;
  cancelled: boolean;
  parcel: any[];
  pochette: any[];
}
export interface Parcel {
  normal:boolean;
  parcelId?: number | null;           // Correspond à ton Long parcelId
  formattedParcelId?: string// Optionnel car généré par le backend
  createdAt: string | Date;   // LocalDate arrive souvent en string ISO (2026-01-12)
  width: number | null;
  height: number | null;
  lenght: number | null;             // Gardé avec la faute d'orthographe pour matcher ton Java
  price: number;
  weight: number | null ;
  deleted: boolean;
  operationId:string
  
  // Relations (Objets imbriqués)
  operation?: Operation;      // Map vers 'operation' en Java
  appUser?: AppUser;
  receiver: Receiver;
  sender: Sender;
  trackingNumber?: TrackingNumber;
}
export interface Pochette {
  id?: number;          // Optionnel car généré par le backend
  createdAt: string | Date;   // LocalDate arrive souvent en string ISO (2026-01-12)
  quantite:number;            // Gardé avec la faute d'orthographe pour matcher ton Java
  typePochette:string;
  totalPrice: number;
  deleted: boolean;
  
  // Relations (Objets imbriqués)
  operation?: Operation;      // Map vers 'operation' en Java
  appUser?: AppUser;
  sender: Sender;

}
  
  
   
export interface AppUser {
  userId: number;
  username: string;
  email: string;
  // On ne met généralement pas le password dans l'interface frontend pour la sécurité
  appRoles: []; 
}
export interface TrackingNumber {
  parcelId?: number | null;           // Correspond à ton Long parcelId
  createdAt: string | Date;    // LocalDate est envoyé en String (ISO) par Jackson
  formattedParcelId: string;   // Ton ID unique pour les recherches
}
export interface Sender {
   sendId:number | null;
      sendName:string ;
      sendSocialReason:string;
      sendTel:number | null | null;
      adress:string;
      postalCode:number | null ;
      city:string;
      country:string;
      sendEmail:string;
    createdAt:Date;
}
export interface Receiver {
   recId:number | null;
      recName:string;
      recSocialReason:string;
      recTel:number | null;
      adress:string;
      postalCode:number | null;
      city:string;
      country:string;
      recEmail:string;
    createdAt:Date;
}
export interface Payment{
  banque:string
  cheque:string
}
@Injectable({
  providedIn: 'root',
})
export class PassengerService {
constructor(private http: HttpClient) { }
 baserUrl='https://directpost.apirest.pro/api/operation/passenger';
   //baserUrl='http://localhost:6161/api/operation/passenger';
     

deteleOperation(op:string){
  return this.http.get(this.baserUrl+"/deleteop?op="+op);

}
situationAgen(){
  return this.http.get(this.baserUrl+"/situation");
}
     validatePayment(op:string,payment:Payment):Observable<Operation>{
      return this.http.post<Operation>(this.baserUrl+"/payment?op="+op,payment)
     }
     deleteParcel(parcel:Parcel):Observable<Parcel>{
      return this.http.post<Parcel>(this.baserUrl+"/deleteparcel",parcel)
     
     }
     loaodAllOperations():Observable<Operation[]>{
      return this.http.get<Operation[]>(this.baserUrl+"/operations");
     }
 getNonClosedOperationContentByAgent():Observable<Operation[]>{
      return this.http.get<Operation[]>(this.baserUrl+"/opsnotclosed");
     }
 loadNewOperation(op: string) {
  const params = new HttpParams().set('op', op);
  return this.http.get<Operation>(`${this.baserUrl}/new`, { params });
}
  loadSenders(){
    return this.http.get<Sender[]>(this.baserUrl+'/senders');
  }
   loadReceivers(){
    return this.http.get<Receiver[]>(this.baserUrl+'/receivers');
  }
  addParcel(parcel: Parcel, opFormatted: string):Observable<Parcel>{
    return this.http.post<Parcel>(this.baserUrl+"/addparcel?op="+opFormatted,parcel)
  }
  
  addPochetteToOperation(op:string,pochette:Pochette):Observable<Operation>{
    return this.http.post<Operation>(this.baserUrl+"/addpochette?op="+op,pochette)
  }
  getOpeartionContent(numop:string):Observable<any>{
    return this.http.get<Operation>(this.baserUrl+"/parcels?op="+numop);
  }
  deletepochette(pochette:Pochette):Observable<Pochette>{
    return this.http.post<Pochette>(this.baserUrl+"/deletepochette",pochette)
  }
}