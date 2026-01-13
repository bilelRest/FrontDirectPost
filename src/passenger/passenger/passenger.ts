import { afterNextRender, ChangeDetectorRef, Component, OnInit, signal } from '@angular/core';
import { PassengerService, Receiver, Sender,Operation, Parcel, TrackingNumber, Pochette, Payment } from '../../app/passenger_service/passenger-service';
import { CommonModule } from '@angular/common';
import { FormControl, FormGroup, FormsModule } from '@angular/forms';
import JsBarcode from 'jsbarcode';
import { response } from 'express';
import { Router } from '@angular/router';
import { RouterLink } from '@angular/router'; // <--- Bien vérifier le 'r' à la fin
    declare var bootstrap: any;

@Component({
  selector: 'app-passenger',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './passenger.html',
  styleUrl: './passenger.css',
})

export class Passenger implements OnInit {

 op_id = signal<string>("Chargement ...");
   opFormatted:any;
  senders: Sender[] = [];
filteredReceivers: Receiver[] = [];
receivers:Receiver[]=[];
activeReceiverField: string = '';  filteredSenders: Sender[] = [];
  activeField: string = '';
  
  isNatParcel:boolean=true;
isMarchandise:boolean=false;
rppimarchand:boolean=false;
emsimarchand:boolean=false;
parcels:Parcel[]=[]
parcel: Parcel = {
  width: 0,
  height: 0,
  lenght: 0,
  price: 0,
  weight: null,
  deleted: false,
  createdAt: new Date(),
  sender: {} as Sender,
  receiver: {} as Receiver,
  // Initialisation de l'objet operation pour que le lien existe
  operation: {
    banque:'',
    cheque:'',
    formattedId: ''
  } as Operation, 
  trackingNumber: {
    parcelId: 0,
    createdAt: '', 
    formattedParcelId: ''
  } as TrackingNumber,
};
operation_en_cour:Operation={
  opId: 0,
  banque: '',
  cheque: '',
  formattedId: '',
  createdAt: '',
  validated: false,
  cancelled: false,
  parcel: [],
  pochette: []
}
pochette: Pochette = {
  totalPrice: 0,
  deleted: false,
  createdAt: new Date(),
  sender: {} as Sender,
  // Initialisation de l'objet operation pour que le lien existe
  operation: {
    formattedId: ''
  } as Operation,
  quantite: 1,
  typePochette: ''
};
prix:number=0;
weight:any
  // Objet Expéditeur complet
  currentSender: Sender = {
    sendId: 0,
    sendName: '',
    sendSocialReason: '',
    sendTel: 0,
    adress: '',
    postalCode: 0,
    city: '',
    country: '',
    sendEmail: '',
    createdAt: new Date()
  
  }

  // Objet Destinataire complet
  currentReceiver: Receiver ={
    recId: 0,
    recName: '',
    recSocialReason: '',
    recTel: 0,
    adress: '',
    postalCode: 0,
    city: '',
    country: '',
    recEmail: '',
    createdAt:new Date
  
  }
  payment:Payment={
    banque: '',
    cheque: ''
  }
  isNat:boolean=true;
  isFlour:boolean=true;
  isEmsi:boolean=false;
  isRppi:boolean=false;
  overweignt: boolean=false;
  cheque:boolean=false;
pochettes:Pochette[]=[]
today: Date = new Date();
  
