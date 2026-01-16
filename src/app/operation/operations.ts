import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { Operation, Parcel, PassengerService, Receiver, Sender, TrackingNumber } from '../passenger_service/passenger-service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import JsBarcode from 'jsbarcode';
import { Router } from '@angular/router';

declare var bootstrap: any;

@Component({
  selector: 'app-operation',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './operations.html',
  styleUrl: './operations.css',
})
export class Operations implements OnInit {
  operationList: Operation[] = [];
  displayData: any[] = [];
  filteredData: any[] = [];
  operationEncour = localStorage.getItem('op');

  filters = { date: '', id: '', envoi: '', exp: '', tel: '' };

  // Objet sélectionné pour le modal
  selectedParcel: Parcel = this.initEmptyParcel();

  constructor(private passengerService: PassengerService, private cdr: ChangeDetectorRef,private router:Router) {}

  ngOnInit(): void {
    this.loadOps();
  }

  initEmptyParcel(): Parcel {
    return {
      normal: false, createdAt: '', width: null, height: null, lenght: null,
      price: 0, weight: null, deleted: false, operationId: '',
      receiver: {} as Receiver, sender: {} as Sender,
      trackingNumber: {} as TrackingNumber, operation: {} as Operation,
    };
  }

  loadOps() {
    this.passengerService.loaodAllOperations().subscribe({
      next: (data) => {
        this.operationList = data.sort((a, b) => b.opId - a.opId);
        this.displayData = [];
        this.operationList.forEach(op => {
          op.parcel.forEach(p => {
            // On stocke l'opération ET le colis ensemble
            this.displayData.push({ operation: op, parcel: p });
          });
        });
        this.filteredData = [...this.displayData];
      }
    });
  }

  // CETTE FONCTION DOIT ÊTRE APPELÉE PAR LE BOUTON
 modifier(){
  this.router.navigate(['/passenger']);
 }
reprintEtiquette(item:any){
  this.preparePrint(item)
}
  preparePrint(item: any) {
    // 1. On assigne les données (item.parcel car item est l'objet du tableau)
    this.selectedParcel = JSON.parse(JSON.stringify(item));
    
    // 2. On force Angular à dessiner le HTML du modal
    this.cdr.detectChanges();

    // 3. On attend un court instant que le SVG soit présent dans le DOM
    setTimeout(() => {
      const barcodeVal = this.selectedParcel.trackingNumber?.formattedParcelId || "000000";
      
      try {
        JsBarcode("#trackingBarcode", barcodeVal, {
          format: "CODE128",
          width: 2,
          height: 60,
          displayValue: true
        });

        // 4. On affiche le modal Bootstrap
        const modalElem = document.getElementById('printModal');
        if (modalElem) {
          const modal = new bootstrap.Modal(modalElem);
          modal.show();
        } else {
          console.error("Élément #printModal introuvable dans le HTML");
        }
      } catch (err) {
        console.error("Erreur Barcode:", err);
      }
    }, 100);
  }

  applyFilters() {
    this.filteredData = this.displayData.filter(item => {
      const dateStr = item.parcel.createdAt ? new Date(item.parcel.createdAt).toLocaleDateString('fr-FR') : '';
      const idOp = item.operation.formattedId ? String(item.operation.formattedId) : '';
      const numEnvoi = item.parcel.trackingNumber?.formattedParcelId ? String(item.parcel.trackingNumber.formattedParcelId) : '';
      const expName = item.parcel.sender.sendName ? String(item.parcel.sender.sendName) : '';
      const tel = item.parcel.sender.sendTel ? String(item.parcel.sender.sendTel) : '';

      return (
        dateStr.includes(this.filters.date) &&
        idOp.toLowerCase().includes(this.filters.id.toLowerCase()) &&
        numEnvoi.toLowerCase().includes(this.filters.envoi.toLowerCase()) &&
        expName.toLowerCase().includes(this.filters.exp.toLowerCase()) &&
        tel.includes(this.filters.tel)
      );
    });
  }

  reimprimerOperation(p: any) {
    console.log(p)
    const reprint=JSON.stringify(p);
    localStorage.setItem('reprintOp',reprint)
window.open('/bordereau', '_blank');  }
  supprimer(p: any) {
    const confirmed:boolean=confirm("Etes vous sur de vouloir supprimer cette opération ?"+p)
    if(!confirmed) return;
    this.passengerService.deteleOperation(p).subscribe({
      next: (data) => {
        this.loadOps();
        this.applyFilters()
      //  this.operationList = this.operationList.filter(op => op.formattedId !== data.formattedId);
       // this.displayData = this.displayData.filter(item => item.operation.formattedId !== data.formattedId);
       }
    });
  
  }
}