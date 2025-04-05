import { HttpClient, HttpErrorResponse, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, throwError, catchError, map, of } from 'rxjs';
import {jwtDecode } from 'jwt-decode'
import { Recipe } from './recipes.service';
import { RecipeBook } from './recipe-books.service';
import { AuthorizeService } from '../api-authorization/authorize.service'; 

export interface User {
  id: string;
  email: string;
  username: string;
  aboutMe?: string;
  role: string;
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
  private currentUserSubject: BehaviorSubject<User | null> = new BehaviorSubject<User | null>(null);
  public currentUser$: Observable<User | null> = this.currentUserSubject.asObservable();

  constructor(private http: HttpClient, private authorizeService: AuthorizeService) {
    this.authorizeService.onStateChanged().subscribe(isAuthenticated => {
      if (this.authorizeService.isSignedIn()) {
        this.loadCurrentUser();
      } 
    });
  }

  private loadCurrentUser(): void {
    this.getCurrentUser(true).subscribe(
      (user) => {
        this.currentUserSubject.next(user);
      },
      (error) => {
        console.error('Error loading current user:', error);
        this.currentUserSubject.next(null); // Reset to null on error
      }
    );
  }

  getCurrentUser(includeDetails: boolean = true): Observable<User> {
    return this.http.get<User>('api/getCurrentUser', {
      params: { includeDetails }
    });
  }

  getUserRecipes(userId: string): Observable<Recipe[]> {
    let params = new HttpParams().set('id', userId); // Match backend's [FromQuery] string id
    return this.http.get<Recipe[]>('api/getUserRecipes', { params }).pipe(
      catchError(error => {
        console.error(`Error fetching recipes for user ${userId}:`, error);
        return of([]); 
      })
    );
  }

  getUserRecipeBooks(userId: string): Observable<RecipeBook[]> {
    let params = new HttpParams().set('id', userId); // Match backend's [FromQuery] string id
    return this.http.get<RecipeBook[]>('api/getUserRecipeBooks', { params }).pipe(
      catchError(error => {
        console.error(`Error fetching recipes for user ${userId}:`, error);
        return of([]);
      })
    );
  }

  getUserInfo(username?: string, id?: string): Observable<User> {
    let params = new HttpParams();
    if (username) params = params.set('username', username);
    if (id) params = params.set('id', id);

    return this.http.get<User>('api/getUserInfo', { params })
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

