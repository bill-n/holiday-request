import { Component, OnInit, ViewChild } from "@angular/core";
import { MatTableDataSource, MatSort } from "@angular/material";
import { ActivatedRoute } from "@angular/router";
import { OpenIdService } from "../service/openId.service";
import { validateHorizontalPosition } from "@angular/cdk/overlay";

export interface PeriodicElement {
  position: number;
  requester_name: string;
  request_start_date: string;
  request_report_date: string;
  req_status: string;
}

// TO TRY MY TABLE WITH STATIC DATA
// const ELEMENT_DATA: PeriodicElement[] = [
//   {
//     position: 1,
//     requester_name: "John Papa Kwesi Erbynn",
//     request_start_date: "Wednesday, 15th, April, 2020",
//     request_report_date: "Friday, 17th April, , 2020",
//     req_status: "PENDING"
//   },
//   {
//     position: 2,
//     requester_name: "Ali Fuseini",
//     request_start_date: "Wednesday, 15th, April, 2020",
//     request_report_date: "Friday, 17th April, 2020",
//     req_status: "PENDING"
//   },
//   {
//     position: 3,
//     requester_name: "Patricia Serwaa Agyekum K.",
//     request_start_date: "Wednesday, 15th, April, 2020",
//     request_report_date: "Tuesday, 22nd April, 2020",
//     req_status: "APPROVE"
//   },
//   {
//     position: 4,
//     requester_name: "John Papa Kwesi Erbynn",
//     request_start_date: "Wednesday, 15th, April, 2020",
//     request_report_date: "Friday, 17th April, 2020",
//     req_status: "DECLINE"
//   },
//   {
//     position: 5,
//     requester_name: "John Papa Kwesi Erbynn",
//     request_start_date: "Wednesday, 15th, April, 2020",
//     request_report_date: "Friday, 17th April, 2020",
//     req_status: "DECLINE"
//   },
//   {
//     position: 6,
//     requester_name: "John Papa Kwesi Erbynn",
//     request_start_date: "Wednesday, 15th, April, 2020",
//     request_report_date: "Friday, 17th April, 2020",
//     req_status: "APPROVE"
//   },
//   {
//     position: 7,
//     requester_name: "John Papa Kwesi Erbynn",
//     request_start_date: "Wednesday, 15th, April, 2020",
//     request_report_date: "Friday, 17th April, 2020",
//     req_status: "DECLINE"
//   },
//   {
//     position: 8,
//     requester_name: "John Papa Kwesi Erbynn",
//     request_start_date: "Wednesday, 15th, April, 2020",
//     request_report_date: "Friday, 17th April, 2020",
//     req_status: "PENDING"
//   }
// ];

@Component({
  selector: "app-approver",
  templateUrl: "./approver.component.html",
  styleUrls: ["./approver.component.css"]
})
export class ApproverComponent implements OnInit {
  idToken;
  userrequest_start_date: String;
  ELEMENT_DATA: PeriodicElement[];
  // approved: boolean;
  // declined: boolean;

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
        .postAuthenticationCodeForAccessAndIdToken(queryParam.get("code"))
        .subscribe(response => {
          this.idToken = response.id_token;
          localStorage.setItem("idToken", this.idToken);
          console.log("response from id token |", this.idToken);
          this.openId
            .postValidateTokeId(localStorage.getItem("idToken"))
            .subscribe(res => {
              localStorage.setItem("userEmail", res.decoded_token.email);
              localStorage.setItem(
                "l_request_start_date",
                res.decoded_token.family_request_start_date
              );
              localStorage.setItem(
                "f_request_start_date",
                res.decoded_token.given_request_start_date
              );
              this.openId
                .checkEmployeePresence(res.decoded_token.email)
                .subscribe(response => {
                  if (response.response.length == 0) {
                    let requestData = {
                      employee_email: localStorage.getItem("userEmail"),
                      employee_firstrequest_start_date: localStorage.getItem(
                        "f_request_start_date"
                      ),
                      employee_lastrequest_start_date: localStorage.getItem(
                        "l_request_start_date"
                      )
                    };
                    this.openId
                      .addEmployee(requestData)
                      .subscribe(response_ => {
                        console.log(response_);
                        this.userrequest_start_date =
                          localStorage.getItem("f_request_start_date") +
                          " " +
                          localStorage.getItem("l_request_start_date");
                        localStorage.setItem(
                          "employee_id",
                          response_.employee_id
                        );
                        console.log(localStorage.getItem("employee_id"));
                      });
                  } else {
                    localStorage.setItem(
                      "employee_id",
                      response.response[0].employee_id
                    );
                    this.userrequest_start_date =
                      localStorage.getItem("f_request_start_date") +
                      " " +
                      localStorage.getItem("l_request_start_date");
                    this.openId
                      .getAllRequests(response.response[0].employee_id)
                      .subscribe(data => {
                        this.dataSource = new MatTableDataSource(data);
                      });
                  }
                });
            });
        });
    });
  }

  // displayedColumns: string[] = [
  //   "request_start_date",
  //   "request_report_date",
  //   "req_status"
  // ];
  // dataSource = new MatTableDataSource(this.ELEMENT_DATA);

  // TO TRY MY TABLE WITH STATIC DATA
  displayedColumns: string[] = [
    "position",
    "requester_name",
    "request_start_date",
    "request_report_date",
    "req_status"
  ];
  dataSource = new MatTableDataSource(this.ELEMENT_DATA);

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  // toggleClass(whichButton: string) {
  //   let btn = document.querySelectorAll(".btnApprove");
  // }

  // if (whichButton == "btnApprove") {
  //   return "btnApproved";
  // } else if (whichButton == "btnDecline") {
  //   return "btnDeclined";
  // }
}
