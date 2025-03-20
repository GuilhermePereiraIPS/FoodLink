import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { throwError } from 'rxjs';
import { Observable, catchError, map, of } from 'rxjs';

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
    return this.http.put('api/updateCurrentUser', userUpdate).pipe(
      catchError(this.handleError)
    );
  }

  private handleError(error: HttpErrorResponse) {
    let errorMessage = 'An unknown error occurred!';
    if (error.error instanceof ErrorEvent) {
      // Client-side or network error
      errorMessage = `Error: ${error.error.message}`;
    } else {
      // Server-side error
      if (error.status === 400) {
        errorMessage = error.error?.message || 'Bad Request';
      }
    }
    return throwError(errorMessage);
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

