import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { Recipe, RecipesService } from '../services/recipes.service'


@Component({
  selector: 'app-recipe-details',
  standalone: false,
  
  templateUrl: './recipe-details.component.html',
  styleUrl: './recipe-details.component.css'
})
export class RecipeDetailsComponent implements OnInit {
  public recipe: Recipe | undefined;
  public id: number | undefined;

  constructor(private route: ActivatedRoute, private service: RecipesService) { }

  ngOnInit(): void {
    //this.id = this.route.snapshot.params['id'];
    this.route.params.subscribe(params => {
      this.id = params['id']; // Access the 'id' parameter from the URL
      this.getRecipe();
    });
    
  }

  getRecipe(): void {
    if (this.id === undefined) return;

    this.service.getRecipe(this.id).subscribe(
      (result) => {
        this.recipe = result;
      },
      (error) => {
        console.log(error);
      }
    );
  }
  
}
