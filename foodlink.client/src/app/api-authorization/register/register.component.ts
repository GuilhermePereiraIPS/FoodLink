import { Component, OnInit } from "@angular/core";
import { AbstractControl, FormBuilder, FormGroup, ValidatorFn, Validators } from "@angular/forms";
import { AuthorizeService } from "../authorize.service";

@Component({
  selector: 'app-register-component',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {
  errors: string[] = [];
  registerForm!: FormGroup;
  registerFailed: boolean = false;
  registerSucceeded: boolean = false;
  signedIn: boolean = false;

  constructor(private authService: AuthorizeService,
    private formBuilder: FormBuilder) {

    this.signedIn = this.authService.isSignedIn();
  }

  ngOnInit(): void {
    this.registerFailed = false;
    this.registerSucceeded = false;
    this.errors = [];

    this.registerForm = this.formBuilder.group(
      {
        name: ['', Validators.required],
        email: ['', [Validators.required, Validators.email]],
        password: ['', [
          Validators.required,
          Validators.minLength(6),
          Validators.pattern(/(?=.*[^a-zA-Z0-9 ])/)]],
        confirmPassword: ['', [Validators.required]]
      }, { validators: this.passwordMatchValidator });
  }

  passwordMatchValidator: ValidatorFn = (control: AbstractControl): null | object => {
    const password = control.get('password');
    const confirmPassword = control.get('confirmPassword');
    if (!password || !confirmPassword) {
      return null;
    }
    return password.value !== confirmPassword.value
      ? { passwordMismatch: true }
      : null;
  }

  public register(): void {
    if (!this.registerForm.valid) {
      alert('Por favor, preencha todos os campos corretamente.');
      return;
    }

    this.registerFailed = false;
    this.errors = [];

    const name = this.registerForm.get('name')?.value;
    const email = this.registerForm.get('email')?.value;
    const password = this.registerForm.get('password')?.value;

    this.authService.register(name, email, password).subscribe({
      next: (success: boolean) => {
        if (success) {
          this.registerSucceeded = true;
          alert('Conta criada com sucesso!');
        } else {
          this.registerFailed = true;
          alert('Erro ao criar conta. Verifique os dados.');
        }
      },
      error: (error) => {
        this.registerFailed = true;
        console.error('Erro no registo:', error);

        const backendMessage = error?.error?.message;

        let msg = 'Erro ao criar conta. Tente novamente.';

        if (backendMessage === 'User already exists.') {
          msg = 'Esta conta já existe.';
        } else if (backendMessage === 'Invalid email or password.') {
          msg = 'Email ou palavra-passe incorretos.';
        } else if (backendMessage) {
          msg = backendMessage;
        } else if (error.status === 400) {
          msg = 'Dados inválidos. Verifique os campos.';
        }

        alert(msg);

        
      }
    });
  }


}
