import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Recipe, RecipesService } from '../services/recipes.service';

@Component({
  selector: 'app-recipe-edit',
  templateUrl: './recipe-edit.component.html',
  styleUrls: ['./recipe-edit.component.css']
})
export class RecipeEditComponent implements OnInit {
  public recipe: Recipe | undefined;
  private id: number | undefined;

  constructor(
    private route: ActivatedRoute,
    private recipesService: RecipesService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      this.id = +params['id'];
      this.loadRecipe();
    });
  }

  loadRecipe(): void {
    if (this.id === undefined) return;

    this.recipesService.getRecipe(this.id).subscribe(
      (recipe) => {
        this.recipe = recipe;
      },
      (error) => {
        console.error('Error loading recipe:', error);
      }
    );
  }

  onSubmit(): void {
    if (!this.id || !this.recipe || this.isFormInvalid()) return;

    this.recipesService.updateRecipe(this.id, this.recipe).subscribe(
      () => {
        console.log('Recipe updated successfully');
        this.router.navigate(['/recipes']); // Redireciona para a lista de receitas
      },
      (error) => {
        console.error('Error updating recipe:', error);
      }
    );
  }

  // 🔥 Verifica se um campo está vazio
  isInvalid(field: string | undefined): boolean {
    return !field || field.trim() === '';
  }

  // 🔥 Verifica se o formulário é inválido
  isFormInvalid(): boolean {
    return !this.recipe || this.isInvalid(this.recipe.title) ||
      this.isInvalid(this.recipe.description) ||
      this.isInvalid(this.recipe.ingredients) ||
      this.isInvalid(this.recipe.instructions);
  }
}
