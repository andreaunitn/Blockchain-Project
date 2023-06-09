import { NgModule } from '@angular/core';
import { NgbModule } from "@ng-bootstrap/ng-bootstrap";
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app.routes';
import { AppComponent } from './app.component';
import { HeaderComponent } from './component/header/header.component';
import { HomeComponent } from './component/home/home.component';
import { SignUpComponent } from './component/signup/signup.component';
import { HttpClientModule } from '@angular/common/http';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatMenuModule } from '@angular/material/menu';
import { MatButtonModule } from '@angular/material/button'
import { MatTabsModule } from '@angular/material/tabs';
import {MatDividerModule} from '@angular/material/divider';
import {MatSelectModule} from '@angular/material/select';
import {MatToolbarModule} from '@angular/material/toolbar';
import {MatExpansionModule} from '@angular/material/expansion';
import {MatRadioModule} from '@angular/material/radio'; 
import {MatCheckboxModule} from '@angular/material/checkbox';
import {ScrollingModule} from '@angular/cdk/scrolling';
import {MatInputModule} from '@angular/material/input';
import {MatListModule} from '@angular/material/list';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatDatepickerModule} from '@angular/material/datepicker';
import {MatIcon, MatIconModule} from '@angular/material/icon';
import {MatNativeDateModule} from '@angular/material/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations'
import { CallAdminComponent } from './component/callAdmin/callAdmin.component';
import { AdminLoginComponent } from './component/adminLogin/adminLogin.component';
import { RequestCallByUserComponent } from './component/requestCallByUser/requestCallByUser.component';
import { RankingComponent } from './component/ranking/ranking.component';

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent, HomeComponent, SignUpComponent, CallAdminComponent, AdminLoginComponent, RequestCallByUserComponent, RankingComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    NgbModule,
    MatMenuModule, MatDatepickerModule, MatNativeDateModule, MatFormFieldModule, MatInputModule, ScrollingModule, MatExpansionModule, MatRadioModule, MatIconModule, MatSelectModule, MatCheckboxModule, MatInputModule, MatButtonModule, MatTabsModule, MatToolbarModule, MatListModule, MatFormFieldModule, MatDividerModule,  MatToolbarModule, MatGridListModule,
    HttpClientModule
  ],  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
