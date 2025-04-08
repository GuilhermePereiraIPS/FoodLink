import { Component } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router'
  ;
import { Recipe, RecipesService } from '../services/recipes.service'
import { User, AccountsService } from '../services/accounts.service';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-recipe-create',
  standalone: false,
  
  templateUrl: './recipe-create.component.html',
  styleUrl: './recipe-create.component.css'
})
export class RecipeCreateComponent {
  public user$: Observable<User | null>; 
  currentUser: User | null = null;

  constructor(private recipesService: RecipesService, private router: Router, private accountsService: AccountsService) {
    this.user$ = this.accountsService.currentUser$;
  }

  ngOnInit() {

    this.user$.subscribe(
      (user) => {
        this.currentUser = user;
      },
      (error) => {
        console.error('Error fetching current user:', error);
      }
    );
  }


  onSubmit(form: NgForm) {
    if (form.valid && this.currentUser?.id) {
      const recipe : Recipe = {
        ...form.value, // Spread form values
        userId: this.currentUser.id 
      };

      this.recipesService.createRecipe(recipe).subscribe(res => {
        console.log('Recipe created successfully!');
        this.router.navigateByUrl(`recipes/${res.id}`);
      });
    } else {
      console.warn('Form is invalid or user is not logged in.');
    }
  }

}
