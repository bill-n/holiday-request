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
      console.log(this.oidc_redirect_path);
      console.log("********** insidopenIde auth", this.authenticationCode);

      // this.oidService._postAuthCodForAccessAndIdToken(this._authCode);
      // this.openId.postAuthenticationCodForAccessAndIdToken(this.authenticationCode).subscribe(response => {
      //   console.log(response)
      // this.idToken = response.id_token
      // })
    });
  }
}
