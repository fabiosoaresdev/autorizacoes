import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class MainService {

  private apiUrl = "http://177.223.178.227:3000"
  constructor(private http: HttpClient) {}

  getColaboradores(empresa: string, colaborador: string): Observable<any> {
    let params = new HttpParams();

    if (empresa) {
      params = params.set('empresa', empresa);
    }
    if (colaborador) {
      params = params.set('colaborador', colaborador);
    }

    return this.http.get<any>(`${this.apiUrl}/api/colaboradores-completo`, { params });
  }

  
}
