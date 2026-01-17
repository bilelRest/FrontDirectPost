import { Component, OnInit } from '@angular/core';
import { Operation } from '../passenger_service/passenger-service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-situationprint',
  imports: [CommonModule],
  templateUrl: './situationprint.html',
  styleUrl: './situationprint.css',
})
export class Situationprint implements OnInit{
  operations: Operation[] = [];
   user=localStorage.getItem('username')?.toUpperCase();
today: Date = new Date();
  ngOnInit(): void {
    const situation=localStorage.getItem('situation');
    if(situation){
     this.operations=  JSON.parse(situation)
    console.log(this.operations)
    
    }
  }
calculateGlobalTotal(): number {
    return this.operations.reduce((acc, curr) => acc + (curr.total || 0), 0);
  }
}
