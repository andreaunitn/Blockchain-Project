import { NgModule } from "@angular/core";
import {RouterModule, Routes } from "@angular/router";
import { AccountComponent } from "./account/account.component";
import { SignUpComponent } from "./signUp/signUp.component";
import { userLoggedGuard } from "./guards/userLoggedGuard.component";
import { ScholarshipRequestComponent } from "./scholarshipRequest/scholarshipRequest.component";
import { adminGuard } from "./guards/adminGuard.component";


// @ts-ignore
export const appRoutes: Routes =  [
  { path: "signUp", component: SignUpComponent },
  { path: "account", component: AccountComponent, canActivate: [userLoggedGuard] },
  { path: "scholarshipRequest", component: ScholarshipRequestComponent},
  { path: "", redirectTo: "scholarshipRequest", pathMatch: "full" }
];

@NgModule({
  imports: [
    RouterModule.forRoot(appRoutes)
  ],
  exports: [RouterModule],
  providers: [userLoggedGuard, adminGuard]
})
export class AppRoutingModule { }