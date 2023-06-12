import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['../assets/styles/myStyle.scss']
})
export class AppComponent {
  title = 'ScholarshipFrontEnd';

  constructor(){
    sessionStorage.removeItem("address");
    sessionStorage.removeItem("fiscalCode");
  }
}
