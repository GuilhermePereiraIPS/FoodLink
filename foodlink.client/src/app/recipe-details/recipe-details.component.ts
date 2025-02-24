import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Recipe, RecipesService } from '../services/recipes.service';
import { CommentsService, Comment } from '../services/comments.service'; // 🔥 Importação do serviço de comentários

@Component({
  selector: 'app-recipe-details',
  standalone: false,
  templateUrl: './recipe-details.component.html',
  styleUrl: './recipe-details.component.css'
})
export class RecipeDetailsComponent implements OnInit {
  public recipe: Recipe | undefined;
  public id: number | undefined;
  public comments: Comment[] = []; // 🔥 Lista de comentários
  public newComment: string = ''; // 🔥 Texto do novo comentário

  constructor(
    private route: ActivatedRoute,
    private service: RecipesService,
    private commentsService: CommentsService // 🔥 Injeção do serviço de comentários
  ) { }

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      this.id = +params['id']; // 🔥 Convertendo para número
      this.getRecipe();
      this.getComments(); // 🔥 Busca os comentários ao carregar a página
    });
  }

  // 🔹 Busca os detalhes da receita
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

  // 🔹 Adiciona um novo comentário
  addComment(): void {
    if (!this.id || !this.newComment.trim()) return;

    const newCommentData: Comment = {
      commentText: this.newComment,
      recipeId: this.id,
      userId: 1 //Usa sempre o mesmo Id até ter o user
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
}
