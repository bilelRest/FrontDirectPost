import { Component } from '@angular/core';
import { Operation, PassengerService, SessionGuichet } from '../passenger_service/passenger-service';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-validation',
  imports: [CommonModule],
  templateUrl: './validation.html',
  styleUrl: './validation.css',
})
export class Validation {
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
  ValiderChefSituation(){
    
  }
loadops() {
  this.passenger.loadAllSituationChef().subscribe({
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
