import { Component, OnInit } from '@angular/core';
import { Operation, Parcel, PassengerService, Pochette } from '../passenger_service/passenger-service';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-situation',
  imports: [CommonModule],
  templateUrl: './situation.html',
  styleUrl: './situation.css',
})
export class Situation implements OnInit{
  constructor(private router: Router,private passengerService: PassengerService) { }

  ngOnInit(): void {
this.loadOps();
  }
  operations : Operation[] = [];
  parcels:Parcel[]=[];
pochettes:Pochette[]=[];

loadOps() {
    this.passengerService.loaodAllOperations().subscribe({
      next: data => {
        this.operations = data;
      },
      error: err => console.log(err)
    });
  }

  // Fonction pour calculer le total cumulé
  calculateGlobalTotal(): number {
    return this.operations.reduce((acc, curr) => acc + (curr.total || 0), 0);
  }

}
