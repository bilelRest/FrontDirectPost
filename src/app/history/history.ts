import { Component, OnInit } from '@angular/core';
import { Operation, PassengerService, SessionGuichet } from '../passenger_service/passenger-service';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { error } from 'node:console';

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
  ops:any
  situationPrint(p:any){
this.ops={...p}
this.operations=this.ops.operations;
console.log("operation encapsuler");
console.log(this.operations);
localStorage.setItem('situation',JSON.stringify(this.operations))
const url = this.router.serializeUrl(this.router.createUrlTree(['/situationprint']));

      // 1. On lance l'ouverture de l'onglet
      window.open(url, '_blank', 'noopener')
        
        


  }
loadops() {
  this.passenger.loadAllSituation().subscribe({
    next: (data) => {
      this.lisGuichet = data;
      console.log("tous les situation recu");

      console.log(data);
    },
    error: (error) => {
      console.log(error);
    },
  });

}

}