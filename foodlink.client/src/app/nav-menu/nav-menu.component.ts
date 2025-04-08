import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { AccountsService, User } from '../services/accounts.service';
import { Observable } from 'rxjs';
import { filter } from 'rxjs/operators';
import { AuthorizeService } from '../api-authorization/authorize.service'; 
import { NavigationService, Section } from '../services/navigation.service';


@Component({
  selector: 'app-nav-menu',
  standalone: false,
  templateUrl: './nav-menu.component.html',
  styleUrls: ['./nav-menu.component.css']
})
export class NavMenuComponent {
  public menuOpen: boolean = false;
  public user$: Observable<User | null>; 
  public section!: Section;

  public sectionTitle: string = '';
  sectionId : string = ''

  @ViewChild('userAvatar', { static: false }) userAvatarRef!: ElementRef; // Reference to avatar element

  constructor(private router: Router, private accountsService: AccountsService, private authorizeService: AuthorizeService, private navigationService: NavigationService,) {
    this.user$ = this.accountsService.currentUser$;
  }

  ngOnInit(): void {
    this.navigationService.currentSection$.subscribe(section => {
      this.sectionTitle = section.title;
      this.sectionId = section.id;
    });

    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe(() => {
      const route = this.router.routerState.root.firstChild;
      this.sectionTitle = route?.snapshot.data['sectionTitle'] || '';
    });
  }

  isLoginOrRegisterPage(): boolean {
    return this.router.url === '/signin' || this.router.url === '/new';
  }

  toggleMenu(event: MouseEvent) {
    this.menuOpen = !this.menuOpen;

    if (this.menuOpen && this.userAvatarRef) {
      
        const avatar = this.userAvatarRef.nativeElement;
        const menu = document.querySelector('.user-menu') as HTMLElement;
        if (menu) {
          const rect = avatar.getBoundingClientRect();
          menu.style.top = `${(rect.height / 2) + 100}px`;
          menu.style.right = `${(rect.width / 2) + 50}px`;
        } else {
          console.error('User menu not found in DOM');
        }
      
    }
  }

  logout() {
    this.authorizeService.signOut();
    this.router.navigate(['/signin']); // Redirect after logout
  }
}
