import { Component } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms'; // Importez FormsModule
import { AuthService } from '../../auth/auth-service';
import { Router } from '@angular/router'; // Pour rediriger après login
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-login',
  standalone: true, 
  imports: [FormsModule, CommonModule], // Ajoutez FormsModule ici
  templateUrl: './login.html',
  styleUrl: './login.css',
})
export class Login {
  constructor(private log: AuthService, private router: Router) {}

  auth(form: NgForm) {
    // Correction : on passe form.value.password pour le mot de passe
    const credentials = { 
      username: form.value.username, 
      password: form.value.password 
    };

    this.log.login(credentials).subscribe({
  next: (data) => this.router.navigate(['/home']),
  error: (err) => {
    console.log("Status de l'erreur:", err.status); // Si c'est 0, c'est un problème de CORS ou Serveur éteint
    console.log("Détail de l'erreur:", err.error);  // Le message renvoyé par Spring
    alert("Identifiants incorrects");
  }
});
  }
}