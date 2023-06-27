import {Component, OnInit} from '@angular/core';
import {catchError, lastValueFrom, map, of} from "rxjs";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import {ActivatedRoute, Router} from "@angular/router";

@Component({
  selector: 'app-callAdmin',
  templateUrl: `./callAdmin.component.html`,
  styleUrls: ['../../../assets/styles/myStyle.scss']
})


export class CallAdminComponent implements OnInit{
  hide : boolean = true;
  session = sessionStorage;
  errorMessage = "";

  constructor(private router: Router, private http: HttpClient, private activatedRoute: ActivatedRoute) {

  }

  ngOnInit() {
  
  }

  async add(name:String, description: string, ISEE: number, budget: number, credit1:number, credit2:number, credit3:number, fund1:number, fund2:number, fund3:number, endDate: Date, event:any){
    event.preventDefault();
    this.errorMessage = "";
    
    if(name == undefined || name == "" || description == undefined || description == "" || ISEE == undefined
        || budget == undefined || credit1 == undefined || credit2 == undefined || credit3 == undefined
        || fund1 == undefined || fund2 == undefined || fund3 == undefined || endDate == undefined){
      this.errorMessage = "Parameter not defined";
      return false;
    }

    let credits = [Number(credit1), Number(credit2), Number(credit3)];
    let funds = [Number(fund1), Number(fund2), Number(fund3)];

    const body = {
      "name": name,
      "description": description,
      "ISEE": ISEE,
      "budget": budget,
      "credits": credits,
      "funds": funds,
      "endDate": new Date(endDate)
    };
    
    const headers = new HttpHeaders().set('Content-Type', 'application/json; charset=utf-8');
    await lastValueFrom(this.http.post<any>('http://localhost:8080/api/v1/call', body, {headers: headers}).pipe(map(data => {
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

