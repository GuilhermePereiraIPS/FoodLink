import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { RecipeListComponent } from './recipe-list/recipe-list.component'
import { RecipeDetailsComponent } from './recipe-details/recipe-details.component'
import { RecipeCreateComponent } from './recipe-create/recipe-create.component'

const routes: Routes = [
  { path: '', component: RecipeListComponent, pathMatch: 'full' },
  { path: 'recipes/create', component: RecipeCreateComponent },
  { path: 'recipes', component: RecipeListComponent },
  { path: 'recipes/:id', component: RecipeDetailsComponent },

  //{ path: '/recipes', component: RecipeListComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
