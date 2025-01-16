import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';

import { Recipe, RecipesService } from '../services/recipes.service';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-recipe-list',
  standalone: false,
  
  templateUrl: './recipe-list.component.html',
  styleUrl: './recipe-list.component.css'
})
export class RecipeListComponent implements OnInit{
  public recipes: Recipe[] = [];
  public searchTerm: string = '';

  constructor(private http: HttpClient, private recipesService: RecipesService, private router: Router) { }

  ngOnInit() {
    this.getRecipes();
  }

  getRecipes() {

    this.recipesService.getRecipes().subscribe(
      (result) => {
        console.log('Recipes fetched:', result);
        this.recipes = result;
      },
      (error) => {
        console.error(error);
      }
    );
  }

  getRecipesSearch() {
    this.recipesService.getRecipesSearch(this.searchTerm).subscribe(
      (result) => {
        console.log('Recipes fetched:', result);
        this.recipes = result;
      },
      (error) => {
        console.error(error);
      }
    );
  }

  deleteRecipe(id: number) {
    this.recipesService.deleteRecipe(id).subscribe(
      () => {
        this.router.navigate(["/recipes"])
      }
    )
  }
}
