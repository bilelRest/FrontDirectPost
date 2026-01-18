import { Component, OnInit } from '@angular/core';
import { Operation, PassengerService, SessionGuichet } from '../passenger_service/passenger-service';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-history',
  standalone: true, // Assurez-vous que standalone est présent si vous utilisez 'imports'
  imports: [CommonModule],
  templateUrl: './history.html',
  styleUrl: './history.css',
})
export class History implements OnInit {
  constructor(private passenger: PassengerService,private router:Router) { }

  operations: Operation[] = [];
  lisGuichet: SessionGuichet[] = [];

  ngOnInit(): void {
    this.loadops();

  }
  ops:Operation | undefined;
  situationPrint(p:any){
this.ops={...p}
localStorage.setItem('situation',JSON.stringify(this.ops))
    this.router.navigate(['/situation']);



  }
loadops() {
  this.passenger.loaodAllOperations().subscribe({
    next: (data) => {
      this.operations = data;
      const username = localStorage.getItem('username') || 'Anonyme';
      
      // Utilisation d'un objet pour grouper par date
      // Clé : la date (string), Valeur : l'objet SessionGuichet
      const groups: { [key: string]: SessionGuichet } = {};

      this.operations.forEach(op => {
        if (op.closed === true) {
          // On formate la date pour ignorer les secondes/millisecondes si besoin
          // Ici, on utilise la date brute comme clé, ou on peut la tronquer
          const dateKey = new Date(op.createdAt).toLocaleDateString(); 

          if (!groups[dateKey]) {
            // Si la date n'existe pas encore, on crée l'entrée
            groups[dateKey] = {
              agent: username,
              date: op.createdAt, // On garde la date d'origine pour l'affichage
              totale: 0
            };
          }
          // On additionne le montant à la session existante
          groups[dateKey].totale += op.total;
        }
      });

      // On transforme l'objet de regroupement en tableau pour l'affichage
      this.lisGuichet = Object.values(groups);
      
      console.log("Sessions groupées :", this.lisGuichet);
    },
    error: (err) => console.error(err)
  });
}
}