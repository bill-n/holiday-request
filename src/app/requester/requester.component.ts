import { Component, OnInit } from "@angular/core";
import { MatTableDataSource } from "@angular/material";
import { ActivatedRoute } from "@angular/router";
import { OpenIdService } from "../service/openId.service";
import { validateHorizontalPosition } from "@angular/cdk/overlay";
import { CookieService } from 'ngx-cookie-service';

export interface PeriodicElement {
  request_start_date: string;
  request_report_date: string;
  req_status: string;
}

@Component({
  selector: "app-requester",
  templateUrl: "./requester.component.html",
  styleUrls: ["./requester.component.css"],
})
export class RequesterComponent implements OnInit {
  idToken;
  userName: String;
  ELEMENT_DATA: PeriodicElement[];
  employee_email;
  
  constructor(
    private openId: OpenIdService,
    private activatedRoute: ActivatedRoute,
    private cookieservice: CookieService
  ) {}

  ngOnInit() {
    this.activatedRoute.queryParamMap.subscribe((queryParam) => {
      this.openId
        .postAuthenticationCodeForAccessAndIdToken(queryParam.get("code"))
        .subscribe((response) => {
          this.idToken = response.id_token;
          this.cookieservice.set("idToken", this.idToken);
          console.log("response from id token|", this.idToken);
          this.openId
            .postValidateTokeId(localStorage.getItem("idToken"))
            .subscribe((res) => {
              this.cookieservice.set("userEmail", res.decoded_token.email);
              this.cookieservice.set("l_name", res.decoded_token.family_name);
              this.cookieservice.set("f_name", res.decoded_token.given_name);
              this.employee_email = this.cookieservice.get("userEmail");
              console.log('email |', this.cookieservice.get('userEmail'));
              // console.log("my email", localStorage.getItem("userEmail"));
              this.openId
                .checkEmployeePresence(res.decoded_token.email)
                .subscribe((response) => {
                  if (response.response.length == 0) {
                    let requestData = {
                      employee_email: this.cookieservice.get("userEmail"),
                      employee_firstname: this.cookieservice.get("f_name"),
                      employee_lastname: this.cookieservice.get("l_name"),
                    };
          // this.employee_email = localStorage.getItem("userEmail");
                    this.openId
                      .addEmployee(requestData)
                      .subscribe((response_) => {
                        console.log(response_);
                        this.userName =
                        this.cookieservice.get("f_name") +
                          " " +
                          this.cookieservice.get("l_name");
                          console.log("username is ", this.userName);
                          this.cookieservice.set(
                          "employee_id",
                          response_.employee_id
                        );
                        // console.log(localStorage.getItem("employee_id"));
                      });
                  } else {
                    this.cookieservice.set(
                      "employee_id",
                      response.response[0].employee_id
                    );
                    this.userName =
                    this.cookieservice.get("f_name") +
                      " " +
                      this.cookieservice.get("l_name");
                    this.openId
                      .getAllRequestForEmployee(
                        response.response[0].employee_id
                      )
                      .subscribe((data) => {
                        this.dataSource = new MatTableDataSource(data);
                      });
                  }
                });
            });
        });
    });
    // this.employee_email = localStorage.getItem("userEmail");
  }
 
  displayedColumns: string[] = [
    "request_start_date",
    "request_report_date",
    "req_status",
  ];

  dataSource = new MatTableDataSource(this.ELEMENT_DATA);

  btnColor(req_status: string) {
    if (req_status === "DECLINED") {
      return "btn-danger";
    } else if (req_status === "APPROVED") {
      return "btn-success";
    } else {
      return "btn-lemon";
    }
  }
  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }
}
