import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CadastroEmpresaService {

  constructor(private http: HttpClient) {}

  private apiUrl = "http://177.223.178.227:3000"

  cadastrarEmpresa(nome:string): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/api/empresas`, {nome})
  }
}
