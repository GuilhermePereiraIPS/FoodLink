import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

export interface User {
  id: string;
  email: string;
  username: string;
  aboutMe?: string;
}

export interface UserUpdate {
  username?: string;
  email?: string;
  aboutMe?: string;
  password?: string;
  currentPassword: string;
}

@Injectable({
  providedIn: 'root'
})

export class AccountsService {

  constructor(private http: HttpClient) { }

  getCurrentUser(includeDetails: boolean = true): Observable<User> {
    return this.http.get<User>('api/getCurrentUser', {
      params: { includeDetails }
    });
  }

  getUserInfo(username?: string, id?: string): Observable<User> {
    return this.http.get<User>('api/getUserInfo', {
      params: { username: username || '', id: id || '' }
    });
  }
  
  editUser(userUpdate: UserUpdate): Observable<any> {
    return this.http.put('api/updateCurrentUser', userUpdate);
  }
}
