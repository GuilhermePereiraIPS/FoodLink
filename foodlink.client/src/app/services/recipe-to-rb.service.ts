import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface RecipeToRB {
  idRecipe: number;
  idRecipeBook: number;
}

@Injectable({
  providedIn: 'root'
})
export class RecipeToRBService {
  private apiUrl = 'api/recipetorb';

  constructor(private http: HttpClient) { }

  addRecipeToBook(recipeToRB: RecipeToRB): Observable<RecipeToRB> {
    return this.http.post<RecipeToRB>(this.apiUrl, recipeToRB);
  }

  removeRecipeFromBook(idRecipe: number, idRecipeBook: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}?idRecipe=${idRecipe}&idRecipeBook=${idRecipeBook}`);
  }
}
