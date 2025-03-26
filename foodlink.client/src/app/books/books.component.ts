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
  public showForm: boolean = false;
  public recipeBooks: RecipeBook[] = [];
  public errorMessage: string = '';
  public activeMenu: number | null = null;
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
        console.log('User fetched:', result);
        var user = result;
        this.currentUserId = user.id;
        this.loadRecipeBooks();
        console.log(user)
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

    if (!this.newRecipeBookTitle.trim()) {
      this.errorMessage = '⚠️ Please enter a name for the Recipe Book!'; 
      return;
    }
    if (!this.currentUserId) return;

    const newBook: RecipeBook = {
      recipeBookTitle: this.newRecipeBookTitle,
      userId: this.currentUserId
    };

    this.recipeBooksService.createRecipeBook(newBook).subscribe(
      (createdBook) => {
        console.log('Recipe Book Created:', createdBook);
        this.newRecipeBookTitle = '';
        this.showForm = false;
        this.errorMessage = '';
        this.loadRecipeBooks();
      },
      (error) => { console.log('Error creating Recipe Book:', error); }
    );
  }

  // Alternar a exibição do formulário
  toggleForm(): void {
    this.showForm = !this.showForm;
    this.errorMessage = '';
  }

  toggleMenu(bookId: number): void {
    this.activeMenu = this.activeMenu === bookId ? null : bookId;
  }

  // Ativar modo de edição
  startEditing(book: RecipeBook): void {
    this.editingBookId = book.id!;
    this.editedTitle = book.recipeBookTitle;
    this.activeMenu = null; // Fecha o menu ao entrar no modo de edição
  }

  // 🔹 Salvar Edição
  saveEditedBook(): void {
    if (!this.editedTitle.trim() || this.editingBookId === null) return;

    if (!this.currentUserId) return;

    const updatedBook: RecipeBook = {
      id: this.editingBookId,
      recipeBookTitle: this.editedTitle,
      userId: this.currentUserId
    };

    this.recipeBooksService.updateRecipeBook(updatedBook).subscribe(
      () => {
        // Atualizar a lista após a edição
        this.loadRecipeBooks();
        this.editingBookId = null; // Sai do modo de edição
        this.editedTitle = ''; // Limpa o campo de edição
      },
      (error) => {
        console.error('Error updating Recipe Book:', error);
      }
    );
  }

  cancelEditing(): void {
    this.editingBookId = null;
    this.editedTitle = '';
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
