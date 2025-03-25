import { Component } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router'
  ;
import { Recipe, RecipesService } from '../services/recipes.service'
import { User, AccountsService } from '../services/accounts.service';

@Component({
  selector: 'app-recipe-create',
  standalone: false,
  
  templateUrl: './recipe-create.component.html',
  styleUrl: './recipe-create.component.css'
})
export class RecipeCreateComponent {

  currentUser: User | null = null;

  constructor(private recipesService: RecipesService, private router: Router, private accountsService: AccountsService) { }

  ngOnInit() {
    this.accountsService.currentUser$.subscribe(
      (user) => {
        this.currentUser = user;
      },
      (error) => {
        console.error('Error fetching current user:', error);
      }
    );
  }

  onSubmit(form: NgForm) {
    if (form.valid) {
      const recipe = {
        ...form.value, // Spread form values
        createDate: new Date(), // Add createDate
        userId: this.currentUser?.id // Add userId from currentUser
      } as Recipe;

      this.recipesService.createRecipe(recipe).subscribe(res => {
        console.log('Recipe created successfully!');
        this.router.navigateByUrl(`recipes/${res.id}`);
      });
    }
  }
}
