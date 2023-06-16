import { NgModule } from "@angular/core";
import {RouterModule, Routes } from "@angular/router";
import { HomeComponent } from "./component/home/home.component";
import { SignUpComponent } from "./component/signup/signup.component";
import { signUpGuard } from "./guards/signUpGuard.component";
import { CallAdminComponent } from "./component/callAdmin/callAdmin.component";
import { adminGuard } from "./guards/adminGuard.component";
import { AdminLoginComponent } from "./component/adminLogin/adminLogin.component";
import { RequestCallByUserComponent } from "./component/requestCallByUser/requestCallByUser.component";
import { loggedGuard } from "./guards/loggedGuard.component";


// @ts-ignore
export const appRoutes: Routes =  [
  { path: "home", component: HomeComponent},
  { path: "signUp", component: SignUpComponent, canActivate: [signUpGuard]},
  { path: "requestCallByUser", component: RequestCallByUserComponent, canActivate: [loggedGuard]},
  { path: "callAdmin", component: CallAdminComponent, canActivate: [adminGuard]},
  { path: "adminLogin", component: AdminLoginComponent},
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