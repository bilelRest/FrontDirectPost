import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
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
  constructor(private print_service: PassengerService, private router: Router, private cdr: ChangeDetectorRef) {}
  
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
 operation_en_cours :any;  

  ngOnInit(): void {
    if(localStorage.getItem('reprintOp')!=null){
       this.operation_en_cours=JSON.parse(localStorage.getItem("reprintOp") || 'null')
       localStorage.removeItem('reprintOp')
       console.log('operation recu')

       console.log(this.operation_en_cours)
    }else{
             this.operation_en_cours=JSON.parse(localStorage.getItem("currentop") || 'null')
             localStorage.removeItem('currentop')
                 localStorage.removeItem("op");


    }
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
reprintOperation(){

}
operation_en_cour() {
  // 1. Vérification de sécurité
  if (!this.operation_en_cours) {
    console.warn("Aucune opération en cours trouvée dans le stockage.");
    return;
  }

  // 2. Initialisation des données
  this.client = this.operation_en_cours.parcel[0]?.sender; // Plus simple que la boucle for
  this.parcels = this.operation_en_cours.parcel || [];
  this.pochettes = this.operation_en_cours.pochette || [];
  
  // Reset des totaux pour éviter les doublons
  this.totalParcel = 0;
  this.totalPochette = 0;

  // 3. Logique de calcul
  if (this.operation_en_cours.banque != null && this.operation_en_cours.cheque != null) {
    this.mode = 'Chèque: ' + this.operation_en_cours.banque.toUpperCase() + ' / ' + this.operation_en_cours.cheque;
  } else {
    this.mode = 'Espèce';
  }

  for (let i = 0; i < this.parcels.length; i++) {
    this.totalParcel += this.parcels[i].price;
  }

  const types: { [key: string]: string } = {
    'pn': 'Pochette National',
    'pnpm': 'Pochette International Petit Modèle',
    'pngm': 'Pochette International Grand Modèle',
    'mat': 'Pochette Matelassée'
  };

  for (let i = 0; i < this.pochettes.length; i++) {
    this.totalPochette += this.pochettes[i].totalPrice;
    const typeKey = this.pochettes[i].typePochette;
    if (types[typeKey]) {
      this.pochettes[i].typePochette = types[typeKey];
    }
  }

  // 4. L'IMPRESSION AUTOMATIQUE
  // On utilise detectChanges et setTimeout pour laisser Angular afficher les données
  this.cdr.detectChanges(); 

  setTimeout(() => {
    window.print();

    // 5. Suppression après impression
  
    
    // Optionnel : fermer l'onglet après impression
    // window.close(); 
  }, 800); // 800ms pour être sûr que le rendu est fini
}
}
