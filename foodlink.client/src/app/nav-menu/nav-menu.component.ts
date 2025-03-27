import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AccountsService, User } from '../services/accounts.service';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-nav-menu',
  standalone: false,
  templateUrl: './nav-menu.component.html',
  styleUrls: ['./nav-menu.component.css']
})
export class NavMenuComponent {
  menuOpen: boolean = false;
  public user$: Observable<User | null>; 

  constructor(private router: Router, private accountsService: AccountsService) {
    this.user$ = this.accountsService.currentUser$;
  }

  isLoginOrRegisterPage(): boolean {
    return this.router.url === '/signin' || this.router.url === '/new';
  }

  toggleMenu() {
    this.menuOpen = !this.menuOpen;
  }

  logout() {

  }
}
