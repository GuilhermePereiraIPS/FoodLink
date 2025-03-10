import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Recipe, RecipesService } from '../services/recipes.service';
import { CommentsService, Comment } from '../services/comments.service';
import { AccountsService, User } from '../services/accounts.service';

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
  public currentUser: User | null = null;

  constructor(
    private route: ActivatedRoute,
    private service: RecipesService,
    private commentsService: CommentsService,
    private accountService: AccountsService
  ) { }

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      this.id = +params['id']; // Convertendo para número
      this.getRecipe();
      this.getComments(); // Busca os comentários ao carregar a página
      this.loadUserInfo();
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
      },
      (error) => {
        console.log(error);
      }
    );
  }

  loadUserInfo(): void {
    this.accountService.getUserInfo(1).subscribe(
      (user) => {
        if (user.id) {
          this.currentUser = user;
        }
      },
      (error) => {
        console.error("Error fetching user data:", error);
      }
    );
  }

  //Adiciona um novo comentário
  addComment(): void {
    if (!this.id || !this.newComment.trim()) return;

    const newCommentData: Comment = {
      commentText: this.newComment,
      recipeId: this.id,
      userId: this.currentUser?.id,
      username: this.currentUser?.username

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
