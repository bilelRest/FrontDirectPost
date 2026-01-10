import { afterNextRender, Component, OnInit, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { PassengerService } from './passenger_service/passenger-service';

@Component({
  selector: 'app-root',
  standalone: true, // Assurez-vous d'être en standalone
  imports: [RouterOutlet],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App  {
  

  // 1. Utilisez un signal pour op_id au lieu d'une string simple
}
