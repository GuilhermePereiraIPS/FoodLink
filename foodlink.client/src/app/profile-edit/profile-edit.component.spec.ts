import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ProfileEditComponent } from './profile-edit.component';
import { ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { of, throwError } from 'rxjs';
import { AccountsService } from '../services/accounts.service';
import { RouterTestingModule } from '@angular/router/testing';

describe('ProfileEditComponent', () => {
  let component: ProfileEditComponent;
  let fixture: ComponentFixture<ProfileEditComponent>;

  // Mock Services
  const mockAccountsService = {
    getCurrentUser: jasmine.createSpy().and.returnValue(of({
      username: 'testuser',
      email: 'test@example.com',
      aboutMe: 'Just testing'
    })),
    editUser: jasmine.createSpy().and.returnValue(of({}))
  };

  const mockRouter = {
    navigate: jasmine.createSpy('navigate')
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ProfileEditComponent],
      imports: [ReactiveFormsModule, RouterTestingModule],
      providers: [
        { provide: AccountsService, useValue: mockAccountsService },
        { provide: Router, useValue: mockRouter }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(ProfileEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should load user data into the form', () => {
    const form = component.userForm;
    expect(form.get('username')?.value).toBe('testuser');
    expect(form.get('email')?.value).toBe('test@example.com');
  });

  it('should invalidate form if passwords do not match', () => {
    const form = component.userForm;
    form.get('password')?.setValue('NewPass@123');
    form.get('confirmPassword')?.setValue('WrongPass');
    expect(form.errors?.['passwordMismatch']).toBeTrue();
  });

  it('should call editUser and navigate on submit with valid form', () => {
    component.userForm.patchValue({
      username: 'testuser',
      email: 'test@example.com',
      aboutMe: 'Testing',
      currentPassword: 'oldpass',
      password: '',
      confirmPassword: ''
    });

    component.onSubmit();

    expect(mockAccountsService.editUser).toHaveBeenCalled();
    expect(mockRouter.navigate).toHaveBeenCalledWith(['/profile', 'testuser']);
  });
});
