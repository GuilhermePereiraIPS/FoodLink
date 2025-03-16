import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators, AbstractControl, ValidatorFn } from '@angular/forms';
import { AccountsService, User, UserUpdate } from '../services/accounts.service';

@Component({
  selector: 'app-profile-edit',
  templateUrl: './profile-edit.component.html',
  styleUrls: ['./profile-edit.component.css']
})
export class ProfileEditComponent implements OnInit {
  public userForm!: FormGroup;
  private userData!: User;

  constructor(
    private accountsService: AccountsService,
    private router: Router,
    private formBuilder: FormBuilder,
  ) { }

  ngOnInit(): void {

    this.userForm = this.formBuilder.group({
      username: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      currentPassword: ['', Validators.required],
      password: ['', [
        Validators.minLength(6),
        Validators.pattern(/(?=.*[^a-zA-Z0-9 ])/)
      ]],
      confirmPassword: [''],
      aboutMe: ['']
    }, { validators: this.passwordMatchValidator });

    this.accountsService.getCurrentUser(true).subscribe(
      (userData) => {
        this.userForm.patchValue({
          username: userData.username,
          email: userData.email
        });
        this.userData = userData;
      },
      (error) => {
        console.error('Error loading user data:', error);
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
      username: this.userForm.get('username')?.value,
      email: this.userForm.get('email')?.value,
      password: this.userForm.get('password')?.value,
      currentPassword: this.userForm.get('currentPassword')?.value,
      aboutMe: this.userForm.get('aboutMe')?.value
    };

    this.accountsService.editUser(userUpdate).subscribe(
      () => {
        console.log('User updated successfully');
        this.router.navigate(['/profile', this.userData.username]);
      },
      (error) => {
        console.error('Error updating user:', error);
      }
    );
  }
}
