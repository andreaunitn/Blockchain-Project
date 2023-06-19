import {Component, OnInit} from '@angular/core';
import {catchError, lastValueFrom, map, of} from "rxjs";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import {ActivatedRoute, Router} from "@angular/router";


@Component({
  selector: 'app-adminLogin',
  templateUrl: `./adminLogin.component.html`,
  styleUrls: ['../../../assets/styles/myStyle.scss']
})


export class AdminLoginComponent implements OnInit{
  hide : boolean = true;
  session = sessionStorage;
  errorMessage = "";

  constructor(private router: Router, private http: HttpClient, private activatedRoute: ActivatedRoute) {

  }

  ngOnInit() {
  
  }

  async connectToMetamask(psw: string, event:any){
    //this.session.removeItem("admin");
    event.preventDefault();
    
    let ethereum = (window as any).ethereum;
    if(typeof ethereum !== 'undefined'){
      console.log("MetaMask is installed");
    }
    let address = "";
    if(ethereum){
      try{
        ethereum.request({ method: 'eth_requestAccounts' }).then((addressMetamask: any) => {
          address = addressMetamask[0];
          console.log("Account connected: ", address);
          this.login(address, psw);
        });
      } catch(error){
        console.error("User denied account access");
      }
    } 
  }

  async login(address: string, psw: string){
    this.session.removeItem("fiscalCode");
    this.errorMessage = "";

    if(address != ""){
      if(psw == undefined || psw == ""){
        this.errorMessage = "Parameter not defined";
        return false;
      }
  
      const body = {
        "address": address,
        "psw": psw
      };
      const headers = new HttpHeaders().set('Content-Type', 'application/json; charset=utf-8');
      await lastValueFrom(this.http.post<any>('http://localhost:8080/api/v1/user/loginAdmin', body, {headers: headers}).pipe(map(data => {
          this.session.setItem("admin", data.admin);
          this.session.setItem("address", data.address);
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
    } else {
      return false;
    }
  }
}

