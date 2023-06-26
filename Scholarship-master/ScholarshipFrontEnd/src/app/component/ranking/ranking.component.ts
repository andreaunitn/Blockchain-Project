import {Component} from '@angular/core';
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {catchError, lastValueFrom, map, of} from "rxjs";
import { environment } from 'src/environments/environment';
import {ActivatedRoute, Router} from "@angular/router";



@Component({
  selector: 'app-ranking',
  templateUrl: `./ranking.component.html`,
  styleUrls: ['../../../assets/styles/myStyle.scss']
})


export class RankingComponent {


  constructor(private router: Router, private http: HttpClient, private activatedRoute: ActivatedRoute) {
  }

  ngOnInit() {
    this.activatedRoute.queryParams.subscribe(params => {
        console.log(params)
      if(params['call'] != undefined) {
         this.getRanking(params['call']);
      }
    });
  }

  async getRanking(callName){
    const headers = new HttpHeaders().set('Content-Type', 'application/json; charset=utf-8');
    await lastValueFrom(this.http.get<any>(`${environment.apiUrl}/api/v1/call/ranking?name=` + callName, {headers: headers}).pipe(map(data => {
        console.log(data);
    }), catchError(error => {
      console.error(error);
      return of([]);
  })));
  }


}
