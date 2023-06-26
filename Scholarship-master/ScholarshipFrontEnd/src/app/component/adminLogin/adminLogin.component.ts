import {Component, OnInit} from '@angular/core';
import {catchError, lastValueFrom, map, of} from "rxjs";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import {ActivatedRoute, Router} from "@angular/router";


@Component({
  selector: 'app-adminLogin',
  templateUrl: `./adminLogin.component.html`,
  styleUrls: ['../../../assets/styles/myStyle.scss']
})


export class AdminLoginComponent implements OnInit{
  hide : boolean = true;
  session = sessionStorage;
  errorMessage = "";

  constructor(private router: Router, private http: HttpClient, private activatedRoute: ActivatedRoute) {

  }

  ngOnInit() {
  
  }

  async login(username: string, psw: string, event: any){
    event.preventDefault();
    this.session.removeItem("fiscalCode");
    this.session.removeItem("address");
    this.errorMessage = "";

    
      if(username == undefined || username == "" || psw == undefined || psw == ""){
        this.errorMessage = "Parameter not defined";
        return false;
      }
  
      const body = {
        "username": username,
        "psw": psw
      };
      const headers = new HttpHeaders().set('Content-Type', 'application/json; charset=utf-8');
      await lastValueFrom(this.http.post<any>('http://localhost:8080/api/v1/user/loginAdmin', body, {headers: headers}).pipe(map(data => {
          this.session.setItem("admin", data.admin);
          this.router.navigateByUrl("/");
      }),catchError(error => {
        if(error.error.message == undefined){
          this.errorMessage = "Server error";
        } else {
          this.errorMessage = error.error.message;
        }
        return of([]);
      })));
      return true;
  }
  
}

