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

  async add(name:String, description: string, ISEE: number, residenceRegion: string, credits:number, averageRating: number, birthYear: string, endDate: Date, event:any){
    event.preventDefault();
    this.errorMessage = "";
    
    if(name == undefined || name == "" || description == undefined || description == "" || ISEE == undefined
        || residenceRegion == undefined || residenceRegion == "" || credits == undefined
        || averageRating == undefined || birthYear == undefined || endDate == undefined){
      this.errorMessage = "Parameter not defined";
      return false;
    }

    const body = {
      "name": name,
      "description": description,
      "ISEE": ISEE,
      "residenceRegion": residenceRegion,
      "credits": credits,
      "averageRating": averageRating,
      "birthYear": birthYear,
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

