import { Component, Input, OnInit } from '@angular/core';
import { AccountsService, User } from '../services/accounts.service';
import { RecipeBooksService } from '../services/recipe-books.service';
import { RecipeBookDetailsComponent } from '../recipe-book-details/recipe-book-details.component'
import { filter } from 'rxjs/operators';

@Component({
  selector: 'app-recipe-card',
  templateUrl: './recipe-card.component.html',
  styleUrl: './recipe-card.component.css'
})
export class RecipeCardComponent implements OnInit {
  @Input() id: number = 0
  @Input() title: string = '';
  @Input() userId: string = '';
  @Input() date: string | null = null;
  @Input() imageUrl: string | undefined = undefined ;
  @Input() description: string = '';
  @Input() recipeBookId!: number;
  @Input() onClickRemove!: (recipeBookId: number, recipeId: number) => void;

  username!: string

  constructor(private accountsService: AccountsService, private recipeBooksService: RecipeBooksService) { }

  ngOnInit(): void {
    if (this.userId) { 
      this.getUser(this.userId); 
    }
  }

  getUser(id: string) {
    this.accountsService.getUserInfo(undefined, id).subscribe(
      (result: User) => {
        console.log('User fetched:', result);
        this.username = result.username; 
      },
      (error) => {
        console.error('Error fetching user:', error);
        this.username = 'Unknown User'; 
      }
    );
  }

  onRemoveClick() {
    if (this.onClickRemove) {
      this.onClickRemove(this.recipeBookId, this.id);  
    }
  }
}
