import { Component, OnInit } from "@angular/core";
import { FormGroup, FormControl, FormBuilder } from "@angular/forms";
import { MatDatepickerInputEvent } from "@angular/material/datepicker";
import { OpenidService } from "../service/openid.service"
import { Requester } from './requester';

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

  regForm = new FormGroup({
    request_start_date :  new FormControl(''),
    request_report_date :  new FormControl(''),
    from :  new FormControl(localStorage.getItem("userEmail")),
    requester_id: new FormControl(localStorage.getItem("employee_id")),
    requester_name: new FormControl(localStorage.getItem("f_name") + " " + localStorage.getItem("l_name"))
  });

  addEvent(type: string, event: MatDatepickerInputEvent<Date>) {
    if (type === "start") {
      this.regForm.get("request_start_date").setValue(event.value);
      console.log(
        `${type}: ${event.value} -> ${this.regForm.get("request_start_date").value}`
      );
      console.log(` ${this.regForm.get("request_report_date").value}`);
    } else if (type === "report") {
      this.regForm.get("request_report_date").setValue(event.value);
      console.log(
        `${type}: ${event.value} -> ${this.regForm.get("request_report_date").value}`
      );
    }
  }

  startFilter = (d: Date | null): boolean => {
    const day = (d || new Date()).getDay();
    // To prevent Saturday and Sunday from being selected.
    return day !== 0 && day !== 6;
  };

  reportFilter = (d: Date | null): boolean => {
    const day = (d || new Date()).getDay();
    // To prevent Saturday and Sunday from being selected.
    return day !== 0 && day !== 6;
  };

  dateSort = "";
  time_range = new FormGroup({});

  constructor(formBuilder: FormBuilder,  private openId: OpenidService,) {
    const currentYear = new Date().getFullYear();
    this.startMinDate = new Date();
    this.startMaxDate = new Date(currentYear, 11, 31);
    this.reportMinDate = new Date();
    this.reportMaxDate = new Date(currentYear, 11, 31);
  }

  ngOnInit() {}

  onSubmit() {
    console.log(this.regForm.value)
    this.openId.makeAholidayRequest(this.regForm.value).subscribe(date => console.log(date))
  }
}