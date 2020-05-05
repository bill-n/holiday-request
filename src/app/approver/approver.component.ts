import { Component, OnInit, ViewChild } from "@angular/core";
import { MatTableDataSource, MatSort } from "@angular/material";
import { ActivatedRoute } from "@angular/router";
import { OpenIdService } from "../service/openId.service";
import { validateHorizontalPosition } from "@angular/cdk/overlay";

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
    private activatedRoute: ActivatedRoute
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
          localStorage.setItem("idToken", this.idToken);
          console.log("response from id token|", this.idToken);
          this.openId
            .postValidateTokeId(localStorage.getItem("idToken"))
            .subscribe(res => {
              localStorage.setItem("userEmail", res.decoded_token.email);
              localStorage.setItem("l_name", res.decoded_token.family_name);
              localStorage.setItem("f_name", res.decoded_token.given_name);
              this.employee_email = localStorage.getItem("userEmail");
              console.log("email |", localStorage.getItem("userEmail"));
              
              this.openId
                .checkEmployeePresence(res.decoded_token.email)
                .subscribe(response => {
                  if (response.response.length == 0) {
                    let requestData = {
                      employee_email: localStorage.getItem("userEmail"),
                      employee_firstname: localStorage.getItem("f_name"),
                      employee_lastname: localStorage.getItem("l_name")
                    };
            
                    this.openId
                      .addEmployee(requestData)
                      .subscribe(response_ => {
                        console.log(response_);
                        this.userName =
                          localStorage.getItem("f_name") +
                          " " +
                          localStorage.getItem("l_name");
                        localStorage.setItem(
                          "employee_id",
                          response_.employee_id
                        );
              
                      });
                  } else {
                    localStorage.setItem(
                      "employee_id",
                      response.response[0].employee_id
                    );
                    this.userName =
                      localStorage.getItem("f_name") +
                      " " +
                      localStorage.getItem("l_name");
                    this.openId.getAllRequests().subscribe(data => {
                      this.dataSource = new MatTableDataSource(data);
                    });
                  }
                });
            });
        });
    });
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