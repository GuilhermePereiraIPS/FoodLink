import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router'; // Add Router for navigation
import { Recipe, RecipesService } from '../services/recipes.service';
import { CommentsService, Comment } from '../services/comments.service';
import { AccountsService, User } from '../services/accounts.service';
import { RecipeBook, RecipeBooksService } from '../services/recipe-books.service';
import { RecipeToRBService, RecipeToRB } from '../services/recipe-to-rb.service';

@Component({
  selector: 'app-recipe-details',
  standalone: false,
  templateUrl: './recipe-details.component.html',
  styleUrls: ['./recipe-details.component.css']
})
export class RecipeDetailsComponent implements OnInit {
  public currentUser: User | null = null;
  public user: User | null = null;
  public recipeId: number | undefined;
  public recipe!: Recipe;

  public comments: Comment[] = [];
  public newComment: string = '';
  public userNames: Map<string, string> = new Map();

  public userRecipeBooks: RecipeBook[] = [];
  public selectedRecipeBook: number | null = null;
  public showRecipeBookList = false;
  public showModal = false;
  private commentToDelete: number | undefined;

  constructor(
    private route: ActivatedRoute,
    private router: Router, // Add Router
    private recipeService: RecipesService,
    private commentsService: CommentsService,
    private accountsService: AccountsService,
    private recipeBooksService: RecipeBooksService,
    private recipeToRBService: RecipeToRBService
  ) { }

  ngOnInit(): void {
    this.accountsService.currentUser$.subscribe(
      (user) => {
        console.log('Current user updated:', user);
        this.currentUser = user;
        if (this.currentUser) this.getUserRecipeBooks(this.currentUser.id);
      },
      (error) => {
        console.error('Error in current user subscription:', error);
      }
    );

    this.route.params.subscribe(params => {
      this.recipeId = +params['id'];
      this.getRecipe();
      this.getComments();
    });
  }

  scrollToRecipe(event: Event): void {
    event.preventDefault(); // Prevent Angular routing from interfering
    const element = document.getElementById('recipe-section');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  }

  getRecipe(): void {
    if (this.recipeId === undefined) return;

    this.recipeService.getRecipe(this.recipeId).subscribe(
      (result) => {
        this.recipe = result;
        if (this.recipe.userId) {
          this.getUser(this.recipe.userId);
        } else {
          console.warn('Recipe has no userId:', this.recipe);
        }
      },
      (error) => {
        console.error('Error fetching recipe:', error);
      }
    );
  }

  getUser(id: string): void {
    this.accountsService.getUserInfo(undefined, id).subscribe(
      (result: User) => {
        console.log('User fetched:', result);
        this.user = result;
      },
      (error) => {
        console.error('Error fetching user:', error);
        this.user = null;
      }
    );
  }

  getComments(): void {
    if (this.recipeId === undefined) return;

    this.commentsService.getComments(this.recipeId).subscribe(
      (comments) => {
        this.comments = comments;
        this.loadUserNames();
      },
      (error) => {
        console.log('Error fetching comments:', error.status, error.message, error);
      }
    );
  }

  loadUserNames(): void {
    this.comments.forEach(comment => {
      if (comment.userId && !this.userNames.has(comment.userId)) {
        this.accountsService.getUserById(comment.userId).subscribe(
          username => {
            this.userNames.set(comment.userId, username);
          },
          error => {
            console.error(`Error fetching username for userId: ${comment.userId}`, error);
            this.userNames.set(comment.userId, 'Unknown User');
          }
        );
      }
    });
  }

  getUserName(userId: string | undefined): string {
    if (!userId) return 'Unknown User';

    const cachedUsername = this.userNames.get(userId);
    if (cachedUsername) return cachedUsername;

    this.accountsService.getUserById(userId).subscribe(
      username => {
        this.userNames.set(userId, username);
      },
      error => {
        console.error(`Error fetching username for userId: ${userId}`, error);
        this.userNames.set(userId, 'Unknown User');
      }
    );

    return 'Loading...';
  }

