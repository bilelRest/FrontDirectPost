import { Component, OnInit } from '@angular/core';
import { Operation, Parcel, PassengerService, Pochette, Sender } from '../passenger_service/passenger-service';
import { Router, RouterLink } from '@angular/router'; // Importez RouterLink
import { CommonModule } from '@angular/common'; // Importez CommonModule pour *ngFor et *ngIf

@Component({
  selector: 'app-bordereau',
  standalone: true, // Assurez-vous que c'est bien présent
  imports: [CommonModule], // AJOUTEZ CES DEUX LÀ
  templateUrl: './bordereau.html',
  styleUrl: './bordereau.css',
})
export class Bordereau implements OnInit {
  constructor(private print_service: PassengerService, private router: Router) {}
  
  opid = localStorage.getItem("op") || "";
  
  operation: Operation = {
    deleted: false,
    total:0,
    opId: 0,
    banque: '',
    cheque: '',
    formattedId: '',
    createdAt: '',
    validated: false,
    cancelled: false,
    parcel: [],
    pochette: []
  };
   totalPochette=0;
   totalParcel=0;
  
  parcels: Parcel[] = [];
  pochettes:Pochette[]=[];
 operation_en_cours = JSON.parse(localStorage.getItem("currentop") || 'null');  

  ngOnInit(): void {
   this.operation_en_cour() 
  }
client:Sender={
  sendId: null,
  sendName: '',
  sendSocialReason: '',
  sendTel: null,
  adress: '',
  postalCode: null,
  city: '',
  country: '',
  sendEmail: '',
  createdAt: new Date()
}
mode:string="";
dateOp:Date=new Date();
 operation_en_cour() {
  // 1. Vérification de sécurité : si l'objet est null, on arrête tout de suite
  if (!this.operation_en_cours) {
    console.warn("Aucune opération en cours trouvée dans le stockage.");
    // Optionnel: rediriger l'utilisateur s'il n'y a rien à afficher
    // this.router.navigate(['/']); 
    return;
  }
for(let i=0;i<this.operation_en_cours.parcel.length;i++){
  this.client=this.operation_en_cours.parcel[i].sender;
}
  if (this.opid) {
    console.log("Operation au debut", this.operation_en_cours);

    // Utilisation sécurisée des données
    this.parcels = this.operation_en_cours.parcel || [];
    this.pochettes = this.operation_en_cours.pochette || [];
if(this.operation_en_cours.banque != null && this.operation_en_cours.cheque != null){
  this.mode='Chèque: '+this.operation_en_cours.banque.toUpperCase()+' /  '+this.operation_en_cours.cheque;
}else{
  this.mode='Espèce';
}
    // Calcul du total des colis
    for (let i = 0; i < this.parcels.length; i++) {
      this.totalParcel += this.parcels[i].price;
    }

    // Calcul et formatage des pochettes
    for (let i = 0; i < this.pochettes.length; i++) {
      this.totalPochette += this.pochettes[i].totalPrice;
      
      // Transformation des codes en libellés lisibles
      const types: { [key: string]: string } = {
        'pn': 'Pochette National',
        'pnpm': 'Pochette International Petit Modèle',
        'pngm': 'Pochette International Grand Modèle',
        'mat': 'Pochette Matelassée'
      };
      
      const typeKey = this.pochettes[i].typePochette;
      if (types[typeKey]) {
        this.pochettes[i].typePochette = types[typeKey];
      }
    }

    // Impression
    window.print();

    // Suppression propre après impression
    
     localStorage.removeItem("currentop");
     localStorage.removeItem("op");
    
  }
}}
