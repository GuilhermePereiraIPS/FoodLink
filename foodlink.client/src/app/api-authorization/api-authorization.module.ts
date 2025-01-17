import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http'; // Import HttpClientModule
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';


import { SigninComponent } from './signin/signin.component';
import { RegisterComponent } from './register/register.component';
import { LoginMenuComponent } from './login-menu/login-menu.component';


@NgModule({
  imports: [
    CommonModule,
    HttpClientModule,
    ReactiveFormsModule,
    RouterModule.forChild(
      [
        { path: 'signin', component: SigninComponent },
        { path: 'new', component: RegisterComponent },
      ]
    )
  ],
  declarations: [LoginMenuComponent, SigninComponent, RegisterComponent],
  exports: [LoginMenuComponent, SigninComponent, RegisterComponent],
})
export class ApiAuthorizationModule { }
