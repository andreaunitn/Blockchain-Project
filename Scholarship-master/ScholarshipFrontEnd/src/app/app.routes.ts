import { NgModule } from "@angular/core";
import {RouterModule, Routes } from "@angular/router";
import { HomeComponent } from "./component/home/home.component";
import { SignUpComponent } from "./component/signup/signup.component";
import { signUpGuard } from "./guards/signUpGuard.component";


// @ts-ignore
export const appRoutes: Routes =  [
  { path: "home", component: HomeComponent},
  { path: "signUp", component: SignUpComponent, canActivate: [signUpGuard]},
  { path: "", redirectTo: "home", pathMatch: "full" }
];

@NgModule({
  imports: [
    RouterModule.forRoot(appRoutes)
  ],
  exports: [RouterModule],
  providers: []
})
export class AppRoutingModule { }