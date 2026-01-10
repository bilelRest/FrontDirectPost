import { afterNextRender, Component, OnInit, signal } from '@angular/core';
import { PassengerService } from '../../app/passenger_service/passenger-service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-passenger',
  standalone: true, // Requis pour utiliser "imports"
  imports: [CommonModule],
  templateUrl: './passenger.html',
  styleUrl: './passenger.css',
})
export class Passenger implements OnInit {

 op_id = signal<string>("Chargement ...");

  constructor(private passenger_service: PassengerService) {
    afterNextRender(() => {
      // Le setTimeout(0) est l'astuce ultime pour éviter NG0100
      setTimeout(() => {
        this.loadNewOperation();
      }, 0);
    });
  }

  ngOnInit(): void {
    console.log('Composant initialisé...');
  }

  loadNewOperation() {
    this.passenger_service.getPassengerData().subscribe({
      next: (data) => {
        // 2. Utilisez .set() pour mettre à jour la valeur
        this.op_id.set(data.formattedId);
      },
      error: (err) => {
        console.error('Erreur de communication avec l\'API :', err);
        this.op_id.set("Erreur de chargement");
      }
    });
  }
}