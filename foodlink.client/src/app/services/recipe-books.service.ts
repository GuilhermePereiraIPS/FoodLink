import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface RecipeBook {
  idRecipeBook?: number;
  recipeBookTitle: string;
  userId: string;
}

@Injectable({
  providedIn: 'root'
})
export class RecipeBooksService {
  private apiUrl = 'api/recipebooks';

  constructor(private http: HttpClient) { }

  getUserRecipeBooks(userId: string): Observable<RecipeBook[]> {
    return this.http.get<RecipeBook[]>(`${this.apiUrl}?userId=${ userId }`);
  }

  
  // Criar um Recipe Book
  createRecipeBook(recipeBook: RecipeBook): Observable<RecipeBook> {
    return this.http.post<RecipeBook>(this.apiUrl, recipeBook);
  }

  updateRecipeBook(recipeBook: RecipeBook): Observable<void> {
    return this.http.put<void>(`${this.apiUrl}/${recipeBook.idRecipeBook}`, recipeBook);
  }

  deleteRecipeBook(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
