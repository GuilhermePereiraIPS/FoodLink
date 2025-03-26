import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RecipeListComponent } from './recipe-list.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { RecipesService } from '../services/recipes.service';
import { RouterTestingModule } from '@angular/router/testing';
import { of, throwError } from 'rxjs';
import { Router } from '@angular/router';
import { Recipe } from '../services/recipes.service'

describe('RecipeListComponent', () => {
  let component: RecipeListComponent;
  let fixture: ComponentFixture<RecipeListComponent>;
  let recipesService: jasmine.SpyObj<RecipesService>;
  let router: Router;

  const mockRecipes: Recipe[] = [
    {
      id: 1, title: 'Recipe 1', description: 'teste', ingredients: 'teste', instructions: 'teste', createDate:  new Date()
    },
    {
      id: 2, title: 'Recipe 2', description: '', ingredients: '', instructions: '', createDate: new Date()
    },
  ];

  beforeEach(async () => {
    const recipesServiceSpy = jasmine.createSpyObj('RecipesService', ['getRecipes', 'deleteRecipe']);

    await TestBed.configureTestingModule({
      declarations: [RecipeListComponent],
      imports: [HttpClientTestingModule, RouterTestingModule],
      providers: [{ provide: RecipesService, useValue: recipesServiceSpy }],
    }).compileComponents();

    fixture = TestBed.createComponent(RecipeListComponent);
    component = fixture.componentInstance;
    recipesService = TestBed.inject(RecipesService) as jasmine.SpyObj<RecipesService>;
    router = TestBed.inject(Router);
  });

  fit('should create', () => {
    expect(component).toBeTruthy();
  });

  fit('should fetch recipes on init', () => {
    recipesService.getRecipes.and.returnValue(of(mockRecipes));

    component.ngOnInit();

    expect(recipesService.getRecipes).toHaveBeenCalled();
    expect(component.recipes).toEqual(mockRecipes);
  });

  fit('should handle error when fetching recipes', () => {
    const consoleErrorSpy = spyOn(console, 'error');
    recipesService.getRecipes.and.returnValue(throwError(() => new Error('Error fetching recipes')));

    component.getRecipes();

    expect(recipesService.getRecipes).toHaveBeenCalled();
    expect(consoleErrorSpy).toHaveBeenCalledWith(jasmine.any(Error));
  });

  fit('should delete a recipe and navigate to recipes', () => {
    const navigateSpy = spyOn(router, 'navigate');
    recipesService.deleteRecipe.and.returnValue(of(mockRecipes[0]));

    component.deleteRecipe(1);

    expect(recipesService.deleteRecipe).toHaveBeenCalledWith(1);
    expect(navigateSpy).toHaveBeenCalledWith(['/recipes']);
  });
});
