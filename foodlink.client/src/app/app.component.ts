import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';


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

  constructor(private router: Router) {
    this.router.events.subscribe(() => {
      // Esconder o footer quando a página for /signin
      this.showFooter = !['/signin', '/new'].includes(this.router.url);
    });
  }
}
