import { Component, OnInit } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-main-layout',
  imports: [RouterOutlet,RouterLink,RouterLinkActive],
  templateUrl: './main-layout.html',
  styleUrl: './main-layout.css',
})
export class MainLayout implements OnInit{
  ngOnInit(): void {

this. username=localStorage.getItem('username');
  this. role=localStorage.getItem('role');
  }
  
username:string | null='';
role:string | null=''
 isSidebarCollapsed = true; // État de la sidebar
logout(){
  localStorage.clear();
  window.location.reload();
}
  toggleSidebar() {
    this.isSidebarCollapsed = !this.isSidebarCollapsed;
  }
}
