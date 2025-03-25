import { Component, Input, OnInit } from '@angular/core';
import { AccountsService, User } from '../services/accounts.service';

@Component({
  selector: 'app-recipe-card',
  templateUrl: './recipe-card.component.html',
  styleUrl: './recipe-card.component.css'
})
export class RecipeCardComponent implements OnInit {
  @Input() title: string = '';
  @Input() userId: string = '';
  @Input() date: string | null = null;
  @Input() imageUrl: string = '';
  @Input() description: string = '';

  username!: string

  constructor(private accountsService: AccountsService) { }

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
}
