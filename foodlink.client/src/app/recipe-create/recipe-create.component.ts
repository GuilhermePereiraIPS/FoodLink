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
      this.recipesService.createRecipe(form.value as Recipe).subscribe(res => {
        console.log('Recipe created successfully!');
        this.router.navigateByUrl(`recipes/${res.id}`);
      });
    }
  }
}
