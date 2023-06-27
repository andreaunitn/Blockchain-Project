import {Component} from '@angular/core';
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {catchError, lastValueFrom, map, of} from "rxjs";
import { environment } from 'src/environments/environment';
import {ActivatedRoute, Router} from "@angular/router";
import { Ranking } from 'src/app/classes/Rankings';



@Component({
  selector: 'app-ranking',
  templateUrl: `./ranking.component.html`,
  styleUrls: ['../../../assets/styles/myStyle.scss']
})


export class RankingComponent {
  session = sessionStorage
  rankings: Ranking[] | undefined;
  callName = "";
  rankingInfo = "";

  constructor(private router: Router, private http: HttpClient, private activatedRoute: ActivatedRoute) {
  }

  ngOnInit() {
    this.rankingInfo = "";
    this.activatedRoute.queryParams.subscribe(params => {
      if(params['call'] != undefined) {
         this.getRanking(params['call']);
      }
    });
  }

  checkUser(address: String){
    if(this.session.getItem('address') != null && (this.session.getItem('address'))?.toLowerCase() == address.toLowerCase()){
      return true;
    } else {
      return false;
    }
  }

  async getRanking(callName){
    this.callName = callName;
    const headers = new HttpHeaders().set('Content-Type', 'application/json; charset=utf-8');
    await lastValueFrom(this.http.get<any>(`${environment.apiUrl}/api/v1/call/ranking?name=` + callName, {headers: headers}).pipe(map(data => {
        let i;
        this.rankings = new Array(data.length);
        if (data.length > 0) {
          for (i = 0; i < data.length; i++) {
            this.rankings[i] = new Ranking(data[i].address, data[i].ISEE, data[i].credits, data[i].year, data[i].score, data[i].funds, data[i].status);
          }
        } else {
          this.rankingInfo = "No ranking available at the moment";
        }
        
    }), catchError(error => {
      console.error(error);
      return of([]);
  })));
  }
}

