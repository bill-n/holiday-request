import { Component, OnInit } from "@angular/core";

import { OpenIdService } from "../service/openId.service";

@Component({
  selector: "app-form",
  templateUrl: "./form.component.html",
  styleUrls: ["./form.component.css"],
  providers: [OpenIdService]
})
export class FormComponent implements OnInit {
  constructor(private openId: OpenIdService) {}

  ngOnInit() {}
}
