import { Injectable } from "@angular/core";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Observable } from "rxjs";
import { Requester } from "../form/requester";

@Injectable({
  providedIn: "root"
})
export class OpenidService {
  [x: string]: any;
  private _tokenRequestUrl = "https://oauth2.googleapis.com/token";
  private validateTokenUrl = "http://localhost:7070/api/v1/validate"
  private addUnavailableEmployeeUrl = "http://localhost:7070/api/v1/addemployee"
  private checkEmail = "http://localhost:7070/api/v1/verifymail/";
  private getRequestsForEmployeeUrl = "http://localhost:7070/api/v1/request/requester/";
  private makeRequestLink = "http://localhost:7070/api/v1/request"

  constructor(private http: HttpClient) {}
  postAuthenticationCodForAccessAndIdToken(
    authenticationCode: string
  ): Observable<any> {
    let headers = new HttpHeaders({
      "Content-Type": "application/x-www-form-urlencoded"
    });
    let body =
      "code=" +
      authenticationCode +
      "&client_id=859455735473-bgmqqco3q588kgaog0g2k0fmnur5qvf9.apps.googleusercontent.com&client_secret=1ivNoDawR_DQAEaVrrc90op4&redirect_uri=http://localhost:4200/home&grant_type=authorization_code&";
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
}
