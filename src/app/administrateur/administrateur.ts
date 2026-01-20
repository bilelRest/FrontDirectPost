import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Admin } from '../admin';
import { AppUser } from '../passenger_service/passenger-service';

@Component({
  selector: 'app-administrateur',
  imports: [CommonModule,FormsModule],
  templateUrl: './administrateur.html',
  styleUrl: './administrateur.css',
})
export class Administrateur implements OnInit {
  constructor(private dmin:Admin,private cdr:ChangeDetectorRef){}
ngOnInit(): void {
  throw new Error('Method not implemented.');
}
currentUser:AppUser={
  agence: '',
  username: '',
  nomPrenom: '',
  password: '',
  email: '',
  appRoles: []
}
role:any;
usr:any;
addUser() {
  // Vérification ici
  console.log("Objet envoyé au serveur :", this.currentUser);

  if (!this.currentUser.username || !this.currentUser.password) {
    alert("Veuillez remplir les champs obligatoires");
    return;
  }
  this.cdr.detectChanges();
try{
  this.dmin.addUser(this.currentUser).subscribe({
    next: data => {
      if(data != null)
        alert("Utilisateur ajouté avec succès");
      else(
        alert("Erreur lors de l'ajout de l'utilisateur:\n Utilisateur déjà existant")
      )
      console.log("Réponse du serveur :", data);
      this.resetForm(); // Vider le formulaire après succès
    },
    error: err => {

    }
  });
}catch(e){
}
}

resetForm() {
  this.currentUser = {
    agence:'',
    username: '',
    nomPrenom: '',
    password: '',
    email: '',
    appRoles: []
  };
}
addRole(){
  if(this.role==null || this.role==null) {
    alert("Veuillez remplir les champs obligatoires");
    return;
  }
  this.dmin.addroletouser(this.usr,this.role).subscribe({next:data=>{
    if(data !=null){
      alert("Role ajouté avec succès");
    }
    else{
      alert("Erreur lors de l'ajout du role");
    }
  }})
}


}
