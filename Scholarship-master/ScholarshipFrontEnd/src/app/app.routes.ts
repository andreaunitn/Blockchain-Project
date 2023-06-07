import { NgModule } from "@angular/core";
import {RouterModule, Routes } from "@angular/router";
import { HomeComponent } from "./component/home/home.component";


// @ts-ignore
export const appRoutes: Routes =  [
  { path: "home", component: HomeComponent},
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