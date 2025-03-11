import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Recipe, RecipesService } from '../services/recipes.service';
import { CommentsService, Comment } from '../services/comments.service';
import { AccountsService, User } from '../services/accounts.service';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-recipe-details',
  standalone: false,
  templateUrl: './recipe-details.component.html',
  styleUrl: './recipe-details.component.css'
})
export class RecipeDetailsComponent implements OnInit {
  public recipe: Recipe | undefined;
  public id: number | undefined;
  public comments: Comment[] = [];
  public newComment: string = '';
  public currentUserId: string = '';
  public userNames: Map<string, string> = new Map();


  constructor(
    private route: ActivatedRoute,
    private service: RecipesService,
    private commentsService: CommentsService,
    private accountsService: AccountsService
  ) { }

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      this.id = +params['id']; // Convertendo para número
      this.getRecipe();
      this.getComments();
      this.getUserId();
    });
  }

  //Busca os detalhes da receita
  getRecipe(): void {
    if (this.id === undefined) return;

    this.service.getRecipe(this.id).subscribe(
      (result) => {
        this.recipe = result;
      },
      (error) => {
        console.log(error);
      }
    );
  }

  //Busca os comentários da receita
  getComments(): void {
    if (this.id === undefined) return;

    this.commentsService.getComments(this.id).subscribe(
      (comments) => {
        this.comments = comments;
        this.loadUserNames();
      },
      (error) => {
        console.log(error);
      }
    );
  }

  // Obtém o nome do usuário e armazena no mapa para evitar chamadas repetidas
  loadUserNames(): void {
    this.comments.forEach(async (comment) => {
      if (comment.userId && !this.userNames.has(comment.userId)) {
        const username = await this.fetchUserName(comment.userId);
        this.userNames.set(comment.userId, username);
      }
    });
  }

  async fetchUserName(userId: string | undefined): Promise<string> {
    if (!userId) {
      return "Unknown User";
    }

    if (this.userNames.has(userId)) {
      return this.userNames.get(userId)!; 
    }

    try {
      const username = await this.accountsService.getUserById(userId).toPromise() ?? "Unknown User"; // 🔥 Usa "Unknown User" se retornar undefined
      this.userNames.set(userId, username);
      return username;
    } catch (error) {
      console.log(`Error fetching username for userId: ${userId}`, error);
      return "Unknown User";
    }
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

 
  getUserName(userId: string): string {
    return this.userNames.get(userId) || "Loading...";
  }

  //Adiciona um novo comentário
  addComment(): void {
    if (!this.id || !this.newComment.trim() || !this.currentUserId) return;

    const newCommentData: Comment = {
      commentText: this.newComment,
      recipeId: this.id,
      userId: this.currentUserId
    };

    this.commentsService.addComment(newCommentData).subscribe(
      (comment) => {
        this.comments.push(comment);
        this.newComment = '';
      },
      (error) => {
        console.log(error);
      }
    );
  }

  // Delete a um comentário
  deleteComment(commentId: number | undefined): void {
    if (!commentId) return; //Evita erro caso o ID seja indefinido

    const confirmDelete = confirm('Are you sure you want to delete this comment?');
    if (!confirmDelete) return;

    this.commentsService.deleteComment(commentId).subscribe(
      () => {
        this.comments = this.comments.filter(comment => comment.idComment !== commentId);
        console.log(`Comment with ID ${commentId} deleted successfully.`);
      },
      (error) => {
        console.error(`Error deleting comment with ID ${commentId}:`, error);
      }
    );
  }

  public showModal = false;
  private commentToDelete: number | undefined;

  // Exibe o modal antes
  openDeleteModal(commentId: number): void {
    this.commentToDelete = commentId;
    this.showModal = true;
  }

  //Confirma
  confirmDelete(): void {
    if (!this.commentToDelete) return;

    this.commentsService.deleteComment(this.commentToDelete).subscribe(
      () => {
        this.comments = this.comments.filter(comment => comment.idComment !== this.commentToDelete);
        console.log(`Comment with ID ${this.commentToDelete} deleted successfully.`);
        this.showModal = false;
      },
      (error) => {
        console.error(`Error deleting comment with ID ${this.commentToDelete}:`, error);
      }
    );
  }

  //Cancela
  cancelDelete(): void {
    this.showModal = false;
    this.commentToDelete = undefined;
  }
}
