import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { RecipeListComponent } from './recipe-list/recipe-list.component'
import { RecipeDetailsComponent } from './recipe-details/recipe-details.component'
import { RecipeCreateComponent } from './recipe-create/recipe-create.component'
import { RecipeEditComponent } from './recipe-edit/recipe-edit.component';
import { ProfileEditComponent } from './profile-edit/profile-edit.component';
import { ProfileViewComponent } from './profile-view/profile-view.component';
import { BooksComponent } from './books/books.component';
import { AuthGuard } from './api-authorization/authorize.guard';
import { RecipeBookDetailsComponent } from './recipe-book-details/recipe-book-details.component';


const routes: Routes = [

  { path: 'profile/edit', component: ProfileEditComponent, canActivate: [AuthGuard] },
  { path: 'profile/:username', component: ProfileViewComponent, canActivate: [AuthGuard] },
  { path: 'recipes', component: RecipeListComponent, canActivate: [AuthGuard] },
  { path: 'recipes/create', component: RecipeCreateComponent, canActivate: [AuthGuard] },
  { path: 'recipes/:id', component: RecipeDetailsComponent, canActivate: [AuthGuard] },
  { path: 'recipes/edit/:id', component: RecipeEditComponent, canActivate: [AuthGuard] },
  { path: 'books', component: BooksComponent, canActivate: [AuthGuard] },
  { path: 'recipe-books/:id', component: RecipeBookDetailsComponent, canActivate: [AuthGuard] },


  { path: '', redirectTo: 'signin', pathMatch: 'full' },
  //{ path: '**', redirectTo: 'signin' },
  //{ path: '/recipes', component: RecipeListComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
