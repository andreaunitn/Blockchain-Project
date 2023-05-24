import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http' 
import { catchError, lastValueFrom, map, of } from 'rxjs';
import { environment } from 'src/environments/environment';


@Component({
  selector: 'account-root',
  templateUrl: './account.component.html',
  providers: []
})
export class AccountComponent implements OnInit {
 
  constructor(private router: Router, private _ActivatedRoute: ActivatedRoute, private http: HttpClient) {
    
  }

  ngOnInit(): void {
    this.setAccountInfo();
  }

  setAccountInfo(){
    const headers = new HttpHeaders().set('x-access-token', sessionStorage.getItem('token') ?? "");  
    // @ts-ignore
    lastValueFrom(this.http.get<any>(`${environment.apiUrl}/api/v2/users/${sessionStorage.getItem("userID")}`, {headers: headers}).pipe(map( data => { 
        // @ts-ignore
        document.getElementById("username").value = data.username;
        // @ts-ignore
        document.getElementById("email").value = data.email;
        // @ts-ignore
        document.getElementById("target").value = data.target;    
    }), catchError(error => {
      // @ts-ignore
      document.getElementById("manageAccountErrorMessage").style.display = 'block';
      // @ts-ignore
      document.getElementById("manageAccountErrorMessage").innerHTML = error.error.message;
      return of([]);
  }))) 
  }

  verifyPsw(psw: string, psw2: string){
    if(psw == psw2){
      return true;
    } else {
      // @ts-ignore
      document.getElementById("manageAccountErrorMessage").style.display = 'block';
      // @ts-ignore
      document.getElementById("manageAccountErrorMessage").innerHTML = "Le password non coincidono";
      return false;
    }      
  }

  async edit(username: string, email: string, psw: string, psw2:string, target: string, event:any){
    event.preventDefault();
    // @ts-ignore
    document.getElementById("manageAccountErrorMessage").style.display = 'none';
    // @ts-ignore
    document.getElementById("infoUpdatedMessage").style.display = 'none';
    if(this.verifyPsw(psw, psw2) == true){
        const body = {
          "email": email,
          "password": psw,
          "target": target
        };
        const headers = new HttpHeaders().set('Content-Type', 'application/json; charset=utf-8').set('x-access-token', sessionStorage.getItem('token') ?? "");
        //console.log(params);
        await lastValueFrom(this.http.put<any>(`${environment.apiUrl}/api/v2/users/${sessionStorage.getItem("userID")}`, body, {headers: headers}).pipe(map( data => { 
          // @ts-ignore
          document.getElementById("infoUpdatedMessage").style.display = 'block';
            // @ts-ignore
            document.getElementById("infoUpdatedMessage").innerHTML = data.message;
        
        }), catchError((error) => {
          // @ts-ignore
          document.getElementById("manageAccountErrorMessage").style.display = 'block';
          // @ts-ignore
          document.getElementById("manageAccountErrorMessage").innerHTML = error.error.message;
          return of([]);
      })))
    }      
  } 

   

}
