import {Component} from '@angular/core';
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {catchError, lastValueFrom, map, of} from "rxjs";
import {ActivatedRoute, Router} from "@angular/router";



@Component({
  selector: 'app-header',
  templateUrl: `./header.component.html`,
  styleUrls: ['../../../assets/styles/myStyle.scss']
})


export class HeaderComponent {
  session = sessionStorage
  hide: boolean = true;

  constructor(private router: Router, private http: HttpClient, private activatedRoute: ActivatedRoute) {
  }

  ngOnInit() {
    this.activatedRoute.queryParams.subscribe(params => {
      if(params['address'] != undefined) {
        this.session.setItem("address", params['address']);
        this.session.setItem("fiscalCode", params['fiscalCode']);
        this.router.navigateByUrl("/");
      }
    });
  }

  async connectToMetamask(){
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
          this.login(address);
        });
      } catch(error){
        console.error("User denied account access");
      }
    }    
    
  }

  async login(address: string){
    console.log("CI SONO");
    if(address != ""){
      const body = {
        "address": address,
      };
      const headers = new HttpHeaders().set('Content-Type', 'application/json; charset=utf-8');
      await lastValueFrom(this.http.post<any>('http://localhost:12345/v1/users/login', body, {headers: headers}).pipe(map(data => {
        this.session.setItem("address", data.user.address);
        this.session.setItem("fiscalCode", data.user.fiscalCode);
      }),catchError(error => {
        let errore = error.error.message;
        if(errore == undefined){
          errore = "Server error";
        }
        return of([]);
      })));
    }
  }

  logout(){
    this.session.removeItem("address");
    this.session.removeItem("fiscalCode");
  }
}