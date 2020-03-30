import { Component, OnInit } from "@angular/core";
import { Router, ActivatedRoute } from "@angular/router";
import { OpenIdService } from "../service/openId.service";

@Component({
  selector: "app-navigate",
  templateUrl: "./navigate.component.html",
  styleUrls: ["./navigate.component.css"]
})
export class NavigateComponent implements OnInit {
  authenticationCode;
  idToken;
  isValid = false;
  oidc_redirect_path;

  constructor(
    private openId: OpenIdService,
    private activatedRoute: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit() {
    this.activatedRoute.queryParamMap.subscribe(queryParam => {
      this.authenticationCode = queryParam.get("code");
      this.oidc_redirect_path = this.openId.redirect_page_to_oidc;
    });
    this.router.navigate(["/"]).then(result => {
      console.log("oidc_redirect_path: 28",this.oidc_redirect_path)
      window.location.href = this.oidc_redirect_path;
      console.log("oidc_redirect_path: 30",this.oidc_redirect_path)
    });
  }
}
