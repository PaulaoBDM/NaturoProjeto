import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { CadastroService } from '../../services/cadastro.service';
import { CpfFormatDirective } from '../cpf-format.directive';
import { FormsModule } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-cadastro',
  standalone: true,
  imports: [CpfFormatDirective, FormsModule],
  templateUrl: './cadastro.component.html',
  styleUrls: ['./cadastro.component.scss'],
})
export class CadastroComponent {
  dsNome: string = '';
  dsCpf: string = '';
  dsSenha: string = '';
  dsConfirmarSenha: string = '';
  errorMessage: string = '';
  successMessage: string = '';

  constructor(
    private router: Router,
    private cadastroService: CadastroService,
    private toastr: ToastrService
  ) {}

  irParaLogin() {
    this.router.navigate(['/autenticar']);
  }

  private limparCpf(cpf: string): string {
    return cpf.replace(/\D/g, '');
  }

  cadastrar() {
    if (this.dsSenha !== this.dsConfirmarSenha) {
      this.toastr.error(
        'As senhas não coincidem. Por favor, tente novamente.',
        'Erro'
      );
      return;
    }
    if (
      !this.dsNome ||
      !this.dsCpf ||
      !this.dsSenha ||
      !this.dsConfirmarSenha
    ) {
      this.toastr.warning(
        'Por favor, preencha todos os campos.',
        'Campos obrigatórios'
      );
      return;
    }

    const cpfLimpo = this.limparCpf(this.dsCpf);

    this.cadastroService
      .cadastro(this.dsNome, cpfLimpo, this.dsSenha)
      .subscribe({
        next: (response: { status: string; message: string }) => {
          if (response.status === 'success') {
            this.successMessage = response.message;
            this.toastr.success(
              'Cadastro realizado com sucesso! Retornando para o Login',
              'Sucesso'
            );
            setTimeout(() => {
              this.irParaLogin();
            }, 2000);
          } else {
            this.errorMessage = response.message;
            this.toastr.error(this.errorMessage, 'Erro');
          }
        },
        error: (error: any) => {
          this.errorMessage =
            'Erro ao tentar cadastrar. Tente novamente mais tarde.';
          this.toastr.error(this.errorMessage, 'Erro');
          console.error(error);
        },
      });
  }
}
