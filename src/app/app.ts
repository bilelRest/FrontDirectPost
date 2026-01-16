import { Component,  } from '@angular/core';
import {   RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-root',
  standalone: true, // Assurez-vous d'être en standalone
  imports: [RouterOutlet],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App  {
 
}
