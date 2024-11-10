import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LoginService {
  private apiUrl = "http://192.168.0.153:3000";
  private isAuthenticatedFlag = false;
  private isBrowser = typeof window !== 'undefined';  // Verificação se está no navegador

  constructor(private http: HttpClient) {
    if (this.isBrowser) {
      this.isAuthenticatedFlag = !!localStorage.getItem('isAuthenticated');
    }
  }

  login(username: string, password: string): Observable<any> {
    const params = new HttpParams()
      .set('usuario', username)
      .set('senha', password);

    return this.http.get<any>(`${this.apiUrl}/api/login`, { params });
  }

  isAuthenticated(): boolean {
    if (typeof window !== 'undefined') {  // Verifica se o código está sendo executado no navegador
      const token = localStorage.getItem('token');
      return !!token;  // Retorna true se o token existir, caso contrário false
    }
    return false;  // Retorna false se não estiver no navegador
  }

  setAuthentication(): void {
    this.isAuthenticatedFlag = true;
    if (this.isBrowser) {
      localStorage.setItem('isAuthenticated', 'true');
    }
  }

  logout(): void {
    this.isAuthenticatedFlag = false;
    if (this.isBrowser) {
      localStorage.removeItem('isAuthenticated');
    }
  }

  getAuthHeaders() {
    const token = localStorage.getItem('token');
    return new HttpHeaders().set('Authorization', `Bearer ${token}`);
  }
  
  getProtectedData() {
    const headers = this.getAuthHeaders();
    return this.http.get('http://192.168.0.153:3000/api/protected', { headers });
  }
  
}
