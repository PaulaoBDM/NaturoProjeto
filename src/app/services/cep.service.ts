import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../environments/environments';
import { Cep } from '../entities/Cep';
@Injectable({
  providedIn: 'root',
})
export class CepService {
  apiUrl = `${environment.baseUrlCep}`;
  geocodingApiUrl = 'https://maps.googleapis.com/maps/api/geocode/json';

  constructor(private http: HttpClient) {}

  consultarCep(cep: string): Observable<any> {
    return this.http.get<any>(`https://viacep.com.br/ws/${cep}/json/`);
  }

  gravarCep(cep: Cep): Observable<Cep> {
    return this.http.post<Cep>(this.apiUrl, cep);
  }
  excluirCep(cep: string): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/${cep}`);
  }
  getAllCeps(): Observable<Cep[]> {
    return this.http.get<Cep[]>(`${this.apiUrl}`);
  }
  consultarCepPorBackend(cep: string): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/detalhes-cep/${cep}`);
  }
  buscarLocalizacaoNoMapa(endereco: string, apiKey: string): Observable<any> {
    const url = `${this.geocodingApiUrl}?address=${encodeURIComponent(
      endereco
    )}&key=${apiKey}`;
    return this.http.get<any>(url);
  }
  atualizarCep(cep: string, cepData: any): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/alterar-cep/${cep}`, cepData);
  }
}
