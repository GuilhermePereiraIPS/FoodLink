import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { ChangeDetectorRef } from '@angular/core';

import { User, AccountsService } from '../services/accounts.service';

@Component({
  selector: 'app-nav-menu',
  standalone: false,
  
  templateUrl: './nav-menu.component.html',
  styleUrl: './nav-menu.component.css'
})
export class NavMenuComponent {
  menuOpen: boolean = false;
  public user: User | null = null;

  constructor(private router: Router, private accountsService: AccountsService) { }

  ngOnInit() {
    this.accountsService.currentUser$.subscribe(
      (user) => {
        console.log('Current user updated:', user);
        this.user = user;
      },
      (error) => {
        console.error('Error in current user subscription:', error);
      }
    );
  }

  isLoginOrRegisterPage(): boolean {
    return this.router.url === '/signin' || this.router.url === '/new';
  }

  toggleMenu() {
    this.menuOpen = !this.menuOpen;
  }


}
