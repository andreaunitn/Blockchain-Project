import { Injectable } from "@angular/core";
import {ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree } from "@angular/router";
import { Observable } from "rxjs";

@Injectable({
        providedIn: 'root'
})
export class loggedGuard {
  constructor() {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean|UrlTree>|Promise<boolean|UrlTree>|boolean|UrlTree {
    return sessionStorage.getItem("address") != null && sessionStorage.getItem("fiscalCode") != null;
  }
}