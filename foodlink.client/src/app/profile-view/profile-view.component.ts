import { Component, OnInit } from '@angular/core';

import { User, AccountsService } from '../services/accounts.service';
import { HttpClient } from '@angular/common/http';
import { Router, ActivatedRoute } from '@angular/router';


@Component({
  selector: 'app-profile-view',
  standalone: false,
  templateUrl: './profile-view.component.html',
  styleUrl: './profile-view.component.css'
})
export class ProfileViewComponent {
  
  private username! : string
  public user!: User

  constructor(private http: HttpClient, private accountsService: AccountsService, private router: Router, private route: ActivatedRoute) { }
  
  ngOnInit() {
    this.route.params.subscribe(params => {
      this.username = params['username']; 
    });

    this.getUserInfo(this.username);
  }

  getUserInfo(username:string) {
    this.accountsService.getUserInfo(username).subscribe(
      (result) => {
        console.log('User fetched:', result);
        this.user = result;
      },
      (error) => {
        console.error(error);
      }
    );
  }

  
}
