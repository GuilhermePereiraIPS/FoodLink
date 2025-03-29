import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { AuthorizeService } from './api-authorization/authorize.service';
import { filter } from 'rxjs/operators';
import { NavigationService } from './services/navigation.service';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  standalone: false,
  styleUrl: './app.component.css'
})
export class AppComponent implements OnInit {
  title = 'foodlink.client';
  showNavElements: boolean = true;

  constructor(private router: Router, private authService: AuthorizeService, private navigationService: NavigationService) {}


  ngOnInit() {

    // Redirect if on root
    if (this.router.url == '/') {
      if (this.authService.isSignedIn()) {
        this.router.navigate(['/recipes']);
      }
    }

    this.router.events.subscribe(() => {
      // Esconder o footer quando a página for /signin
      this.showNavElements = !['/signin', '/register'].includes(this.router.url);
    });
  }
}
