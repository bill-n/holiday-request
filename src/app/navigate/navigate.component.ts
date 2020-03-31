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
      alert(this.oidc_redirect_path);

      this.router.navigate(["/"]).then(result => {
        window.location.href =
          "https://accounts.google.com/o/oauth2/v2/auth?scope=openid%20email&access_type=offline&include_granted_scopes=true&state=state_parameter_passthrough_value&redirect_uri=https://holiday-request.herokuapp.com/requester&response_type=code&client_id=859455735473-bgmqqco3q588kgaog0g2k0fmnur5qvf9.apps.googleusercontent.com&hd=turntabl.io&prompt=consent";
      });
    });
  }
}
