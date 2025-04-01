import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { BooksComponent } from './books.component';
import { RecipeBooksService } from '../services/recipe-books.service';
import { AccountsService } from '../services/accounts.service';
import { FormsModule } from '@angular/forms';
import { of } from 'rxjs';

describe('BooksComponent', () => {
  let component: BooksComponent;
  let fixture: ComponentFixture<BooksComponent>;

  const mockBooks = [
    { idRecipeBook: 1, recipeBookTitle: 'Favorites', userId: 'user1' },
    { idRecipeBook: 2, recipeBookTitle: 'Desserts', userId: 'user1' }
  ];

  const mockRecipeBooksService = {
    getUserRecipeBooks: jasmine.createSpy().and.returnValue(of(mockBooks)),
    createRecipeBook: jasmine.createSpy().and.returnValue(of(mockBooks[0])),
    updateRecipeBook: jasmine.createSpy().and.returnValue(of({})),
    deleteRecipeBook: jasmine.createSpy().and.returnValue(of({}))
  };

  const mockAccountsService = {
    getCurrentUser: jasmine.createSpy().and.returnValue(of({ id: 'user1' }))
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [BooksComponent],
      imports: [FormsModule, RouterTestingModule],
      providers: [
        { provide: RecipeBooksService, useValue: mockRecipeBooksService },
        { provide: AccountsService, useValue: mockAccountsService }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(BooksComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should load user recipe books after fetching user', () => {
    expect(mockAccountsService.getCurrentUser).toHaveBeenCalled();
    expect(mockRecipeBooksService.getUserRecipeBooks).toHaveBeenCalledWith('user1');
    expect(component.recipeBooks.length).toBe(2);
  });

  it('should not create recipe book if title is empty', () => {
    component.newRecipeBookTitle = '   ';
    component.createRecipeBook();
    expect(component.errorMessage).toContain('Please enter a name');
    expect(mockRecipeBooksService.createRecipeBook).not.toHaveBeenCalled();
  });

  it('should create recipe book if title is valid', () => {
    component.currentUserId = 'user1';
    component.newRecipeBookTitle = 'New Book';
    component.createRecipeBook();
    expect(mockRecipeBooksService.createRecipeBook).toHaveBeenCalled();
  });

  it('should enter and cancel edit mode', () => {
    component.startEditing(mockBooks[0]);
    expect(component.editingBookId).toBe(1);
    expect(component.editedTitle).toBe('Favorites');

    component.cancelEditing();
    expect(component.editingBookId).toBeNull();
    expect(component.editedTitle).toBe('');
  });

  it('should save edited book', () => {
    component.currentUserId = 'user1';
    component.editingBookId = 1;
    component.editedTitle = 'Updated Book';

    component.saveEditedBook();
    expect(mockRecipeBooksService.updateRecipeBook).toHaveBeenCalledWith({
      idRecipeBook: 1,
      recipeBookTitle: 'Updated Book',
      userId: 'user1'
    });
  });

  it('should delete a recipe book', () => {
    spyOn(window, 'confirm').and.returnValue(true);
    component.deleteBook(1);
    expect(mockRecipeBooksService.deleteRecipeBook).toHaveBeenCalledWith(1);
  });
});
