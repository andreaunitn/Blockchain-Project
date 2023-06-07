import {Component} from '@angular/core';
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {catchError, lastValueFrom, map, of} from "rxjs";
import {ActivatedRoute, Router} from "@angular/router";


@Component({
  selector: 'app-header',
  templateUrl: `./header.component.html`,
  styleUrls: ['../../../assets/styles/myStyle.scss']
})


export class HeaderComponent {
  session = sessionStorage
  hide: boolean = true;

  constructor(private router: Router, private http: HttpClient, private activatedRoute: ActivatedRoute) {

  }

  ngOnInit() {
    this.activatedRoute.queryParams.subscribe(params => {
      if(params['username'] != undefined) {
        this.session.setItem("username", params['username']);
        this.session.setItem("token", params['token']);
        this.router.navigateByUrl("/");
      }
    });
  }

  async login(username: string, psw: string){
    // @ts-ignore
    //document.getElementById("loginErrorMessage").style.display = 'none';
    const body = {
      "username": username,
      "password": psw
    };
    const headers = new HttpHeaders().set('Content-Type', 'application/json; charset=utf-8');
    await lastValueFrom(this.http.post<any>('http://localhost:12345/v1/users/login', body, {headers: headers}).pipe(map(data => {
      this.session.setItem("username", data.user.username);
      this.session.setItem("token", data.user.token);
    }),catchError(error => {
      let errore = error.error.message;
      if(errore == undefined){
        errore = "Server error";
      }
      // @ts-ignore
      //document.getElementById("loginErrorMessage").style.display = 'block';
      // @ts-ignore
      //document.getElementById("loginErrorMessage")?.innerHTML = errore;
      return of([]);
    })));
  }

  async loginGoogle(){
    window.location.href = 'http://localhost:12345/v1/users/auth/google';
  }

  logout(){
    this.session.removeItem("username");
    this.session.removeItem("token");
  }
}