  constructor(private passenger_service: PassengerService,private router:Router,private cdr: ChangeDetectorRef) {

    afterNextRender(() => {
      setTimeout(() => {
        this.loadNewOperation();
      }, 0);
    });
  }
  

validerPayment() {
  
  if(this.cheque && (this.payment.cheque == '' || this.payment.banque == '')) {
    return alert("Données de chèque ou banque manquant !! ");
  }

  if(!this.cheque) {
    this.payment.banque = 'none';
    this.payment.cheque = 'none';
  }

  this.passenger_service.validatePayment(
    localStorage.getItem('op') ? localStorage.getItem('op') : this.opFormatted, 
    this.payment
  ).subscribe({
    next: (data) => {
      console.log("donee recu du serveurs");
      console.log(data);
      if(data.validated) {
        // Sauvegarder l'opération dans localStorage
        localStorage.setItem("currentop", JSON.stringify(data));
        
        // Ouvrir le bordereau dans un nouvel onglet
        const printUrl = this.router.createUrlTree(['/bordereau']).toString();
        window.open(printUrl, '_blank');
        
        // Rediriger vers home après un court délai
        setTimeout(() => {
          this.router.navigate(['/home']);
        }, 500);
      }
    },
    error: (err) => {
      alert("Un problème est survenu lors de la validation de l'opération");
    }
  });
}

// Optionnel : Calculer le total global
calculateGlobalTotal() {
  let total = 0;
  this.operation_en_cour?.parcel?.forEach((p:any) => total += (p.price || 0));
  return total.toFixed(3);
} 
ngOnInit(): void {
    const monForm = new FormGroup({
    btncheck1: new FormControl(true) // 'true' définit la case comme cochée par défaut
  });
    this.loadReceivers();
    this.loadSenders();
  }
   readonly TARIFS_POCHETTES: { [key: string]: number } = {
  'pn': 1,    // Pochette National
  'pnpm': 1.2, // International PM
  'pngm': 1.5, // International GM
  'mat': 2    // Matelassée
};
modeDePayment(event:any){
if(event.target.value=="cheque")
  this.cheque=true;
else this.cheque=false;

}
addPochette(event: any) {
  event.preventDefault(); 
 // console.log(this.currentSender)// Empêche le rechargement de la page
if(this.currentSender.sendName=='' && this.currentSender.sendSocialReason=='' ){
    alert("Veuillez remplir les données de l\'expediteur :\n Nom complet ou bien raison sociale")
  }
  if (!this.pochette.typePochette || this.pochette.quantite <= 0) {
    alert("Veuillez choisir un type et une quantité valide");
    return;
  }

  // Calcul du prix
  const prixUnitaire = this.TARIFS_POCHETTES[this.pochette.typePochette] || 0;
  this.pochette.totalPrice = prixUnitaire * this.pochette.quantite;
  this.pochette.sender=this.currentSender;
  console.log("Pochette a envoyer  "+this.pochette)
  this.passenger_service.addPochetteToOperation(this.opFormatted,this.pochette).subscribe({next:data=>{
    console.log(data)
    this.pochettes=data.pochette
  },error:(err)=>{
    console.log(err)
  }})
  

  console.log(`Ajout de ${this.pochette.quantite} pochettes ${this.pochette.typePochette}. Prix: ${this.pochette.totalPrice}`);
  
  // Ici, vous pouvez ajouter l'objet à une liste (tableau) de pochettes
  // this.maListeDeCommande.push({...this.pochette});
}
  // Calcul du total des prix des colis
calculateTotal(): number {
  let total = 0; // Utiliser 'let' car la valeur va changer

  // Vérification et calcul pour les parcels
  if (this.parcels) {
    for (const pa of this.parcels) {
      total += pa.price || 0; // Sécurité au cas où price est indéfini
    }
  }

  // Vérification et calcul pour les pochettes
  if (this.pochettes) {
    for (const po of this.pochettes) {
      total += po.totalPrice || 0;
    }
  }

  return total;
}
isOffre:boolean=false
setAppelOffre(event:any){
  if(event.target.value=='Appel'){
    this.isOffre=true;
  }else{
    this.isOffre=false;
  }

}

