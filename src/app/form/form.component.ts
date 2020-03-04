import { Component, OnInit, AfterViewInit, ViewChild } from "@angular/core";
import { FormGroup, FormControl, FormBuilder } from "@angular/forms";
import { MatDatepickerInputEvent } from "@angular/material/datepicker";

import { MakingRequest } from "../makingRequest";
import { DaterangepickerConfig } from "ng2-daterangepicker";
import { DaterangepickerComponent } from "ng2-daterangepicker";

@Component({
  selector: "app-form",
  templateUrl: "./form.component.html",
  styleUrls: ["./form.component.css"]
})
export class FormComponent implements OnInit {
  startMinDate: Date;
  startMaxDate: Date;
  reportMinDate: Date;
  reportMaxDate: Date;
  startDateSet: Boolean;

  form: FormGroup;
  inlineRange;

  requestDetails = new MakingRequest();
  userEmail = "";
  msgShow: boolean = false;
  validSelection: boolean = false;
  message: string =
    "Invalid selection! Please refresh the page and make a valid selection!";

  private picker: DaterangepickerComponent;

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

  constructor(
    formBuilder: FormBuilder,
    private daterangepickerOptions: DaterangepickerConfig
  ) {
    const currentYear = new Date().getFullYear();
    this.startMinDate = new Date();
    this.startMaxDate = new Date(currentYear, 11, 31);
    this.reportMinDate = new Date();
    this.reportMaxDate = new Date(currentYear, 11, 31);
  }
  inlineRangeChange($event) {
    this.inlineRange = $event;
  }
  ngOnInit() {}

  onSubmit() {
    this.msgShow = true;
    // alert(
    //   "Thanks for submitting! Data: " + JSON.stringify(this.requestDetails)
    // );
  }
}
