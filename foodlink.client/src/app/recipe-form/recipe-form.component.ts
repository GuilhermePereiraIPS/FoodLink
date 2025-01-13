import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { RecipeService, Recipe } from '../recipe.service';
import { catchError } from 'rxjs/operators';
import { of } from 'rxjs';

@Component({
  selector: 'app-recipe-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './recipe-form.component.html',
  styleUrls: ['./recipe-form.component.css'],
})
export class RecipeFormComponent {
  recipeForm: FormGroup;

  constructor(private fb: FormBuilder, private recipeService: RecipeService) {
    this.recipeForm = this.fb.group({
      name: ['', [Validators.required, Validators.maxLength(100)]],
      description: ['', [Validators.required, Validators.maxLength(500)]],
      stepByStep: ['', Validators.required],
      ingredients: ['', Validators.required],
    });
  }

  onSubmit() {
    if (this.recipeForm.valid) {
      console.log(this.recipeForm.value);
      const newRecipe: Recipe = this.recipeForm.value;
      this.recipeService.createRecipe(newRecipe).pipe(
        catchError((error) => {
          console.error('Error creating recipe:', error);
          alert('Failed to create recipe. Please check your inputs or try again.');
          return of(null); // Retorna um valor vazio para continuar o fluxo
        })
      ).subscribe((response) => {
        if (response) {
          alert('Recipe created successfully!');
          this.recipeForm.reset();
        }
      });
    }
  }
}
