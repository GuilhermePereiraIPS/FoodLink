import { Component } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router'
  ;
import { Recipe, RecipesService } from '../services/recipes.service'


@Component({
  selector: 'app-recipe-create',
  standalone: false,
  
  templateUrl: './recipe-create.component.html',
  styleUrl: './recipe-create.component.css'
})
export class RecipeCreateComponent {
  constructor(private recipesService: RecipesService, private router: Router) { }

  onSubmit(form: NgForm) {
    if (form.valid) {
      var recipe = form.value as Recipe;
      recipe.createDate = new Date();

      this.recipesService.createRecipe(recipe).subscribe(res => {
        console.log('Recipe created successfully!');
        this.router.navigateByUrl(`recipes/${res.id}`);
      });
    }
  }
}
