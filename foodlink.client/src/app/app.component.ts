import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthorizeService } from './api-authorization/authorize.service';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  standalone: false,
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'foodlink.client';
  showFooter: boolean = true;

  //constructor(private http: HttpClient) {}

  //ngOnInit() {
  //}


  //title = 'foodlink.client';

  constructor(private router: Router, private authService: AuthorizeService) {}


  ngOnInit() {
    // Redirect if on root
    if (this.router.url == '/') {
      if (this.authService.isSignedIn()) {
        this.router.navigate(['/recipes']);
      }
    }

    this.router.events.subscribe(() => {
      // Esconder o footer quando a página for /signin
      this.showFooter = !['/signin', '/register'].includes(this.router.url);
    });
  }
}
