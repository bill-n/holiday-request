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

// TO TRY MY TABLE WITH STATIC DATA
// const ELEMENT_DATA: PeriodicElement[] = [
//   {
//     request_id: 1,
//     employee_email: "John Papa Kwesi Erbynn",
//     request_start_date: "Wednesday, 15th, April, 2020",
//     request_report_date: "Friday, 17th April, , 2020",
//     req_status: "PENDING"
//   },
//   {
//     request_id: 2,
//     employee_email: "Ali Fuseini",
//     request_start_date: "Wednesday, 15th, April, 2020",
//     request_report_date: "Friday, 17th April, 2020",
//     req_status: "PENDING"
//   },
//   {
//     request_id: 3,
//     employee_email: "Patricia Serwaa Agyekum K.",
//     request_start_date: "Wednesday, 15th, April, 2020",
//     request_report_date: "Tuesday, 22nd April, 2020",
//     req_status: "APPROVE"
//   },
//   {
//     request_id: 4,
//     employee_email: "John Papa Kwesi Erbynn",
//     request_start_date: "Wednesday, 15th, April, 2020",
//     request_report_date: "Friday, 17th April, 2020",
//     req_status: "DECLINE"
//   },
//   {
//     request_id: 5,
//     employee_email: "John Papa Kwesi Erbynn",
//     request_start_date: "Wednesday, 15th, April, 2020",
//     request_report_date: "Friday, 17th April, 2020",
//     req_status: "DECLINE"
//   },
//   {
//     request_id: 6,
//     employee_email: "John Papa Kwesi Erbynn",
//     request_start_date: "Wednesday, 15th, April, 2020",
//     request_report_date: "Friday, 17th April, 2020",
//     req_status: "APPROVE"
//   },
//   {
//     request_id: 7,
//     employee_email: "John Papa Kwesi Erbynn",
//     request_start_date: "Wednesday, 15th, April, 2020",
//     request_report_date: "Friday, 17th April, 2020",
//     req_status: "DECLINE"
//   },
//   {
//     request_id: 8,
//     employee_email: "John Papa Kwesi Erbynn",
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
  userName: String;
  userrequest_start_date: String;
  ELEMENT_DATA: PeriodicElement[];
  employee_email;
  // approved: boolean;
  // declined: boolean;
  service: OpenIdService;

  constructor(
    private openId: OpenIdService,
    private activatedRoute: ActivatedRoute
  ) {}

  @ViewChild(MatSort, { static: true }) sort: MatSort;

  ngAfterViewInit(): void {
    this.dataSource.sort = this.sort;
  }

  ngOnInit() {
    // this.activatedRoute.queryParamMap.subscribe(queryParam => {
    //   this.openId
    //     .postAuthenticationCodeForAccessAndIdToken(queryParam.get("code"))
    //     .subscribe(response => {
    //       this.idToken = response.id_token;
    //       localStorage.setItem("idToken", this.idToken);
    //       console.log("response from id token|", this.idToken);
    //       this.openId
    //         .postValidateTokeId(localStorage.getItem("idToken"))
    //         .subscribe(res => {
    //           localStorage.setItem("userEmail", res.decoded_token.email);
    //           localStorage.setItem("l_name", res.decoded_token.family_name);
    //           localStorage.setItem("f_name", res.decoded_token.given_name);
    //           this.employee_email = localStorage.getItem("userEmail");
    //           console.log("email |", localStorage.getItem("userEmail"));
    //           this.openId
    //             .checkEmployeePresence(res.decoded_token.email)
    //             .subscribe(response => {
    //               if (response.response.length == 0) {
    //                 let requestData = {
    //                   employee_email: localStorage.getItem("userEmail"),
    //                   employee_firstname: localStorage.getItem("f_name"),
    //                   employee_lastname: localStorage.getItem("l_name")
    //                 };
    //                 this.openId
    //                   .addEmployee(requestData)
    //                   .subscribe(response_ => {
    //                     console.log(response_);
    //                     this.userName =
    //                       localStorage.getItem("f_name") +
    //                       " " +
    //                       localStorage.getItem("l_name");
    //                     console.log("username is ", this.userName);
    //                     localStorage.setItem(
    //                       "employee_id",
    //                       response_.employee_id
    //                     );
    //                   });
    //               } else {
    //                 localStorage.setItem(
    //                   "employee_id",
    //                   response.response[0].employee_id
    //                 );
    //                 this.userName =
    //                   localStorage.getItem("f_name") +
    //                   " " +
    //                   localStorage.getItem("l_name");
    //                 this.openId.getAllRequests().subscribe(data => {
    //                   this.dataSource = new MatTableDataSource(data);
    //                 });
    //               }
    //             });
    //         });
    //     });
    // });
    // this.employee_email = localStorage.getItem("userEmail");
  }

  // displayedColumns: string[] = [
  //   "request_start_date",
  //   "request_report_date",
  //   "req_status"
  // ];
  dataSource = new MatTableDataSource(this.ELEMENT_DATA);

  // TO TRY MY TABLE WITH STATIC DATA
  displayedColumns: string[] = [
    "employee_email",
    "request_start_date",
    "request_report_date",
    "req_status"
  ];
  // dataSource = new MatTableDataSource(ELEMENT_DATA);

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  toApproveRequest(request_id: number) {
    console.log(request_id);
    this.service.approveRequest(request_id);
  }

  toDeclineRequest(request_id: number) {
    console.log(request_id);
    this.service.declineRequest(request_id);
  }

  // if (whichButton == "btnApprove") {
  //   return "btnApproved";
  // } else if (whichButton == "btnDecline") {
  //   return "btnDeclined";
  // }
}
