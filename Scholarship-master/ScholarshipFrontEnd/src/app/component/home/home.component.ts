import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http' 
import { catchError, lastValueFrom, map, of } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Call } from 'src/app/classes/Calls';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  providers: []
})
export class HomeComponent implements OnInit{
    calls: Call[] | undefined;
    callSelected: Call | undefined;
    session = sessionStorage;

  constructor(private router: Router, private _ActivatedRoute: ActivatedRoute, private http: HttpClient) {

  }

  ngOnInit(): void {
    this.getCalls();
  }

  async getCalls(){
    // @ts-ignore
    document.getElementById("callInfoModule").style.display = 'none';
    // @ts-ignore  
    document.getElementById("callApply").innerHTML = "";
    const headers = new HttpHeaders().set('Content-Type', 'application/json; charset=utf-8');
    await lastValueFrom(this.http.get<any>(`${environment.apiUrl}/api/v1/call/all`, {headers: headers}).pipe(map(data => {
        let i;
        this.calls = new Array(data.length);
        //console.log(data);
        if (data.length > 0) {
          for (i = 0; i < data.length; i++) {
            this.calls[i] = new Call(data[i].name, data[i].description, data[i].ISEE, data[i].budget, data[i].credits, data[i].funds, data[i].endDate);
          }
        }
    }), catchError(error => {
      console.error(error);
      return of([]);
  })));
  }

  async viewRanking(){
    // @ts-ignore
    this.router.navigate(['/ranking'], {queryParams: {call: this.callSelected.name}})
  }

  verifyEndDate(){
    if(this.callSelected != undefined && new Date(this.callSelected.endDate).getTime() > new Date().getTime()){
      return true;
    } else {
      return false;
    }
  }

  getCall(callDetailName: string) {
    // @ts-ignore
    for (let i = 0; i < this.calls.length; i++) {
      // @ts-ignore
      if (this.calls[i].name == callDetailName) {
        // @ts-ignore
        this.callSelected = this.calls[i];
      }
    }
  }

  async applyForCall(){
      let callName = this.callSelected?.name;
      let address = this.session.getItem("address");

      const body = {
        "address": address,
        "name": callName
      };
      const headers = new HttpHeaders().set('Content-Type', 'application/json; charset=utf-8');
      await lastValueFrom(this.http.post<any>('http://localhost:8080/api/v1/requestCall', body, {headers: headers}).pipe(map(data => {
        // @ts-ignore  
        document.getElementById("callApply").innerHTML = "Request performed";
      }),catchError(error => {
        if(error.status == 409){
          // @ts-ignore   
          document.getElementById("callApply").innerHTML = "Request already performed";
        }
        if(error.status == 400) {

          // @ts-ignore
          document.getElementById("callApply").innerHTML = "Invalid parameters";
        }
        return of([]);
      })));
  }

  async computeRanking(){
    let callName = this.callSelected?.name;

    const body = {
      "name": callName
    };
    const headers = new HttpHeaders().set('Content-Type', 'application/json; charset=utf-8');
    await lastValueFrom(this.http.post<any>('http://localhost:8080/api/v1/call/computeRanking', body, {headers: headers}).pipe(map(data => {
      //console.log(data);
      // @ts-ignore  
      document.getElementById("callApply").innerHTML = "Ranking computed";
    }),catchError(error => {
      // @ts-ignore  
      document.getElementById("callApply").innerHTML = "Error in compute ranking";
      return of([]);
    })));
}

  callDetail(event: any) {
    // @ts-ignore
    document.getElementById("callInfoModule").style.display = 'block';
    // @ts-ignore  
    document.getElementById("callApply").innerHTML = "";
    let callDetailName;

    if (event != undefined) {
      callDetailName = event.target.id;
    }

    if (callDetailName != "") {
      let callInfo = "";
      this.getCall(callDetailName);

      // @ts-ignore
      callInfo = "<b>Call:</b> " + this.callSelected.name + "<br><b>Description:</b> " + this.callSelected.description + "<br>";
      // @ts-ignore
      callInfo += "<br><br><h2>Requirements</h2><b>ISEE:</b> " + this.callSelected.ISEE + "<br><b>Total budget:</b> " + this.callSelected.budget + "<br><b>Credits per year:</b> " + this.callSelected.credits + "<br><b>Funds per year:</b> " + this.callSelected.funds + "<br>";
      
      // @ts-ignore
      let eD = new Date(this.callSelected?.endDate);
      // @ts-ignore
      callInfo += "<br><b>End date: </b> " + eD.getDate() + "/" + (eD.getMonth() + 1) + "/" + eD.getFullYear(); 

      // @ts-ignore  
      document.getElementById("callInfo").innerHTML = callInfo;
    }
  }
}