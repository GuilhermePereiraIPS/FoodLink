import { Component, OnInit } from '@angular/core';

import { User, AccountsService } from '../services/accounts.service';
import { HttpClient } from '@angular/common/http';
import { Router, ActivatedRoute } from '@angular/router';
import { Recipe } from '../services/recipes.service';
import { RecipeBook } from '../services/recipe-books.service';


@Component({
  selector: 'app-profile-view',
  standalone: false,
  templateUrl: './profile-view.component.html',
  styleUrl: './profile-view.component.css'
})
export class ProfileViewComponent {
  
  private username! : string
  public user!: User
  public recipes: Recipe[] = []; // Array to hold user's recipes
  public recipeBooks: RecipeBook[] = []; // Array to hold user's recipe books

  constructor(private http: HttpClient, private accountsService: AccountsService, private router: Router, private route: ActivatedRoute) { }
  
  ngOnInit() {
    this.route.params.subscribe(params => {
      this.username = params['username']; 
    });

    this.getUser(this.username);
    
  }

  getUser(username: string) {
    this.accountsService.getUserInfo(username).subscribe(
      (result) => {
        console.log('User fetched:', result);
        this.user = result;
        this.getUserRecipes(this.user.id)
      },
      (error) => {
        console.error(error);
      }
    );
  }

  getUserRecipes(userId: string) {
    console.log("yoo")
    this.accountsService.getUserRecipes(userId).subscribe(

      (recipes) => {
        console.log('Recipes fetched for user:', recipes);
        this.recipes = recipes;
      },
      (error) => {
        console.error('Error fetching recipes:', error);
        this.recipes = []; 
      }
    );
  }
  
}
