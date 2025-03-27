import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

export interface Recipe {
  id: number;
  userId: string;
  title: string;
  description: string;
  ingredients: string;
  instructions: string;
  createDate: Date;
}

@Injectable({
  providedIn: 'root'
})
export class RecipesService {

  constructor(private http: HttpClient) { }

  getRecipes(): Observable<Recipe[]> {
    return this.http.get<Recipe[]>('api/recipes');
  }

  //search and orderby, by default orderrecent is false
  getRecipesSearch(search: String, orderRecent: boolean = false): Observable<Recipe[]> {
    return this.http.get<Recipe[]>(`api/recipes/search?title=${search}&orderRecent=${orderRecent.toString()}`);
  }

  getRecipe(id: number): Observable<Recipe> {
    return this.http.get<Recipe>('api/recipes/' + id);
  }

  createRecipe(recipe: Recipe) :Observable<Recipe>{
    return this.http.post<Recipe>('api/recipes', recipe);
  }

  deleteRecipe(id: number): Observable<Recipe> {
    return this.http.delete<Recipe>('api/recipes/' + id);
  }

  updateRecipe(id: number, recipe: Recipe): Observable<void> {
    return this.http.put<void>(`api/recipes/${id}`, recipe);
  }

}
