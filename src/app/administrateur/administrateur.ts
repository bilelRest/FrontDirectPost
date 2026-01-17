import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-administrateur',
  imports: [CommonModule,FormsModule],
  templateUrl: './administrateur.html',
  styleUrl: './administrateur.css',
})
export class Administrateur implements OnInit {
ngOnInit(): void {
  throw new Error('Method not implemented.');
}
addUser(){}
addRole(){}

username:string='';
password:string='';
role:string='';
  
}
