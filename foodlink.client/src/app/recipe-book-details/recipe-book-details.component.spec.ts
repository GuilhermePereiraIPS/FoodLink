import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RecipeBookDetailsComponent } from './recipe-book-details.component';
import { RouterTestingModule } from '@angular/router/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';
import { RecipeBooksService } from '../services/recipe-books.service';

describe('RecipeBookDetailsComponent', () => {
  let component: RecipeBookDetailsComponent;
  let fixture: ComponentFixture<RecipeBookDetailsComponent>;
  let mockRecipeBooksService: any;

  beforeEach(async () => {
    // Mock do ActivatedRoute para simular o ID
    const mockActivatedRoute = {
      snapshot: {
        paramMap: {
          get: () => '1'
        }
      }
    };

    // Mock do RecipeBooksService
    mockRecipeBooksService = {
      getRecipeBookById: jasmine.createSpy().and.returnValue(of({ recipeBookTitle: 'Test Book' })),
      getRecipesByRecipeBook: jasmine.createSpy().and.returnValue(of([
        { id: 1, title: 'Recipe 1' }
      ])),
      removeRecipeFromBook: jasmine.createSpy().and.returnValue(of({}))
    };

    await TestBed.configureTestingModule({
      declarations: [RecipeBookDetailsComponent],
      imports: [RouterTestingModule],
      providers: [
        { provide: ActivatedRoute, useValue: mockActivatedRoute },
        { provide: RecipeBooksService, useValue: mockRecipeBooksService }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(RecipeBookDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should fetch recipe book title on init', () => {
    expect(mockRecipeBooksService.getRecipeBookById).toHaveBeenCalledWith(1);
    expect(component.recipeBookTitle).toBe('Test Book');
  });

  it('should fetch recipes on init', () => {
    expect(mockRecipeBooksService.getRecipesByRecipeBook).toHaveBeenCalledWith(1);
    expect(component.recipes.length).toBe(1);
  });

  it('should remove recipe from list', () => {
    spyOn(window, 'confirm').and.returnValue(true);

    component.removeRecipe(1);

    expect(mockRecipeBooksService.removeRecipeFromBook).toHaveBeenCalledWith(1, 1);
  });
});
