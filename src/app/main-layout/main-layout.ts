import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-main-layout',
  imports: [RouterOutlet,RouterLink,RouterLinkActive],
  templateUrl: './main-layout.html',
  styleUrl: './main-layout.css',
})
export class MainLayout implements OnInit{
  constructor(private cdr: ChangeDetectorRef) { }
  isSidebarCollapsed = true;
  ngOnInit(): void {
//this. username=localStorage.getItem('username');
if(localStorage.getItem('role')=='ROLE_ADMIN')
  this. role='Administrateur';
else if(localStorage.getItem('role')=='ROLE_AGENT')
  this. role='Guichetier';
else if(localStorage.getItem('role')=='ROLE_CHEF')
  this. role='Chef d\'agence';

  this. agence=localStorage.getItem('agence');
  this. nomPrenom=localStorage.getItem('nomPrenom');

  }
  
username:string | null='';
role:string | null='';
agence:string | null='';
nomPrenom:string | null='';
  // État de la sidebar
logout(){
  localStorage.clear();
  window.location.reload();
}
  toggleSidebar() {
    this.isSidebarCollapsed = !this.isSidebarCollapsed;
    this.cdr.detectChanges();
  }
}
