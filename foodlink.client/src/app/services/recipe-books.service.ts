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

  // Criar um Recipe Book
  createRecipeBook(recipeBook: RecipeBook): Observable<RecipeBook> {
    return this.http.post<RecipeBook>(this.apiUrl, recipeBook);
  }
}
