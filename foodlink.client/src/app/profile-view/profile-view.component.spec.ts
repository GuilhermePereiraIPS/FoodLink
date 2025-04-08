import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ProfileViewComponent } from './profile-view.component';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';
import { AccountsService } from '../services/accounts.service';
import { HttpClientTestingModule } from '@angular/common/http/testing';

describe('ProfileViewComponent', () => {
  let component: ProfileViewComponent;
  let fixture: ComponentFixture<ProfileViewComponent>;
  let mockAccountsService: jasmine.SpyObj<AccountsService>;

  const mockUser = {
    id: '123',
    username: 'leo',
    email: 'leo@example.com',
    aboutMe: 'Hello there!'
  };

  beforeEach(async () => {
    mockAccountsService = jasmine.createSpyObj('AccountsService', ['getUserInfo']);

    await TestBed.configureTestingModule({
      declarations: [ProfileViewComponent],
      imports: [HttpClientTestingModule],
      providers: [
        { provide: AccountsService, useValue: mockAccountsService },
        {
          provide: ActivatedRoute,
          useValue: {
            params: of({ username: 'leo' })
          }
        }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(ProfileViewComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should fetch user data on init', () => {
    mockAccountsService.getUserInfo.and.returnValue(of(mockUser));
    fixture.detectChanges();

    expect(mockAccountsService.getUserInfo).toHaveBeenCalledWith('leo');
    expect(component.user).toEqual(mockUser);
  });
});
