import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CepService } from '../../../services/cep.service';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr'; // Importando o ToastrService

@Component({
  selector: 'app-cep-alterar',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './cep-alterar.component.html',
  styleUrls: ['./cep-alterar.component.scss'],
})
export class CepAlterarComponent {
  cep: string = '';
  cepData: any = {
    dsCep: '',
    dsLogradouro: '',
    dsBairro: '',
    dsEstado: '',
    nrDdd: '',
  };
  mensagemErro: string = '';

  constructor(
    private route: ActivatedRoute,
    private cepService: CepService,
    private toastr: ToastrService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.cep = this.route.snapshot.paramMap.get('cep') || '';
    if (this.cep) {
      this.carregarCep();
    }
  }

  carregarCep(): void {
    this.cepService.consultarCepPorBackend(this.cep).subscribe({
      next: (dadosCep) => {
        if (dadosCep) {
          this.cepData = {
            dsCep: dadosCep.dsCep,
            dsLogradouro: dadosCep.dsLogradouro,
            dsBairro: dadosCep.dsBairro,
            dsEstado: dadosCep.dsEstado,
            nrDdd: dadosCep.nrDdd,
          };
        } else {
          this.toastr.error('CEP não encontrado.', 'Erro');
        }
      },
      error: (err) => {
        this.toastr.error('Erro ao carregar o CEP.', 'Erro');
      },
    });
  }

  editarCep(): void {
    if (
      !this.cepData.dsLogradouro ||
      !this.cepData.dsBairro ||
      !this.cepData.dsEstado ||
      !this.cepData.nrDdd
    ) {
      this.toastr.warning('Todos os campos são obrigatórios.', 'Aviso');
      return;
    }

    const dddValido =
      /^\d{2}$/.test(this.cepData.nrDdd) && !isNaN(Number(this.cepData.nrDdd));
    if (!dddValido) {
      this.toastr.warning(
        'O DDD deve ser composto por exatamente 2 números.',
        'Aviso'
      );
      return;
    }

    const estadoValido = /^[A-Za-z]{2}$/.test(this.cepData.dsEstado);
    if (!estadoValido) {
      this.toastr.warning(
        'O estado deve ter exatamente 2 caracteres.',
        'Aviso'
      );
      return;
    }

    const updatedCepData = {
      dsLogradouro: this.cepData.dsLogradouro,
      dsBairro: this.cepData.dsBairro,
      dsEstado: this.cepData.dsEstado,
      nrDdd: this.cepData.nrDdd,
    };
    this.cepService.atualizarCep(this.cep, updatedCepData).subscribe({
      next: (cepAtualizado) => {
        this.toastr.success(
          'CEP atualizado com sucesso! Retornando a tela inicial',
          'Sucesso'
        );

        setTimeout(() => {
          this.router.navigate(['/principal']);
        }, 1500);
      },
      error: (err) => {
        this.toastr.error('Erro ao atualizar o CEP. Tente novamente.', 'Erro');
      },
    });
  }
  voltarPagina(): void {
    this.router.navigate(['/principal']);
  }
}
