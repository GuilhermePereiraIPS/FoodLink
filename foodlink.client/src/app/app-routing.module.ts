import { NgModule } from '@angular/core';
import { ActivatedRouteSnapshot, RouterModule, Routes } from '@angular/router';
import { RecipeListComponent } from './recipe-list/recipe-list.component'
import { RecipeDetailsComponent } from './recipe-details/recipe-details.component'
import { RecipeCreateComponent } from './recipe-create/recipe-create.component'
import { RecipeEditComponent } from './recipe-edit/recipe-edit.component';
import { ProfileEditComponent } from './profile-edit/profile-edit.component';
import { ProfileViewComponent } from './profile-view/profile-view.component';
import { BooksComponent } from './books/books.component';
import { AuthGuard } from './api-authorization/authorize.guard';
import { RecipeBookDetailsComponent } from './recipe-book-details/recipe-book-details.component';
import { ActivateComponent } from './activate/activate.component';


const routes: Routes = [

  { path: 'profile/edit', component: ProfileEditComponent, canActivate: [AuthGuard], data: { sectionTitle: 'Edit Profile' } },
  { path: 'profile/:username', component: ProfileViewComponent, canActivate: [AuthGuard], data: { sectionTitle: 'User Profile' } },
  { path: 'recipes', component: RecipeListComponent, canActivate: [AuthGuard], data: { sectionTitle: 'Find a great recipe' } },
  { path: 'recipes/create', component: RecipeCreateComponent, canActivate: [AuthGuard], data: { sectionTitle: 'Create a Recipe' } },
  { path: 'recipes/:id', component: RecipeDetailsComponent, canActivate: [AuthGuard], data: { sectionTitle: 'Recipe' } },
  { path: 'recipes/edit/:id', component: RecipeEditComponent, canActivate: [AuthGuard], data: { sectionTitle: 'Edit Recipe' } },
  { path: 'books', component: BooksComponent, canActivate: [AuthGuard], data: { sectionTitle: 'Browse recipe books' } },
  { path: 'recipe-books/:id', component: RecipeBookDetailsComponent, canActivate: [AuthGuard], data: { sectionTitle: 'View Recipe Book' } },


  { path: '', redirectTo: 'signin', pathMatch: 'full' },

  // Handle /activate by forcing a full page reload to hit the API
  {
    path: 'activate',
    component: ActivateComponent,
  },
  //{ path: '**', redirectTo: 'signin' },
  //{ path: '/recipes', component: RecipeListComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
