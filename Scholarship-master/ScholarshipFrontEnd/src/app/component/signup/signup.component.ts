import {Component, OnInit} from '@angular/core';
import {catchError, lastValueFrom, map, of} from "rxjs";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import {ActivatedRoute, Router} from "@angular/router";


@Component({
  selector: 'app-signup',
  templateUrl: `./signup.component.html`,
  styleUrls: ['../../../assets/styles/myStyle.scss']
})


export class SignUpComponent implements OnInit{
  hide : boolean = true;
  session = sessionStorage;
  errorMessage = "";

  constructor(private router: Router, private http: HttpClient, private activatedRoute: ActivatedRoute) {

  }

  ngOnInit() {
  
  }

  async signup(fiscalCode: string, event:any){
    event.preventDefault();
    this.errorMessage = "";

    if(fiscalCode == undefined || fiscalCode == ""){
      this.errorMessage = "Parameter not defined";
      return false;
    }

    const body = {
      "address": this.session.getItem("address"),
      "fiscalCode": fiscalCode
    };
    const headers = new HttpHeaders().set('Content-Type', 'application/json; charset=utf-8');
    await lastValueFrom(this.http.post<any>('http://localhost:8080/api/v1/user/signup', body, {headers: headers}).pipe(map(data => {
        this.session.setItem("address", data.address);
        this.session.setItem("fiscalCode", data.fiscalCode);
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

