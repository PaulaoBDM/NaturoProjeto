import { Injectable } from '@angular/core';
import { environment } from '../environments/environments';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class LoginService {
  baseUrl = `${environment.baseUrlLogin}/autenticar`;
  constructor(private http: HttpClient) {}

  login(dsCpf: string, dsSenha: string): Observable<boolean> {
    const body = { dsCpf, dsSenha };
    return this.http.post<boolean>(this.baseUrl, body);
  }

  logout(): void {}

  isLoggedIn(): boolean {
    return !!localStorage.getItem('isLoggedIn');
  }

  setLoginStatus(status: boolean): void {
    localStorage.setItem('isLoggedIn', JSON.stringify(status));
  }
}
