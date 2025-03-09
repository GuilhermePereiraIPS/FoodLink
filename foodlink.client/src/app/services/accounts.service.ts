import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

export interface User {
  email: string;
  id: string;
  username: string;
}

@Injectable({
  providedIn: 'root'
})

export class AccountsService {

  constructor(private http: HttpClient) { }

  getCurrentUser(includeDetails: boolean = true): Observable<User> {
    return this.http.get<User>('api/currentUser', {
      params: { includeDetails }
    });
  }

  getUserInfo(username: string): Observable<User> {
    return this.http.get<User>('api/getUserInfo', {
      params: { username }
    });
  }

}
