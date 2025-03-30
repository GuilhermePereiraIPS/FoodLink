import { ComponentFixture, TestBed } from '@angular/core/testing';
import { of } from 'rxjs';
import { RecipeDetailsComponent } from './recipe-details.component';
import { ActivatedRoute } from '@angular/router';
import { FormsModule } from '@angular/forms';

import { RecipesService } from '../services/recipes.service';
import { CommentsService } from '../services/comments.service';
import { AccountsService } from '../services/accounts.service';
import { RecipeBooksService } from '../services/recipe-books.service';
import { RecipeToRBService } from '../services/recipe-to-rb.service';

describe('RecipeDetailsComponent', () => {
  let component: RecipeDetailsComponent;
  let fixture: ComponentFixture<RecipeDetailsComponent>;

  const mockRecipe = {
    id: 1,
    title: 'Test Recipe',
    description: 'Delicious recipe',
    ingredients: 'Eggs, Flour, Milk',
    instructions: 'Mix and cook',
    createDate: new Date()
  };

  const mockComments = [
    { idComment: 1, commentText: 'Great!', recipeId: 1, userId: 'user1' }
  ];

  const mockUser = { id: 'user1' };
  const mockBooks = [{ idRecipeBook: 1, recipeBookTitle: 'Favorites' }];

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [RecipeDetailsComponent],
      imports: [FormsModule],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: { params: of({ id: 1 }) }
        },
        {
          provide: RecipesService,
          useValue: {
            getRecipe: jasmine.createSpy().and.returnValue(of(mockRecipe))
          }
        },
        {
          provide: CommentsService,
          useValue: {
            getComments: jasmine.createSpy().and.returnValue(of(mockComments)),
            addComment: jasmine.createSpy().and.returnValue(of(mockComments[0])),
            deleteComment: jasmine.createSpy().and.returnValue(of({}))
          }
        },
        {
          provide: AccountsService,
          useValue: {
            getCurrentUser: jasmine.createSpy().and.returnValue(of(mockUser)),
            getUserById: jasmine.createSpy().and.returnValue(of('user1'))
          }
        },
        {
          provide: RecipeBooksService,
          useValue: {
            getUserRecipeBooks: jasmine.createSpy().and.returnValue(of(mockBooks))
          }
        },
        {
          provide: RecipeToRBService,
          useValue: {
            addRecipeToBook: jasmine.createSpy().and.returnValue(of({}))
          }
        }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(RecipeDetailsComponent);
    component = fixture.componentInstance;

    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should load the recipe', () => {
    expect(component.recipe).toEqual(mockRecipe);
  });

  /*it('should load comments', () => {
    fixture = TestBed.createComponent(RecipeDetailsComponent);
    component = fixture.componentInstance;

    component.comments = [];

    fixture.detectChanges();

    expect(component.comments.length).toBe(1);
    expect(component.comments[0].commentText).toBe('Great!');
  });*/

  it('should add a new comment', () => {
    component.newComment = 'Awesome!';
    component.addComment();
    expect(component.comments.length).toBeGreaterThan(0);
  });

  it('should fetch user recipe books', () => {
    

    expect(component.userRecipeBooks.length).toBe(1);
    expect(component.userRecipeBooks[0].recipeBookTitle).toBe('Favorites');
  });

  it('should add recipe to selected recipe book', () => {
    component.selectedRecipeBook = 1;
    component.id = 1;
    component.addToRecipeBook();
    expect(component.showRecipeBookList).toBeFalse();
  });
});
