import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators, AbstractControl, ValidatorFn } from '@angular/forms';
import { AccountsService, User, UserUpdate } from '../services/accounts.service';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-profile-edit',
  templateUrl: './profile-edit.component.html',
  styleUrls: ['./profile-edit.component.css']
})
export class ProfileEditComponent implements OnInit {
  public userForm!: FormGroup;
  private userData!: User;
  public user$: Observable<User | null>; 

  constructor(
    private accountsService: AccountsService,
    private router: Router,
    private formBuilder: FormBuilder,

  ) {
    this.user$ = this.accountsService.currentUser$;
  }

  ngOnInit(): void {

    this.userForm = this.formBuilder.group({
      username: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [
        Validators.minLength(6),
        Validators.pattern(/(?=.*[^a-zA-Z0-9 ])/)
      ]],
      confirmPassword: [''],
      currentPassword: ['', Validators.required],
      aboutMe: ['']
    }, { validators: this.passwordMatchValidator });

    this.user$.subscribe(
      (user) => {
        if (user) {
          this.userData = user;
          this.userForm.patchValue({
            username: this.userData.username,
            email: this.userData.email,
            aboutMe: this.userData.aboutMe
          });
        }
      },
      (error) => {
        console.error('Error fetching user data:', error);
      }
    );
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

  onSubmit(): void {
    if (this.userForm.invalid) return;

    const userUpdate: UserUpdate = {
      aboutMe: this.userForm.get('aboutMe')?.value,
      username: this.userForm.get('username')?.value,
      email: this.userForm.get('email')?.value,
      password: this.userForm.get('password')?.value,
      currentPassword: this.userForm.get('currentPassword')?.value,
    };


    this.accountsService.editUser(userUpdate).subscribe(
      () => {
        console.log('User updated successfully');
        this.router.navigate(['/profile', this.userData.username]);
      },
      (error) => {
        alert(error);
      }
    );
  }
}
