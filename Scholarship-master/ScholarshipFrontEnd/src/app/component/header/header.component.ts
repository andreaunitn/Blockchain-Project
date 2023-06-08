import {Component} from '@angular/core';
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {catchError, lastValueFrom, map, of} from "rxjs";
import {ActivatedRoute, Router} from "@angular/router";
import Web3 from 'web3';


@Component({
  selector: 'app-header',
  templateUrl: `./header.component.html`,
  styleUrls: ['../../../assets/styles/myStyle.scss']
})


export class HeaderComponent {
  session = sessionStorage
  hide: boolean = true;
  web3: any;

  constructor(private router: Router, private http: HttpClient, private activatedRoute: ActivatedRoute) {
    //this.web3 = new Web3("http://127.0.0.1:7545");
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
    let accountAddress = "";
    if(ethereum){
      this.web3 = ethereum;
      try{
        ethereum.request({ method: 'eth_requestAccounts' }).then((address: any) => {
          accountAddress = address[0];
          console.log("Account connected: ", accountAddress);
        });
      } catch(error){
        console.error("User denied account access");
      }
    }
    return accountAddress;
  }

  async loginMetamask(){
    let address = await this.connectToMetamask();
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
    } else {
      alert("Error, not able to connect to metamask");
    }
  }

  logout(){
    this.session.removeItem("address");
    this.session.removeItem("fiscalCode");
  }
}