  chargerOperationApresAjoutColis(op:string){
    this.passenger_service.getOpeartionContent(op).subscribe({next:data=>{
      this.parcels=data.parcel;
      console.log(this.parcels)
    }})
  }
  validerEnvoie(){
    this.parcel.sender=this.currentSender;
    this.parcel.receiver=this.currentReceiver;
    this.parcel.price=this.prix;
    this.parcel.weight=this.weight;
    
this.passenger_service.addParcel(this.parcel,this.opFormatted).subscribe({
    next: (response) => {
      console.log('Colis ajouté avec succès !', response);
  this.preparePrint() ;

     this.parcel.trackingNumber=response.trackingNumber
    // this.loadNewOperation()
    // this.chargerOperationApresAjoutColis(localStorage.getItem('op')?localStorage.getItem('op'):this.opFormatted)
     this.currentReceiver={
 recId: 0,
 recName: '',
 recSocialReason: '',
 recTel: 0,
 adress: '',
 postalCode: 0,
 city: '',
 country: '',
 recEmail: '',
 createdAt:new Date

 }
     this.weight=null
     this.parcels.push(response)
     this.parcel.price=0
      // Optionnel : réinitialiser le formulaire ici
      this.cdr.detectChanges();
    },
    error: (err) => {
      console.error('Erreur lors de l\'ajout', err);
      alert('Erreur lors de l\'enregistrement');
    }
  });
  }
  calculerPrix(){
    if(this.weight>30) {this.overweignt=true}else{this.overweignt=false};
    if(this.isNatParcel){
    if (0.001 <= this.weight && this.weight <= 0.5) {
            this.prix = 5;
        } else if (0.501 <= this.weight && this.weight <= 1) {
            this.prix = 7;
        } else if (1.001 <= this.weight && this.weight <= 2) {
            this.prix = 9;
        } else if (2.001 <= this.weight && this.weight <= 5) {
            this.prix = 10;
        } else if (5.001 <= this.weight && this.weight <= 7) {
            this.prix = 12;
        } else if (7.001 <= this.weight && this.weight <= 12) {
            this.prix = 14;
        } else if (12.001 <= this.weight && this.weight <= 17) {
            this.prix = 20;
        } else if (17.001 <= this.weight && this.weight <= 22) {
            this.prix = 25;
        } else if (22.001 <= this.weight && this.weight <= 27) {
            this.prix = 30;
        } else if (27.001 <= this.weight && this.weight <= 30) {
            this.prix = 35;
        }else{this.prix=0}
      }
  }
  isMarchand(event: any) {
    const val = event.target.value;
    this.isMarchandise = (val === 'Marchandise');
    this.rppimarchand=(this.isMarchandise && this.isRppi)
        this.coutryFilter()

}
  
  onNatServiceChange(){
    this.isNatParcel=true;

  }
  onOtherServiceChange(event:any) {
    if(event.target.value=='RPPI' && this.isMarchandise){
      this.rppimarchand=true
    }else{
      this.rppimarchand=false;
    }
  this.isNatParcel = false; // Cache le div
}
coutryFilter(){
if(this.currentReceiver.country!='Tunisie'){
  this.isEmsi=true;
  this.isRppi=true;
  this.isFlour=false;
  this.isNat=false;

}else{
  this.isEmsi=false;
  this.isRppi=false;
  this.isFlour=true;
  this.isNat=true;
}
}
// N'oubliez pas de déclarer Bootstrap pour éviter les erreurs TS

preparePrint() {
  // 1. On génère le code à barres dans la modale
  // On utilise un petit timeout pour s'assurer que l'élément SVG est prêt
  setTimeout(() => {
    JsBarcode("#trackingBarcode", this.parcel.trackingNumber?.formattedParcelId || "N/A", {
      format: "CODE128",
      width: 2.5,
      height: 70,
      displayValue: true
    });
  }, 100);

  // 2. On ouvre la modale
  const modalElem = document.getElementById('printModal');
  const modal = new bootstrap.Modal(modalElem);
  modal.show();
}

confirmAndPrint() {
  window.print();
}
newOperation(){
  localStorage.removeItem('op');
  this.loadNewOperation()
}
loadNewOperation() {
  // 1. On récupère la valeur actuelle du signal
  let currentId = localStorage.getItem('op')

  // 2. Sécurité : Si c'est le texte par défaut ou vide, on force 'new'
  if (currentId === "Chargement ..." || !currentId ) {
    currentId = 'new';
  }

  console.log("Valeur envoyée au backend :", currentId);

  this.passenger_service.loadNewOperation(currentId?currentId:'new').subscribe({
    next: (data) => {
      // 3. On met à jour le Signal ET la variable avec le nouvel ID reçu
      this.op_id.set(data.formattedId);
      this.opFormatted = data.formattedId;
      localStorage.setItem("op",data.formattedId)
      this.parcels=data.parcel;
      this.pochettes=data.pochette
      console.log(data)
      
      console.log("Nouvel ID reçu et stocké :", data.formattedId);
    },
    error: (err) => {
      console.error('Erreur lors du chargement:', err);
      this.op_id.set("Erreur");
    }
  });
}

