import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { CpfFormatDirective } from '../cpf-format.directive';
@Component({
  selector: 'app-login',
  standalone: true,
  imports : [CpfFormatDirective],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {
  constructor(private router: Router) {}

  
  irParaCadastro() {
    this.router.navigate(['/cadastro']);
  }
  irParaPrincipal() {
    this.router.navigate(['/principal']);
  }
}
