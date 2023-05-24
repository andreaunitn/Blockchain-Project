import { Component } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http' 
import { catchError, lastValueFrom, map, of } from 'rxjs';
import { environment } from 'src/environments/environment';


@Component({
  selector: 'signUp-root',
  templateUrl: './signUp.component.html',
  providers: []
})
export class SignUpComponent {
 
  constructor(private router: Router, private _ActivatedRoute: ActivatedRoute, private http: HttpClient) {
    
  }

  verifyPsw(psw: string, psw2: string){
    if(psw == psw2){
      return true;
    } else {
      // @ts-ignore
      document.getElementById("signUpErrorMessage").style.display = 'block';
      // @ts-ignore
      document.getElementById("signUpErrorMessage").innerHTML = "Le password non coincidono";
      return false;
    }      
  }

  async create(username: string, email: string, psw: string, psw2:string, target: string, event:any){
    event.preventDefault();
    // @ts-ignore
    document.getElementById("signUpErrorMessage").style.display = 'none';
    if(this.verifyPsw(psw, psw2) == true){
      const body = {
        "username": username,
        "email": email,
        "password": psw,
        "target": target
      };
      const headers = new HttpHeaders().set('Content-Type', 'application/json; charset=utf-8');
      //console.log(params);
      await lastValueFrom(this.http.post<any>(`${environment.apiUrl}/api/v2/users/signUp`, body, {headers: headers}).pipe(map( data => { 
          sessionStorage.setItem("username", data.username);
          sessionStorage.setItem("userID", data.id);
          sessionStorage.setItem("permissions", data.permissions);
          sessionStorage.setItem("token", data.token);

          this.router.navigate([""]);        
      }), catchError((error) => {
        // @ts-ignore
        document.getElementById("signUpErrorMessage").style.display = 'block';
        // @ts-ignore
        document.getElementById("signUpErrorMessage").innerHTML = error.error.message;
        return of([]);
    })))
    }      
  }   

}
