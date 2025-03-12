import { Component } from '@angular/core';
import { RecipeBooksService, RecipeBook } from '../services/recipe-books.service';
import { AccountsService } from '../services/accounts.service';

@Component({
  selector: 'app-books',
  templateUrl: './books.component.html',
  styleUrl: './books.component.css'
})
export class BooksComponent {
  public newRecipeBookTitle: string = '';
  public currentUserId: string | undefined;
  public showForm: boolean = false;

  constructor(private recipeBooksService: RecipeBooksService, private accountsService: AccountsService) {
    this.getUserId();
  }

  getUserId() {
    this.accountsService.getCurrentUser().subscribe(
      (result) => {
        console.log('User fetched:', result);
        var user = result;
        this.currentUserId = user.id;
        console.log(user)
      },
      (error) => {
        console.error(error);
      }
    );
  }

  // Criar um Recipe Book
  createRecipeBook(): void {
    if (!this.newRecipeBookTitle.trim() || !this.currentUserId) return;

    const newBook: RecipeBook = {
      recipeBookTitle: this.newRecipeBookTitle,
      userId: this.currentUserId
    };

    this.recipeBooksService.createRecipeBook(newBook).subscribe(
      (createdBook) => {
        console.log('Recipe Book Created:', createdBook);
        this.newRecipeBookTitle = '';
        this.showForm = false;
      },
      (error) => { console.log('Error creating Recipe Book:', error); }
    );
  }

  // Alternar a exibição do formulário
  toggleForm(): void {
    this.showForm = !this.showForm;
  }
}
