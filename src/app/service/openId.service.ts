import { Injectable } from "@angular/core";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { CookieService } from "ngx-cookie-service";
import { Observable } from "rxjs";
@Injectable({
  providedIn: "root"
})
export class OpenIdService {
  private holiday_request_service_url: string;
  private token_request_url: string;
  private oidc_client_id: string;
  private approver_oidc_client_id: string;
  private validateTokenUrl;
  private addUnavailableEmployeeUrl;
  private checkEmail;
  private getRequestsForEmployeeUrl;
  private getAllRequestsUrl;
  private makeRequestLink;
  private approveRequestUrl;
  private declineRequestUrl;

  approver_redirect_page_to_oidc: string;
  redirect_page_to_oidc: string;

  constructor(private http: HttpClient, private cookieservice: CookieService) {
    this.holiday_request_service_url = this.cookieservice.get(
      "holiday_request_service_url"
    );

    this.token_request_url = this.cookieservice.get("token_request_url");
    this.oidc_client_id = this.cookieservice.get("oidc_client_id");
    this.approver_oidc_client_id = this.cookieservice.get(
      "approver_oidc_client_id"
    );

    this.redirect_page_to_oidc = this.cookieservice.get(
      "redirect_page_to_oidc"
    );
    this.approver_redirect_page_to_oidc = this.cookieservice.get(
      "approver_redirect_page_to_oidc"
    );

    this.validateTokenUrl = this.holiday_request_service_url + "validate";
    this.addUnavailableEmployeeUrl =
      this.holiday_request_service_url + "addemployee";
    this.checkEmail = this.holiday_request_service_url + "verifymail/";
    this.getRequestsForEmployeeUrl =
      this.holiday_request_service_url + "request/requester/";
    this.getAllRequestsUrl = this.holiday_request_service_url + "requests";
    this.makeRequestLink = this.holiday_request_service_url + "request";
    this.approveRequestUrl =
      this.holiday_request_service_url + "requests/approve/";
    this.declineRequestUrl =
      this.holiday_request_service_url + "requests/decline/";
  }
  postAuthenticationCodeForAccessAndIdToken(
    authenticationCode: string
  ): Observable<any> {
    let headers = new HttpHeaders({
      "Content-Type": "application/x-www-form-urlencoded"
    });
    let body = "code=" + authenticationCode + this.oidc_client_id;
    return this.http.post<any>(this.token_request_url, body, {
      headers: headers
    });
  }

  postAuthenticationCodeForAccessAndIdTokenForApprover(
    authenticationCode: string
  ): Observable<any> {
    let headers = new HttpHeaders({
      "Content-Type": "application/x-www-form-urlencoded"
    });
    let body = "code=" + authenticationCode + this.approver_oidc_client_id;
    return this.http.post<any>(this.token_request_url, body, {
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
    let headers = new HttpHeaders();
    let head = headers.append("access-token", localStorage.getItem("idToken"));
    console.log("access token given |", localStorage.getItem("idToken"));
    return this.http.get<any>(this.validateTokenUrl, {
      headers: head
    });
  }

  addEmployee(requestBody: any): Observable<any> {
    let body = JSON.stringify(requestBody);
    let headers = new HttpHeaders({
      "Content-Type": "application/json",
      "access-token": localStorage.getItem("idToken")
    });

    return this.http.post<any>(this.addUnavailableEmployeeUrl, body, {
      headers: headers
    });
  }

  checkEmployeePresence(employeeEmail: String): Observable<any> {
    return this.http.get(this.checkEmail + employeeEmail);
  }

  getAllRequestForEmployee(employee_id: Number): Observable<any> {
    let headers = new HttpHeaders();
    let head = headers.append("access-token", localStorage.getItem("idToken"));
    return this.http.get(this.getRequestsForEmployeeUrl + employee_id, {
      headers: head
    });
  }

  getAllRequests(): Observable<any> {
    let headers = new HttpHeaders();
    let head = headers.append("access-token", localStorage.getItem("idToken"));
    return this.http.get(this.getAllRequestsUrl, {
      headers: head
    });
  }

  approveRequest(request_id: Number): Observable<any> {
    let headers = new HttpHeaders();
    let head = headers.append("access-token", localStorage.getItem("idToken"));
    return this.http.put(this.approveRequestUrl + request_id, {
      headers: head
    });
  }

  declineRequest(request_id: Number): Observable<any> {
    let headers = new HttpHeaders();
    let head = headers.append("access-token", localStorage.getItem("idToken"));
    return this.http.put(this.declineRequestUrl + request_id, { headers: head});
   
  }

  makeAholidayRequest(employeInfo: any): Observable<any> {
    return this.http.post(this.makeRequestLink, employeInfo);
  }
}
