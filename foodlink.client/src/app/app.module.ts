import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { AppRoutingModule } from './app-routing.module';

import { AppComponent } from './app.component';
import { RecipeListComponent } from './recipe-list/recipe-list.component';
import { NavMenuComponent } from './nav-menu/nav-menu.component';

import { ApiAuthorizationModule } from './api-authorization/api-authorization.module';
import { AuthInterceptor } from './api-authorization/authorize.interceptor';
import { AuthGuard } from './api-authorization/authorize.guard';
import { AuthorizeService } from './api-authorization/authorize.service';
import { RecipeDetailsComponent } from './recipe-details/recipe-details.component';
import { RecipeCreateComponent } from './recipe-create/recipe-create.component';
import { FooterComponent } from './footer/footer.component';
import { RecipeEditComponent } from './recipe-edit/recipe-edit.component';
import { ProfileViewComponent } from './profile-view/profile-view.component';
import { ProfileEditComponent } from './profile-edit/profile-edit.component';
import { BooksComponent } from './books/books.component';
import { RecipeBookDetailsComponent } from './recipe-book-details/recipe-book-details.component';
import { RecipeCardComponent } from './recipe-card/recipe-card.component';


@NgModule({
  declarations: [
    AppComponent,
    RecipeListComponent,
    NavMenuComponent,
    RecipeDetailsComponent,
    RecipeCreateComponent,
    FooterComponent,
    RecipeEditComponent,
    ProfileViewComponent,
    ProfileEditComponent,
    BooksComponent,
    RecipeBookDetailsComponent,
    RecipeCardComponent,
  ],
  imports: [
    BrowserModule, HttpClientModule,
    AppRoutingModule, FormsModule,
    ReactiveFormsModule, ApiAuthorizationModule
  ],
  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true },
    AuthGuard,
    AuthorizeService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
