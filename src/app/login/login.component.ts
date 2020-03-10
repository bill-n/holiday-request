import { Component, OnInit } from "@angular/core";
import { OpenidService } from "../service/openid.service";
import { ActivatedRoute } from "@angular/router";
import { CookieService } from "ngx-cookie-service";
import { environment } from "./../../environments/environment";

@Component({
  selector: "app-login",
  templateUrl: "./login.component.html",
  styleUrls: ["./login.component.css"]
})
export class LoginComponent implements OnInit {
  authenticationCode;
  idToken;
  isValid = false;
  oidc_redirect_path;

  constructor(
    private openId: OpenidService,
    private activatedRoute: ActivatedRoute,
    private cookieService: CookieService
  ) {}

  ngOnInit() {
    this.activatedRoute.queryParamMap.subscribe(queryParam => {
      this.authenticationCode = queryParam.get("code");
      this.oidc_redirect_path = this.openId.backend_oidc;
    });
  }
}
