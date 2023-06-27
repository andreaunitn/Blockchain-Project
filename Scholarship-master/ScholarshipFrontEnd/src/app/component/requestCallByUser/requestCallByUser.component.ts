import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http' 
import { catchError, lastValueFrom, map, of } from 'rxjs';
import { environment } from 'src/environments/environment';
import { RequestCall } from 'src/app/classes/RequestCalls';

@Component({
  selector: 'app-requestCallByUser',
  templateUrl: './requestCallByUser.component.html',
  providers: []
})
export class RequestCallByUserComponent implements OnInit{
    requestCalls: RequestCall[] | undefined;
    requestCallSelected: RequestCall | undefined;
    session = sessionStorage;

  constructor(private router: Router, private _ActivatedRoute: ActivatedRoute, private http: HttpClient) {

  }

  ngOnInit(): void {
    this.getRequestCalls();
  }

  async getRequestCalls(){
    // @ts-ignore
    document.getElementById("requestCallInfoModule").style.display = 'none';
    const headers = new HttpHeaders().set('Content-Type', 'application/json; charset=utf-8');
    const params = new HttpParams().set("address", this.session.getItem("address") || "");
    
    await lastValueFrom(this.http.get<any>(`${environment.apiUrl}/api/v1/requestCall/byUser`, {params}).pipe(map(data => {
        let i;
        this.requestCalls = new Array(data.length);
        console.log(data);
        if (data.length > 0) {
          for (i = 0; i < data.length; i++) {
            this.requestCalls[i] = new RequestCall(data[i].name, data[i].address, data[i].dateTime, data[i].eligible, data[i].released, data[i].fund);
          }
        }
    }), catchError(error => {
      console.error(error);
      return of([]);
  })));
  }

  getRequestCall(callDetailName: string) {
    // @ts-ignore
    for (let i = 0; i < this.requestCalls.length; i++) {
      // @ts-ignore
      if (this.requestCalls[i].name == callDetailName) {
        // @ts-ignore
        this.requestCallSelected = this.requestCalls[i];
      }
    }
  }
  
  requestCallDetail(event: any) {
    // @ts-ignore
    document.getElementById("requestCallInfoModule").style.display = 'block';
    let callDetailName;

    if (event != undefined) {
      callDetailName = event.target.id;
    }

    if (callDetailName != "") {
      let requestCallInfo = "";
      this.getRequestCall(callDetailName);

      // @ts-ignore
      requestCallInfo = "<b>Call:</b> " + this.requestCallSelected.name + "<br>";
      requestCallInfo += "<b>Result:</b> ";
      if(this.requestCallSelected?.eligible == false){
        requestCallInfo += "Request rejected: requirements not satisfied";
      } else if(this.requestCallSelected?.eligible == true && this.requestCallSelected?.released == true){
        requestCallInfo += "Fund assigned: " + this.requestCallSelected.fund + " euro";
      } else {
        requestCallInfo += "Request accepted, waiting for ranking and funding assignment";
      }

      // @ts-ignore
      let eD = new Date(this.requestCallSelected?.dateTime);
      // @ts-ignore
      requestCallInfo += "<br><b>Request date: </b> " + eD.getDate() + "/" + (eD.getMonth() + 1) + "/" + eD.getFullYear();
      
      // @ts-ignore  
      document.getElementById("requestCallInfo").innerHTML = requestCallInfo;
    }
  }
}