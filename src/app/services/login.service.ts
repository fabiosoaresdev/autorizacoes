import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LoginService {
  private apiUrl = "http://177.223.178.227:3000"
  constructor(private http: HttpClient) {}

  login(username: string, password: string): Observable<any> {
    const params = new HttpParams()
      .set('usuario', username)
      .set('senha', password);

    return this.http.get<any>(`${this.apiUrl}/api/login`, { params });
  }
}
