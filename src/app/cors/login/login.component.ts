import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { LoginService } from '../../services/login.service';
import { CpfFormatDirective } from '../cpf-format.directive';
import { ToastrService } from 'ngx-toastr'; 
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CpfFormatDirective, FormsModule],
  providers: [LoginService],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent {
  dsCpf: string = '';
  dsSenha: string = '';
  errorMessage: string = '';

  constructor(
    private router: Router,
    private loginService: LoginService,
    private toastr: ToastrService 
  ) {}

  private limparCpf(cpf: string): string {
    return cpf.replace(/\D/g, '');
  }

  irParaPrincipal() {
    if (!this.dsCpf || !this.dsSenha) {
      this.toastr.warning(
        'Por favor, preencha todos os campos.',
        'Campos obrigatórios'
      );
      return;
    }

    const cpfLimpo = this.limparCpf(this.dsCpf);

    this.loginService.login(cpfLimpo, this.dsSenha).subscribe({
      next: (isAuthenticated) => {
        if (isAuthenticated) {
          this.toastr.success('Login bem-sucedido!', 'Sucesso');
          setTimeout(() => {
            this.loginService.setLoginStatus(true);
            this.router.navigate(['/principal']);
          }, 1000);
        } else {
          this.toastr.error(
            'Credenciais inválidas. Por favor, tente novamente.',
            'Erro'
          );
        }
      },
      error: (error) => {
        this.errorMessage =
          'Erro ao tentar fazer login. Tente novamente mais tarde.';
        this.toastr.error(
          'Erro ao tentar fazer login. Tente novamente mais tarde.',
          'Erro'
        );
        console.error(error);
      },
    });
  }

  irParaCadastro() {
    this.router.navigate(['/cadastrar']);
  }
}
