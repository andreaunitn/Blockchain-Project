import { Injectable } from "@angular/core";
import {ActivatedRouteSnapshot, Router, RouterStateSnapshot, UrlTree } from "@angular/router";
import { Observable } from "rxjs";

@Injectable({
        providedIn: 'root'
})
export class adminGuard {
  constructor(private router: Router) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean|UrlTree>|Promise<boolean|UrlTree>|boolean|UrlTree {
    if(sessionStorage.getItem("admin") == null){
      this.router.navigateByUrl("/adminLogin");
      return false;
    }  
    return true;
  }
}