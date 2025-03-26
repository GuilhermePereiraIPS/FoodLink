import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { of, throwError } from 'rxjs';
import { RecipeEditComponent } from './recipe-edit.component';
import { ActivatedRoute, Router } from '@angular/router';
import { RecipesService } from '../services/recipes.service';

describe('RecipeEditComponent', () => {
  let component: RecipeEditComponent;
  let fixture: ComponentFixture<RecipeEditComponent>;
  let mockRecipesService: any;
  let mockRouter: any;
  let mockActivatedRoute: any;

  beforeEach(async () => {
    mockRecipesService = {
      getRecipe: jasmine.createSpy('getRecipe').and.returnValue(of({
        id: 1,
        title: 'Test',
        description: 'desc',
        ingredients: 'ing',
        instructions: 'inst',
        createDate: new Date()
      })),
      updateRecipe: jasmine.createSpy('updateRecipe').and.returnValue(of({}))
    };

    mockRouter = {
      navigate: jasmine.createSpy('navigate')
    };

    mockActivatedRoute = {
      params: of({ id: 1 })
    };

    await TestBed.configureTestingModule({
      declarations: [RecipeEditComponent],
      imports: [FormsModule],
      providers: [
        { provide: RecipesService, useValue: mockRecipesService },
        { provide: Router, useValue: mockRouter },
        { provide: ActivatedRoute, useValue: mockActivatedRoute }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(RecipeEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should load recipe on init', () => {
    expect(mockRecipesService.getRecipe).toHaveBeenCalledWith(1);
    expect(component.recipe).toBeTruthy();
  });

  it('should return true for invalid field', () => {
    expect(component.isInvalid('')).toBeTrue();
    expect(component.isInvalid('   ')).toBeTrue();
    expect(component.isInvalid(undefined)).toBeTrue();
    expect(component.isInvalid('valid')).toBeFalse();
  });

  it('should return true if form is invalid', () => {
    component.recipe = {
      id: 1,
      title: '',
      description: '',
      ingredients: '',
      instructions: '',
      createDate: new Date()
    };
    expect(component.isFormInvalid()).toBeTrue();
  });

  it('should not submit if form is invalid', () => {
    component.recipe = {
      id: 1,
      title: '',
      description: '',
      ingredients: '',
      instructions: '',
      createDate: new Date()
    };
    component['id'] = 1;
    component.onSubmit();
    expect(mockRecipesService.updateRecipe).not.toHaveBeenCalled();
  });

  it('should call updateRecipe and navigate if valid', () => {
    component.recipe = {
      id: 1,
      title: 'Title',
      description: 'desc',
      ingredients: 'ing',
      instructions: 'inst',
      createDate: new Date()
    };
    component['id'] = 1;
    component.onSubmit();
    expect(mockRecipesService.updateRecipe).toHaveBeenCalledWith(1, component.recipe);
    expect(mockRouter.navigate).toHaveBeenCalledWith(['/recipes']);
  });
});
