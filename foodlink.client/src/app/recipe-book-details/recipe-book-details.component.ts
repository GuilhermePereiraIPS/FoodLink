import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { RecipesService } from '../services/recipes.service';
import { RecipeBooksService } from '../services/recipe-books.service';

@Component({
  selector: 'app-recipe-book-details',
  templateUrl: './recipe-book-details.component.html',
  styleUrls: ['./recipe-book-details.component.css']
})
export class RecipeBookDetailsComponent implements OnInit {
  recipeBookId!: number;
  recipes: any[] = [];
  recipeBookTitle: string = '';

  constructor(
    private route: ActivatedRoute,
    private recipeBooksService: RecipeBooksService
  ) { }

  ngOnInit(): void {
    this.recipeBookId = Number(this.route.snapshot.paramMap.get('id'));

    this.getRecipeBookDetails();
    this.getRecipes();
  }

  // Buscar os detalhes do RecipeBook
  getRecipeBookDetails(): void {
    this.recipeBooksService.getRecipeBookById(this.recipeBookId).subscribe(
      (book) => {
        this.recipeBookTitle = book.recipeBookTitle;
      },
      (error) => {
        console.error('Error loading RecipeBook details:', error);
      }
    );
  }

  // Buscar receitas associadas ao RecipeBook
  getRecipes(): void {
    this.recipeBooksService.getRecipesByRecipeBook(this.recipeBookId).subscribe(
      (recipes) => {
        this.recipes = recipes;
      },
      (error) => {
        console.error('Error loading recipes:', error);
      }
    );
  }

  removeRecipe(idRecipe: number) {
    if (!this.recipeBookId) return;

    const confirmDelete = confirm("Are you sure you want to remove this recipe from the book?");
    if (!confirmDelete) return;

    this.recipeBooksService.removeRecipeFromBook(this.recipeBookId, idRecipe).subscribe(
      () => {
       
        this.recipes = this.recipes.filter(recipe => recipe.id !== idRecipe);
      },
      (error) => {
        console.error("Error removing recipe:", error);
      }
    );
  }
}
