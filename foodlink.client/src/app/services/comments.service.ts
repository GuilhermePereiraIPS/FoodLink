import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Comment {
  id?: number;
  commentText: string;
  recipeId: number;
  userId: string;
}

@Injectable({
  providedIn: 'root'
})
export class CommentsService {
  private apiUrl = 'api/comments';
  private userUrl = 'api/currentUser';

  constructor(private http: HttpClient) { }

  //Obter comentários de uma receita
  getComments(recipeId: number): Observable<Comment[]> {
    return this.http.get<Comment[]>(`${this.apiUrl}/${recipeId}`);
  }

  //Adicionar um novo comentário
  addComment(comment: Comment): Observable<Comment> {
    return this.http.post<Comment>(this.apiUrl, comment);
  }

  //Delete comentário
  deleteComment(commentId: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${commentId}`);
  }
}
