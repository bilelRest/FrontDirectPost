import { Component, OnInit } from '@angular/core';
import { Operation, Parcel, PassengerService, Pochette } from '../passenger_service/passenger-service';
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
   total=0;
  
  parcels: Parcel[] = [];
  pochettes:Pochette[]=[];
 operation_en_cours = JSON.parse(localStorage.getItem("currentop") || 'null');  

  ngOnInit(): void {
   this.operation_en_cour() 
  }

  operation_en_cour() {
    if (this.opid) {
      console.log("Operation au debut")
      console.log(this.operation_en_cours)
    //  this.print_service.getOpeartionContent(this.opid).subscribe({
      //  next: data => {
        //  this.operation = data;
          this.parcels = this.operation_en_cours.parcel;
          this.pochettes=this.operation_en_cours.pochette;
          console.log("Operation apres chargement")
          console.log(this.operation_en_cours)
          console.log("Pochette list ")
          console.log(this.pochettes)
          console.log("Parcel list ")
          console.log(this.parcels)

          for (let i = 0; i < this.parcels.length; i++) {
            this.total+=this.parcels[i].price;
          }
         for (let i = 0; i < this.pochettes.length; i++) {
          this.total+=this.pochettes[i].totalPrice;
  switch (this.pochettes[i].typePochette) {
    case 'pn':
      this.pochettes[i].typePochette = 'Pochette National';
      break;
    case 'pnpm':
      this.pochettes[i].typePochette = 'Pochette International Petit Modèle';
      break;
    case 'pngm':
      this.pochettes[i].typePochette = 'Pochette International Grand Modèle';
      break;
    case 'mat':
      this.pochettes[i].typePochette = 'Pochette Matelassée';
      break;
    default:
      // Optionnel : valeur par défaut si aucune ne correspond
      break;
  }
}
        //  console.log('Parcels chargés:', this.parcels);
    //    },
        //error: err => {
          //console.error('Erreur lors du chargement:', err);
        //}
      //});
    }
  }
}