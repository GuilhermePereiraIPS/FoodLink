import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AccountsService, User } from '../services/accounts.service';
import { Observable } from 'rxjs';
import { AuthorizeService } from '../api-authorization/authorize.service'; 


@Component({
  selector: 'app-nav-menu',
  standalone: false,
  templateUrl: './nav-menu.component.html',
  styleUrls: ['./nav-menu.component.css']
})
export class NavMenuComponent {
  menuOpen: boolean = false;
  public user$: Observable<User | null>; 

  constructor(private router: Router, private accountsService: AccountsService, private authorizeService: AuthorizeService) {
    this.user$ = this.accountsService.currentUser$;
  }

  isLoginOrRegisterPage(): boolean {
    return this.router.url === '/signin' || this.router.url === '/new';
  }

  toggleMenu() {
    this.menuOpen = !this.menuOpen;
  }

  logout() {
    this.authorizeService.signOut();
    this.router.navigate(['/signin']); // Redirect after logout
  }
}
