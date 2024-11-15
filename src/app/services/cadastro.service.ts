import { Injectable } from '@angular/core';
import { environment } from '../environments/environments';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class CadastroService {
  baseUrl = `${environment.baseUrlLogin}/cadastrar`;

  constructor(private http: HttpClient) {}

  cadastro(
    dsNome: string,
    dsCpf: string,
    dsSenha: string
  ): Observable<{ status: string; message: string; user?: any }> {
    const body = { dsNome, dsCpf, dsSenha };
    return this.http.post<{ status: string; message: string; user?: any }>(
      this.baseUrl,
      body
    );
  }
}
