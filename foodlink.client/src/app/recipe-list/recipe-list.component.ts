import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';

export interface Recipe {
  id: number;
  title: string;
}

@Component({
  selector: 'app-recipe-list',
  standalone: false,
  
  templateUrl: './recipe-list.component.html',
  styleUrl: './recipe-list.component.css'
})
export class RecipeListComponent implements OnInit{
  public recipes: Recipe[] = [];

  constructor(private http: HttpClient) { }

  ngOnInit() {
    this.getRecipes();
  }

  getRecipes() {
    this.http.get<Recipe[]>('api/Recipes').subscribe(
      (result) => {
        console.log('Recipes fetched:', result);
        this.recipes = result;
      },
      (error) => {
        console.error(error);
      }
    );
  }
}
