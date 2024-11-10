import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { catchError, of } from 'rxjs'; // Importando catchError e of para tratar erros

// Interface Empresa fora da classe
export interface Empresa {
  id: number;
  nome: string;
}

@Injectable({
  providedIn: 'root',
})
export class CadastroColaboradorService {
  private apiUrl = 'http://192.168.0.153:3000';

  constructor(private http: HttpClient) {}

  // Método para cadastrar o colaborador
  cadastrarColaborador(colaborador: { nome: string; ocupacao: string; empresa_id: number }): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/api/colaboradores`, colaborador);
  }

  // Método para buscar empresas
  getEmpresas(nome: string): Observable<Empresa[]> {
    let params = new HttpParams();

    if (nome) {
      params = params.set('nome', nome); // Adicionando o parâmetro nome à requisição
    }

    return this.http.get<Empresa[]>(`${this.apiUrl}/api/empresas`, { params }).pipe(
      catchError((err) => {
        console.error('Erro ao buscar empresas:', err);
        return of([]); // Retorna uma lista vazia em caso de erro
      })
    );
  }
}
