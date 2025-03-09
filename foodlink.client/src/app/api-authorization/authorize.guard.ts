import { Injectable } from "@angular/core";
import { CanActivate, Router, ActivatedRouteSnapshot, RouterStateSnapshot } from "@angular/router";
import { Observable, map } from "rxjs";
import { AuthorizeService } from "./authorize.service";


@Injectable({ providedIn: 'root' })
// protects routes from unauthenticated users
export class AuthGuard implements CanActivate  {
  constructor(private authService: AuthorizeService, private router: Router) { }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
    const isSignedIn = this.authService.isSignedIn();
    
    return isSignedIn
  }
}
