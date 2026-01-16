import { Component, OnInit } from '@angular/core';
import { Operation, Parcel, PassengerService } from '../passenger_service/passenger-service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms'; // À ajouter dans les imports du décorateur

@Component({
  selector: 'app-operation',
  imports: [CommonModule, FormsModule],
  templateUrl: './operations.html',
  styleUrl: './operations.css',
})
// operations.ts
export class Operations implements OnInit {
  operationList: Operation[] = [];
  displayData: any[] = []; // Tableau combiné pour l'affichage
  operationEncour = localStorage.getItem('op');

  constructor(private passengerService: PassengerService) {}

  ngOnInit(): void {
    this.loaodOps();
  }
filteredData: any[] = [];
 filters = {
  date: '',
  id: '',
  envoi: '',
  exp: '',
  tel: ''
};

loaodOps() {
  this.passengerService.loaodAllOperations().subscribe({
    next: (data) => {
      // Tri par ID décroissant comme demandé précédemment
      this.operationList = data.sort((a, b) => b.opId - a.opId);
      
      this.displayData = [];
      this.operationList.forEach(op => {
        op.parcel.forEach(p => {
          this.displayData.push({ operation: op, parcel: p });
        });
      });

      // Au chargement initial, les données filtrées = toutes les données
      this.filteredData = [...this.displayData];
    }
  });
}

applyFilters() {
  this.filteredData = this.displayData.filter(item => {
    // 1. On prépare les valeurs en les transformant en String et en gérant le null
    const dateStr = item.parcel.createdAt ? new Date(item.parcel.createdAt).toLocaleDateString('fr-FR') : '';
    const idOp = item.operation.formattedId ? String(item.operation.formattedId) : '';
    const numEnvoi = item.parcel.trackingNumber?.formattedParcelId ? String(item.parcel.trackingNumber.formattedParcelId) : '';
    const expName = item.parcel.sender.sendName ? String(item.parcel.sender.sendName) : '';
    
    // Correction spécifique pour le téléphone (convertit en string si c'est un nombre)
    const tel = item.parcel.sender.sendTel ? String(item.parcel.sender.sendTel) : '';

    // 2. On effectue le filtrage
    return (
      dateStr.includes(this.filters.date) &&
      idOp.toLowerCase().includes(this.filters.id.toLowerCase()) &&
      numEnvoi.toLowerCase().includes(this.filters.envoi.toLowerCase()) &&
      expName.toLowerCase().includes(this.filters.exp.toLowerCase()) &&
      tel.includes(this.filters.tel) // Maintenant 'tel' est forcément une String
    );
  });
}
}