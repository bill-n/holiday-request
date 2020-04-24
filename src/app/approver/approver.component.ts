import { Component, OnInit, ViewChild } from "@angular/core";
import { MatTableDataSource, MatSort } from "@angular/material";
import { ActivatedRoute } from "@angular/router";
import { OpenIdService } from "../service/openId.service";
import { validateHorizontalPosition } from "@angular/cdk/overlay";
import { CookieService } from 'ngx-cookie-service';

export interface PeriodicElement {
  employee_email: string;
  request_start_date: string;
  request_report_date: string;
  req_status: string;
  request_id: number;
}

@Component({
  selector: "app-approver",
  templateUrl: "./approver.component.html",
  styleUrls: ["./approver.component.css"]
})
export class ApproverComponent implements OnInit {
  idToken;
  userName: String;
  userrequest_start_date: String;
  ELEMENT_DATA: PeriodicElement[];
  employee_email;
  // approved: boolean;
  // declined: boolean;
  // service: OpenIdService;

  constructor(
    private openId: OpenIdService,
    private activatedRoute: ActivatedRoute,
    private cookieService: CookieService
  ) {}

  @ViewChild(MatSort, { static: true }) sort: MatSort;

  ngAfterViewInit(): void {
    this.dataSource.sort = this.sort;
  }

  ngOnInit() {
    this.activatedRoute.queryParamMap.subscribe(queryParam => {
      this.openId
        .postAuthenticationCodeForAccessAndIdTokenForApprover(
          queryParam.get("code")
        )
        .subscribe(response => {
          this.idToken = response.id_token;
          this.cookieService.set("idToken", this.idToken);
          console.log("response from id token|", this.idToken);
          this.openId
            .postValidateTokeId(localStorage.getItem("idToken"))
            .subscribe(res => {
              this.cookieService.set("userEmail", res.decoded_token.email);
              this.cookieService.set("l_name", res.decoded_token.family_name);
              this.cookieService.set("f_name", res.decoded_token.given_name);
              this.employee_email = this.cookieService.get("userEmail");
              console.log("email |", this.cookieService.get("userEmail"));
              // console.log("my email", localStorage.getItem("userEmail"));
              this.openId
                .checkEmployeePresence(res.decoded_token.email)
                .subscribe(response => {
                  if (response.response.length == 0) {
                    let requestData = {
                      employee_email: this.cookieService.get("userEmail"),
                      employee_firstname: this.cookieService.get("f_name"),
                      employee_lastname: this.cookieService.get("l_name")
                    };
                    // this.employee_email = localStorage.getItem("userEmail");
                    this.openId
                      .addEmployee(requestData)
                      .subscribe(response_ => {
                        console.log(response_);
                        this.userName =
                        this.cookieService.get("f_name") +
                          " " +
                          this.cookieService.get("l_name");
                          this.cookieService.set(
                          "employee_id",
                          response_.employee_id
                        );
                        // console.log(localStorage.getItem("employee_id"));
                      });
                  } else {
                    this.cookieService.set(
                      "employee_id",
                      response.response[0].employee_id
                    );
                    this.userName =
                    this.cookieService.get("f_name") +
                      " " +
                      this.cookieService.get("l_name");
                    this.openId.getAllRequests().subscribe(data => {
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
    "employee_email",
    "request_start_date",
    "request_report_date",
    "req_status"
  ];

  dataSource = new MatTableDataSource(this.ELEMENT_DATA);

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }
  toApproveRequest(request_id: number) {
    this.openId.approveRequest(request_id).subscribe(response=> console.log=(response));
  }

  toDeclineRequest(request_id: number){
    this.openId.declineRequest(request_id).subscribe(response=> console.log=(response));
  }

}