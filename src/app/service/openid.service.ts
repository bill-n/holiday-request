import { Injectable } from "@angular/core";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { HttpClientModule } from "@angular/common/http";
import { Requester } from "../form/requester";
import { CookieService } from "ngx-cookie-service";
import { Observable } from "rxjs";
@Injectable({
  providedIn: "root"
})
export class OpenidService {
  private holidayRequestUrl: string;
  private _tokenRequestUrl: string;
  private oidc_url: string;
  private validateTokenUrl;
  private addUnavailableEmployeeUrl;
  private checkEmail;
  private getRequestsForEmployeeUrl;
  private makeRequestLink;

  backend_oidc: string;

  constructor(private http: HttpClient, private cookieservice: CookieService) {
    this.holidayRequestUrl = this.cookieservice.get("backend_url");
    this._tokenRequestUrl = this.cookieservice.get("tokenurl");
    this.oidc_url = this.cookieservice.get("oidc");
    this.backend_oidc = this.cookieservice.get("oidc_redirect");

    this.validateTokenUrl = this.holidayRequestUrl + "validate";
    this.addUnavailableEmployeeUrl = this.holidayRequestUrl + "addemployee";
    this.checkEmail = this.holidayRequestUrl + "verifymail/";
    this.getRequestsForEmployeeUrl =
      this.holidayRequestUrl + "request/requester/";
    this.makeRequestLink = this.holidayRequestUrl + "request";

    console.log(this.holidayRequestUrl);
    console.log(this.validateTokenUrl);
    console.log(this.backend_oidc);
  }
  postAuthenticationCodForAccessAndIdToken(
    authenticationCode: string
  ): Observable<any> {
    let headers = new HttpHeaders({
      "Content-Type": "application/x-www-form-urlencoded"
    });
    let body = "code=" + authenticationCode + this.oidc_url;
    return this.http.post<any>(this._tokenRequestUrl, body, {
      headers: headers
    });
  }

  postValidateTokeId(access_token: string): Observable<any> {
    let headers = new HttpHeaders();
    let head = headers.append("access-token", access_token);
    return this.http.post<any>(this.validateTokenUrl, new Object(), {
      headers: head
    });
  }

  getUserDetails(): Observable<any> {
    return this.http.get<any>(this.validateTokenUrl);
  }

  addEmployee(requestBody: any): Observable<any> {
    let body = JSON.stringify(requestBody);
    let headers = new HttpHeaders({ "Content-Type": "application/json" });

    return this.http.post<any>(this.addUnavailableEmployeeUrl, body, {
      headers: headers
    });
  }
  checkEmployeePresence(employeeEmail: String): Observable<any> {
    return this.http.get(this.checkEmail + employeeEmail);
  }

  getAllRequestForEmployee(employee_id: Number): Observable<any> {
    return this.http.get(this.getRequestsForEmployeeUrl + employee_id);
  }
  makeAholidayRequest(employeInfo: any): Observable<any> {
    return this.http.post(this.makeRequestLink, employeInfo);
  }
  getopenID(): Observable<any> {
    return this.http.get<any>(this.backend_oidc);
  }
}
