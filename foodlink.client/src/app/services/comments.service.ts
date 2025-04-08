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

  //Get comments of a recipe
  getComments(recipeId: number): Observable<Comment[]> {
    return this.http.get<Comment[]>(`${this.apiUrl}/comments/${recipeId}`);
  }

  //Get comment
  getComment(commentId: number): Observable<Comment> {
    return this.http.get<Comment>(`${this.apiUrl}/${commentId}`);
  }

  //Add a new comment
  addComment(comment: Comment): Observable<Comment> {
    return this.http.post<Comment>(this.apiUrl, comment);
  }

  //Delete a comment
  deleteComment(commentId: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${commentId}`);
  }
}
