import { HttpClient, HttpParams } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { catchError, of } from 'rxjs';

@Component({
  selector: 'app-activate',
  template: `<p>{{ message }}</p>`
})
export class ActivateComponent implements OnInit {
  message: string = "Activating your account...";

  constructor(private route: ActivatedRoute, private http: HttpClient, private router: Router) { }

  ngOnInit() {
    const token = this.route.snapshot.queryParams['token'] || new URLSearchParams(window.location.search).get('token');

    if (!token) {
      this.message = "Invalid activation link.";
      setTimeout(() => this.router.navigate(['/signin']), 3000);
      return;
    }

    let params = new HttpParams().set('token', token);

    this.http.get('/api/activate', { params }).pipe(
      catchError(error => {
        console.error(`Activation failed for token ${token}:`, error);
        this.message = "Activation failed.";
        setTimeout(() => this.router.navigate(['/']), 3000);
        return of({ error: 'Activation failed' });
      })
    ).subscribe(response => {
      if (response && (response as any).error) {
        this.message = "Activation failed.";
        setTimeout(() => this.router.navigate(['/']), 3000);
      } else {
        this.message = "Account activated successfully!";
        setTimeout(() => this.router.navigate(['/signin']), 3000);
      }
    });
  }
}
