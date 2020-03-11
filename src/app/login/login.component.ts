import { Component, OnInit } from "@angular/core";
import { OpenIdService } from "../service/openId.service";
import { ActivatedRoute } from "@angular/router";
import { CookieService } from "ngx-cookie-service";

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
    private openId: OpenIdService,
    private activatedRoute: ActivatedRoute,
    private cookieService: CookieService
  ) {}

  ngOnInit() {
    this.activatedRoute.queryParamMap.subscribe(queryParam => {
      this.authenticationCode = queryParam.get("code");
      this.oidc_redirect_path = this.openId.redirect_page_to_oidc;
    });
  }
}
