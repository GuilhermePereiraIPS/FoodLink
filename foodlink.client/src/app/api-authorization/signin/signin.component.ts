import { Component, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { Router } from "@angular/router";
import { AuthorizeService } from "../authorize.service";

@Component({
  selector: 'app-signin-component',
  templateUrl: './signin.component.html',
  styleUrls: ['./signin.component.css']
})
export class SignInComponent implements OnInit {
  loginForm!: FormGroup;
  authFailed: boolean = false;
  signedIn: boolean = false;

  constructor(private authService: AuthorizeService,
    private formBuilder: FormBuilder,
    private router: Router) {
    this.signedIn = this.authService.isSignedIn();
  }

  ngOnInit(): void {
    this.authFailed = false;
    this.loginForm = this.formBuilder.group(
      {
        email: ['', [Validators.required, Validators.email]],
        password: ['', [Validators.required]]
      });
  }

  public signIn(event: Event): void {
    event.preventDefault();
    if (!this.loginForm.valid) {
      alert('Please fill the email and password fields');
      return;
    }

    const email = this.loginForm.get('email')?.value;
    const password = this.loginForm.get('password')?.value;

    this.authService.signIn(email, password).subscribe({
      next: (response) => {
        if (response) {
          alert('Login sucessful!');
          this.router.navigateByUrl("/recipes");
        }
      },
      error: (err) => {
        this.authFailed = true;
        console.error('Erro no login:', err);

        const backendMessage = err?.error?.message;
        alert(backendMessage);
      }
    });
  }


}
