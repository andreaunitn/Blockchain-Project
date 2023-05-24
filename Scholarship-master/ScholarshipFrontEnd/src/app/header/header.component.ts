import {Component} from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from "@angular/common/http";
import {catchError, lastValueFrom, map, of} from "rxjs";
import { Router } from '@angular/router';
import { environment } from 'src/environments/environment';


@Component({
  selector: 'app-header',
  templateUrl: `./header.component.html`,
  styleUrls: ['./header.component.css']
})


export class HeaderComponent {
  title = 'header';
  sessionStorageHeader = sessionStorage;

  constructor(private http: HttpClient, private router: Router) {

  }

  async loginFunction(username: string, psw:string, event:any){
    event.preventDefault();
    const body = {
      "username": username,      
      "password": psw
    };
    
    const headers = new HttpHeaders().set('Content-Type', 'application/json; charset=utf-8');
    await lastValueFrom(this.http.post<any>(`${environment.apiUrl}/api/v2/users/login`, body, {headers: headers}).pipe(map(data => {
        this.sessionStorageHeader.setItem("username", data.username);
        this.sessionStorageHeader.setItem("userID", data.id);
        this.sessionStorageHeader.setItem("permissions", data.permissions);
        this.sessionStorageHeader.setItem("token", data.token); 
    }), catchError(error => {
      // @ts-ignore
      document.getElementById("loginErrorMessage").style.display = 'block';
      // @ts-ignore
      document.getElementById("loginErrorMessage").innerHTML = "Wrong username or password";
      return of([]);
  })));
  }

  logout(){
    this.sessionStorageHeader.removeItem("userID");
    this.sessionStorageHeader.removeItem("username");
    this.sessionStorageHeader.removeItem("permissions");
    this.sessionStorageHeader.removeItem("token");
    this.router.navigate(['/']);    
  }

  checkPermissions(){
    return this.sessionStorageHeader.getItem("permissions") == 'true';
  }

  checkUsersLogged(){
    return this.sessionStorageHeader.getItem("userID") != undefined;
  }
}

