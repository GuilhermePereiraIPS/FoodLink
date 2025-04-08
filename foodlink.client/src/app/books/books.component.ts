import { Component } from '@angular/core';
import { RecipeBooksService, RecipeBook } from '../services/recipe-books.service';
import { AccountsService } from '../services/accounts.service';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-books',
  templateUrl: './books.component.html',
  styleUrl: './books.component.css'
})
export class BooksComponent {
  public newRecipeBookTitle: string = '';
  public currentUserId: string | undefined;
  public showModalBackdrop: boolean = false;
  public recipeBooks: RecipeBook[] = [];
  public errorMessage: string = '';
  public activeMenu: number | null = null;

  public isEditing: boolean = false;
  public editingBookId: number | null = null;
  public editedTitle: string = '';
  public showDeleteModal: boolean = false;
  private bookToDeleteId: number | null = null;



  constructor(private recipeBooksService: RecipeBooksService, private accountsService: AccountsService, private router: Router) {
    this.getUserId();
    
  }

  getUserId() {
    this.accountsService.getCurrentUser().subscribe(
      (result) => {
        var user = result;
        this.currentUserId = user.id;
        this.loadRecipeBooks();
      },
      (error) => {
        console.error(error);
      }
    );
  }

  loadRecipeBooks(): void {
    if (!this.currentUserId) return;

    this.recipeBooksService.getUserRecipeBooks(this.currentUserId).subscribe(
      (books) => {
        this.recipeBooks = books;
      },
      (error) => {
        console.error('Error fetching Recipe Books:', error);
      }
    );
  }

  // Criar um Recipe Book
  createRecipeBook(): void {

    if (!this.currentUserId) return;

    const newBook: RecipeBook = {
      recipeBookTitle: this.newRecipeBookTitle,
      userId: this.currentUserId
    };

    this.recipeBooksService.createRecipeBook(newBook).subscribe(
      (createdBook) => {
        console.log('Recipe Book Created:', createdBook);
        this.newRecipeBookTitle = '';
        this.showModalBackdrop = false;
        this.errorMessage = '';
        this.loadRecipeBooks();
      },
      (error) => { console.log('Error creating Recipe Book:', error); }
    );
  }

  // Alternar a exibição do formulário
  toggleModalBackdrop(): void {
    this.showModalBackdrop = !this.showModalBackdrop;
    this.errorMessage = '';
  }

  startAdding(): void {
    this.isEditing = false;
    this.toggleModalBackdrop();
  }

  startEditing(book: RecipeBook): void {
    this.editingBookId = book.id!;
    this.isEditing = true;
    this.editedTitle = book.recipeBookTitle;

    this.toggleModalBackdrop();
  }

  saveEditedBook(): void {
    if (this.editingBookId === null) return;

    if (!this.currentUserId) return;

    const updatedBook: RecipeBook = {
      id: this.editingBookId,
      recipeBookTitle: this.editedTitle,
      userId: this.currentUserId
    };

    this.recipeBooksService.updateRecipeBook(updatedBook).subscribe(
      (editedBook) => {
        console.log('Recipe Book Edited:', editedBook);
        this.editingBookId = null; 
        
        // Atualizar a lista após a edição
        this.loadRecipeBooks();
        this.toggleModalBackdrop();
      },
      (error) => {
        console.error('Error updating Recipe Book:', error);
      }
    );

    
  }



  deleteBook(bookId: number): void {
    if (!confirm('Are you sure you want to delete this Recipe Book?')) return;

    this.recipeBooksService.deleteRecipeBook(bookId).subscribe(
      () => {
        this.recipeBooks = this.recipeBooks.filter(book => book.id !== bookId);
      },
      (error) => {
        console.error('Error deleting Recipe Book:', error);
      }
    );
  }

}
