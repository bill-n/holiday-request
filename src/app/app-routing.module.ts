import { NgModule, Directive, Pipe } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";
import { RequesterComponent } from "./requester/requester.component";
import { FormComponent } from "./form/form.component";
import { LoginComponent } from './login/login.component';

const routes: Routes = [
  { path: "", redirectTo: "/login", pathMatch: "full" },
  { path: "requester", component: RequesterComponent },
  { path: "form", component: FormComponent },
  { path: "login", component: LoginComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes, {
    onSameUrlNavigation: 'reload'
  })],
  exports: [RouterModule]
})
export class AppRoutingModule {}
