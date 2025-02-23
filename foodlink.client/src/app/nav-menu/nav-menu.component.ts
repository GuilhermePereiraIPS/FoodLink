import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-nav-menu',
  standalone: false,
  
  templateUrl: './nav-menu.component.html',
  styleUrl: './nav-menu.component.css'
})
export class NavMenuComponent {
  menuOpen: boolean = false;

  constructor(private router: Router) { }

  isLoginOrRegisterPage(): boolean {
    return this.router.url === '/signin' || this.router.url === '/new';
  }

  toggleMenu() {
    this.menuOpen = !this.menuOpen;
  }

}
