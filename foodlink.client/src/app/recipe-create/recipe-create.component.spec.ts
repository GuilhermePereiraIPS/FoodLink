import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RecipeCreateComponent } from './recipe-create.component';
import { RecipesService } from '../services/recipes.service';
import { Router } from '@angular/router';
import { FormsModule, NgForm } from '@angular/forms';
import { of } from 'rxjs';

describe('RecipeCreateComponent', () => {
  let component: RecipeCreateComponent;
  let fixture: ComponentFixture<RecipeCreateComponent>;

  const mockRecipesService = {
    createRecipe: jasmine.createSpy().and.returnValue(of({ id: 123 }))
  };

  const mockRouter = {
    navigateByUrl: jasmine.createSpy()
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [RecipeCreateComponent],
      imports: [FormsModule],
      providers: [
        { provide: RecipesService, useValue: mockRecipesService },
        { provide: Router, useValue: mockRouter }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(RecipeCreateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should call createRecipe and navigate on valid form submit', () => {
    const mockForm = {
      valid: true,
      value: {
        title: 'Test Recipe',
        description: 'Test desc',
        ingredients: 'Test ingredients',
        instructions: 'Test instructions'
      }
    } as NgForm;

    component.onSubmit(mockForm);

    expect(mockRecipesService.createRecipe).toHaveBeenCalled();
    expect(mockRouter.navigateByUrl).toHaveBeenCalledWith('recipes/123');
  });

  it('should not call createRecipe if form is invalid', () => {
    const invalidForm = {
      valid: false,
      value: {}
    } as NgForm;

    component.onSubmit(invalidForm);

    expect(mockRecipesService.createRecipe).not.toHaveBeenCalled();
    expect(mockRouter.navigateByUrl).not.toHaveBeenCalled();
  });
});
