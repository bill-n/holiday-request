import { Component, OnInit } from "@angular/core";
import { FormGroup, FormControl, FormBuilder } from "@angular/forms";
import { MatDatepickerInputEvent } from "@angular/material/datepicker";
import { OpenidService } from "../service/openid.service";
import { Requester } from "./requester";
import { MakingRequest } from "../makingRequest";
import {
  DaterangepickerComponent,
  DaterangepickerConfig
} from "ng2-daterangepicker";

@Component({
  selector: "app-form",
  templateUrl: "./form.component.html",
  styleUrls: ["./form.component.css"],
  providers: [OpenidService]
})
export class FormComponent implements OnInit {
  startMinDate: Date;
  startMaxDate: Date;
  reportMinDate: Date;
  reportMaxDate: Date;
  startDateSet: Boolean;

  inlineRange;

  requestDetails = new MakingRequest();
  userEmail = "";
  msgShow: boolean = false;
  validSelection: boolean = false;
  message: string =
    "Invalid selection! Please refresh the page and make a valid selection!";

  private picker: DaterangepickerComponent;

  constructor(
    formBuilder: FormBuilder,
    private openId: OpenidService,
    private daterangepickerOptions: DaterangepickerConfig
  ) {
    const currentYear = new Date().getFullYear();
    this.startMinDate = new Date();
    this.startMaxDate = new Date(currentYear, 11, 31);
    this.reportMinDate = new Date();
    this.reportMaxDate = new Date(currentYear, 11, 31);
  }
  form = new FormGroup({
    request_start_date: new FormControl(""),
    request_report_date: new FormControl(""),
    from: new FormControl(localStorage.getItem("userEmail")),
    requester_id: new FormControl(localStorage.getItem("employee_id")),
    requester_name: new FormControl(
      localStorage.getItem("f_name") + " " + localStorage.getItem("l_name")
    )
  });

  addEvent(type: string, event: MatDatepickerInputEvent<Date>) {
    if (type === "start") {
      this.form.get("request_start_date").setValue(event.value);
      console.log(
        `${type}: ${event.value} -> ${
          this.form.get("request_start_date").value
        }`
      );
      console.log(` ${this.form.get("request_report_date").value}`);
    } else if (type === "report") {
      this.form.get("request_report_date").setValue(event.value);
      console.log(
        `${type}: ${event.value} -> ${
          this.form.get("request_report_date").value
        }`
      );
    }
  }

  public options: any = {
    locale: { format: "YYYY-MM-DD" },
    alwaysShowCalendars: false
  };
  public selectedDate(value: any) {
    this.requestDetails.startDate = value.begin;
    this.requestDetails.reportDate = value.end;
    delete this.requestDetails["begin"];
    delete this.requestDetails["end"];
    console.log(this.requestDetails);
    this.validSelection = true;
    this.message = "Request sent successfully!";
  }

  myFilter = (d: Date | null): boolean => {
    const day = (d || new Date()).getDay();
    // To prevent Saturday and Sunday from being selected.
    return day !== 0 && day !== 6;
  };

  inlineRangeChange($event) {
    this.inlineRange = $event;
  }

  ngOnInit() {}

  onSubmit() {
    console.log(this.form.value);
    this.openId
      .makeAholidayRequest(this.form.value)
      .subscribe(date => console.log(date));
    this.msgShow = true;
  }
}
