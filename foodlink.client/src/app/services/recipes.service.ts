import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

export interface Recipe {
  id: number;
  title: string;
}

@Injectable({
  providedIn: 'root'
})
export class RecipesService {

  constructor(private http: HttpClient) { }

  getRecipes(): Observable<Recipe[]> {
    return this.http.get<Recipe[]>('api/recipes');
  }

  getRecipe(id: number): Observable<Recipe> {
    return this.http.get<Recipe>('api/recipes/' + id);
  }

  createRecipe(recipe: Recipe) :Observable<Recipe>{
    return this.http.post<Recipe>('api/recipes', recipe);
  }

}