  // --- LOGIQUE DE RECHERCHE LIKE SQL ---
  cheksender(event: any) {
    const query = event.target.value.toString().toLowerCase();
    const fieldName = event.target.name;

    // Définir quel champ affiche la liste
    if (fieldName === 'sendTel') this.activeField = 'tel';
    else if (fieldName === 'sendName') this.activeField = 'name';
    else if (fieldName === 'sendSocialReason') this.activeField = 'social';

    if (query.length < 2) {
      this.filteredSenders = [];
      return;
    }

    this.filteredSenders = this.senders.filter(s => 
      (s.sendName && s.sendName.toLowerCase().includes(query)) || 
      (s.sendTel && s.sendTel.toString().includes(query)) ||
      (s.sendSocialReason && s.sendSocialReason.toLowerCase().includes(query))
    );
  }

  // --- SÉLECTION DEPUIS LA LISTE ---
  selectSender(s: Sender) {
    // On mappe les données reçues vers notre objet currentSender
    this.currentSender = { 
      ...s,
      // Assurez-vous que les clés correspondent (ex: s.city -> this.currentSender.city)
      country: s.country || 'Tunisie' 
    };
    this.filteredSenders = []; 
    this.activeField = '';
  }

resetSender() {
    this.weight = undefined; // Ou this.weight = '';
    
    this.filteredSenders = [];
    this.activeField = '';
    
    // Si vous voulez forcer le prix à zéro aussi lors du reset
    this.parcel.price = 0; 
}

  // --- CHARGEMENT API ---
  loadSenders() {
    this.passenger_service.loadSenders().subscribe({
      next: (data) => this.senders = data,
      error: (err) => console.error('Erreur senders', err)
    });
  }
checkReceiver(event: any) {
  const query = event.target.value.toString().toLowerCase();
  const fieldName = event.target.name;

  // Définir quel champ affiche la liste pour le destinataire
  if (fieldName === 'recTel') this.activeReceiverField = 'tel';
  else if (fieldName === 'recName') this.activeReceiverField = 'name';
  else if (fieldName === 'recSocialReason') this.activeReceiverField = 'social';

  if (query.length < 2) {
    this.filteredReceivers = [];
    return;
  }

  // Filtrage sur la liste des receivers chargée depuis votre service
  this.filteredReceivers = this.receivers.filter(r => 
    (r.recName?.toLowerCase().includes(query)) || 
    (r.recTel?.toString().includes(query)) ||
    (r.recSocialReason?.toLowerCase().includes(query))
  );
}

// 3. La méthode de sélection pour le destinataire
selectReceiver(r: Receiver) {
  this.currentReceiver = { ...r };
  this.filteredReceivers = [];
  this.activeReceiverField = '';
}
  loadReceivers() {
    this.passenger_service.loadReceivers().subscribe({
      next: (data) => this.receivers = data,
      error: (err) => console.error('Erreur receivers', err)
    });
  }
 }