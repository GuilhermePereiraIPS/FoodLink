import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { RecipeFormComponent } from './recipe-form/recipe-form.component';

const routes: Routes = [
  {
    path: 'create-recipe',
    loadComponent: () => import('./recipe-form/recipe-form.component').then(m => m.RecipeFormComponent),
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule { }
