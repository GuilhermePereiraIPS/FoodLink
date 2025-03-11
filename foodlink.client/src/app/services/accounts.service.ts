import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, catchError, map, of } from 'rxjs';

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

  getAllUsers(): Observable<{ id: string; username: string }[]> {
    return this.http.get<{ id: string; username: string }[]>('api/users').pipe(
      map(users => {
       // console.log("Users fetched:", users);
        return users;
      }),
      catchError(error => {
        console.error("Error fetching users:", error);
        return of([]);
      })
    );
  }

  getUserById(userId: string): Observable<string> {
    return this.getAllUsers().pipe(
      map(users => {
        //console.log(`Searching for userId: ${userId}`);
        const user = users.find(u => u.id === userId);
        //console.log(user?.username);
        return user ? user.username : "Unknown User";
      }),
      catchError(error => {
        console.error(`Error fetching username for userId: ${userId}`, error);
        return of("Unknown User");
      })
    );
  }

}
