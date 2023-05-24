import { Injectable } from "@angular/core";
import {ActivatedRouteSnapshot, CanActivate, RouterStateSnapshot, UrlTree } from "@angular/router";
import { Observable } from "rxjs";
import { Router } from '@angular/router';

@Injectable()
export class userLoggedGuard implements CanActivate {
  constructor(private router: Router) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean|UrlTree>|Promise<boolean|UrlTree>|boolean|UrlTree {
    if(sessionStorage.getItem("userID") != null){
      return true;
  } else {
      this.router.navigate(['']);
      return false;
  }
  }
}