  addComment(): void {
    if (!this.recipeId || !this.newComment.trim() || !this.currentUser?.id) return;

    const newCommentData: Comment = {
      commentText: this.newComment,
      recipeId: this.recipeId,
      userId: this.currentUser.id
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

  openDeleteModal(commentId: number): void {
    this.commentToDelete = commentId;
    this.showModal = true;
  }

  confirmDelete(): void {
    if (!this.commentToDelete) return;

    this.commentsService.deleteComment(this.commentToDelete).subscribe(
      () => {
        this.comments = this.comments.filter(comment => comment.id !== this.commentToDelete);
        console.log(`Comment with ID ${this.commentToDelete} deleted successfully.`);
        this.showModal = false;
      },
      (error) => {
        console.error(`Error deleting comment with ID ${this.commentToDelete}:`, error);
      }
    );
  }

  cancelDelete(): void {
    this.showModal = false;
    this.commentToDelete = undefined;
  }

  canDeleteComment(commentId: number | undefined): boolean {
    if (!commentId) return false;

    if (this.currentUser?.role === "Admin") return true;

    const comment = this.comments.find(c => c.id === commentId);
    return (comment?.userId === this.currentUser?.id || this.currentUser?.id == this.recipe.userId) || false; // if comment user id is same as current user, can delete
  }

  deleteComment(commentId: number | undefined): void {
    if (!commentId) return;

    const confirmDelete = confirm('Are you sure you want to delete this comment?');
    if (!confirmDelete) return;

    this.commentsService.deleteComment(commentId).subscribe(
      () => {
        this.comments = this.comments.filter(comment => comment.id !== commentId);
        console.log(`Comment with ID ${commentId} deleted successfully.`);
      },
      (error) => {
        console.error(`Error deleting comment with ID ${commentId}:`, error);
      }
    );
  }

  getUserRecipeBooks(userId: string): void {
    this.recipeBooksService.getUserRecipeBooks(userId).subscribe(
      (books) => {
        this.userRecipeBooks = books;
      },
      (error) => {
        console.error('Error loading user recipe books:', error);
      }
    );
  }

  toggleRecipeBookList(): void {
    this.showRecipeBookList = !this.showRecipeBookList;
  }

  addToRecipeBook(): void {
    if (!this.recipeId || !this.selectedRecipeBook) {
      alert('Please select a Recipe Book.');
      return;
    }

    const newAssociation: RecipeToRB = {
      idRecipe: this.recipeId,
      idRecipeBook: this.selectedRecipeBook
    };

    this.recipeToRBService.addRecipeToBook(newAssociation).subscribe(
      () => {
        alert('Recipe added to Recipe Book!');
        this.showRecipeBookList = false;
      },
      error => console.log(error)
    );
  }

  // Permission checks
  canDeleteRecipe(): boolean {
    if (!this.currentUser) return false;
    return this.currentUser &&
      (this.currentUser.id === this.recipe.userId || this.currentUser.role === 'Admin');
  }

  canEditRecipe(): boolean {
    if (!this.currentUser) return false;
    return this.currentUser && this.currentUser.id === this.recipe.userId;
  }

  // Delete recipe action
  deleteRecipe(): void {
    if (!this.recipeId || !this.canDeleteRecipe()) return;

    if (confirm('Are you sure you want to delete this recipe?')) {
      this.recipeService.deleteRecipe(this.recipeId).subscribe(
        () => {
          console.log(`Recipe with ID ${this.recipeId} deleted successfully.`);
          this.router.navigate(['/recipes']); // Redirect after deletion
        },
        (error) => {
          console.error('Error deleting recipe:', error);
        }
      );
    }
  }

  // Edit recipe action (placeholder - redirect to edit page)
  editRecipe(): void {
    if (!this.recipeId || !this.canEditRecipe()) return;
    this.router.navigate(['/recipes/edit', this.recipeId]); // Assuming an edit route exists
  }
}
