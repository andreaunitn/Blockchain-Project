import { Component } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http'
import { catchError, lastValueFrom, map, of } from 'rxjs';
import { environment } from 'src/environments/environment';


@Component({
  selector: 'schoolarship-root',
  templateUrl: './scholarshipRequest.component.html',
  providers: []
})
export class ScholarshipRequestComponent {
  user: User | undefined;
  personal: Personal | undefined;
  economic: Economic | undefined;
  uni: Uni | undefined;
  info: String = "";


  constructor(private router: Router, private _ActivatedRoute: ActivatedRoute, private http: HttpClient) {
    this.getData();
  }

  async getData(){
    // @ts-ignore
    const params = new HttpParams().set('fiscalCode', "CC58695")

    await lastValueFrom(this.http.get<any>(`${environment.apiUrl}/api/v1/user`, {params}).pipe(map(data => {
      console.log(data);
      this.user = new User(data.fiscalCode, data.name, data.surname);
    })));
    
    await lastValueFrom(this.http.get<any>(`${environment.apiUrl}/api/v1/personal`, {params}).pipe(map(data => {
      console.log(data);
      this.personal = new Personal(data.fiscalCode, data.birthYear, data.residenceRegion);
    })));
    
    await lastValueFrom(this.http.get<any>(`${environment.apiUrl}/api/v1/economic`, {params}).pipe(map(data => {
      this.economic = new Economic(data.fiscalCode, data.ISEE);
    })));
    
    await lastValueFrom(this.http.get<any>(`${environment.apiUrl}/api/v1/university`, {params}).pipe(map(data => {
      this.uni = new Uni(data.fiscalCode, data.credits, data.averageRating, data.offCourse);
    })));

    this.info = "User information: fiscalCode => " + this.user?.fiscalCode + ", name => " + this.user?.name + ", surname => " + this.user?.surname + " <br> ";
    this.info += "Personal information: birthYear => " + this.personal?.birthYear + ", region of residence => " + this.personal?.residenceRegion + "<br>";
    this.info += "Economic information: ISEE => " + this.economic?.ISEE + "<br>";
    this.info += "University career information: credits => " + this.uni?.credits + ", average rating => " + this.uni?.averageRating + ", off-course => " + this.uni?.offCourse;
  }
}

class User {
  fiscalCode: String;
  name: String;
	surname: String;
  
  constructor(fiscalCode: string, name: String, surname: String) {
    this.fiscalCode = fiscalCode;
    this.name = name;
    this.surname = surname;
  }
}

class Personal {
  fiscalCode: String;
  birthYear: number;
	residenceRegion: String;
  
  constructor(fiscalCode: string, birthYear: number, residenceRegion: String) {
    this.fiscalCode = fiscalCode;
    this.birthYear = birthYear
    this.residenceRegion = residenceRegion;
  }
}

class Economic {
  fiscalCode: String;
  ISEE: number
  
  constructor(fiscalCode: string, isee: number) {
    this.fiscalCode = fiscalCode;
    this.ISEE = isee;
  }
}

class Uni {
  fiscalCode: String;
  credits: number;
	averageRating: number;
	offCourse: boolean;
  
  constructor(fiscalCode: string, credits: number, averageRating: number, offCourse: boolean) {
    this.fiscalCode = fiscalCode;
    this.credits = credits
    this.averageRating = averageRating;
    this.offCourse = offCourse;
  }
}
