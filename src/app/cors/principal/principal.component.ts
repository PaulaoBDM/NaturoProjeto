import { Component } from '@angular/core';
import { CepService } from '../../services/cep.service'; // Importando o serviço
import { ToastrService } from 'ngx-toastr';
import { FormsModule } from '@angular/forms';
import { CepFormatDirective } from '../cep-format.directive';
import { Cep } from '../../entities/Cep';
import { CommonModule } from '@angular/common';
import { LoginService } from '../../services/login.service';
import { Router, NavigationExtras } from '@angular/router';

declare var google: any;

@Component({
  selector: 'app-principal',
  standalone: true,
  imports: [FormsModule, CepFormatDirective, CommonModule],
  templateUrl: './principal.component.html',
  styleUrls: ['./principal.component.scss'],
})
export class PrincipalComponent {
  dsCep: string = '';
  dsLogradouro: string = '';
  dsBairro: string = '';
  dsEstado: string = '';
  nrDdd: string = '';

  mostrarModal: boolean = false;
  cepParaExcluir: string = '';
  cepParaConsultar: string = '';
  cepParaEditar: string = '';

  cepsCadastrados: any[] = [];
  tipoModal: string = '';

  apiKey = 'AIzaSyC3l8ipoK88-jyIoUfD34Q9ig-NQHquxEM';
  map: any;
  marker: any;
  constructor(
    private cepService: CepService,
    private toastr: ToastrService,
    private loginService: LoginService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.carregarCeps();
  }

  carregarCeps(): void {
    this.cepService.getAllCeps().subscribe({
      next: (ceps) => {
        this.cepsCadastrados = ceps;
      },
      error: (error) => {
        console.error('Erro ao carregar os CEPs', error);
        this.toastr.error('Erro ao carregar os CEPs', 'Erro');
      },
    });
  }

  logout(): void {
    this.loginService.logout();
    this.toastr.success('Você saiu com sucesso!', 'Logout');
    this.router.navigate(['/autenticar']);
  }

  limparCep(cep: string): string {
    return cep.replace(/\D/g, '');
  }

  ngAfterViewInit(): void {
    this.initMap();
  }

  initMap(): void {
    this.map = new google.maps.Map(document.getElementById('map'), {
      center: { lat: -34.397, lng: 150.644 },
      zoom: 16,
    });
  }

  buscarCep() {
    const cepLimpo = this.limparCep(this.dsCep);
    if (cepLimpo.length === 8) {
      this.cepService.consultarCep(cepLimpo).subscribe({
        next: (dados) => {
          if (dados.erro) {
            this.toastr.error('CEP não encontrado', 'Erro');
          } else {
            this.dsLogradouro = dados.logradouro;
            this.dsBairro = dados.bairro;
            this.dsEstado = dados.uf;
            this.nrDdd = dados.ddd;

            const endereco = `${dados.logradouro}, ${dados.bairro}, ${dados.uf}`;
            this.cepService
              .buscarLocalizacaoNoMapa(endereco, this.apiKey)
              .subscribe({
                next: (res) => {
                  if (res.status === 'OK' && res.results.length > 0) {
                    const latLng = res.results[0].geometry.location;
                    this.map.setCenter(latLng);
                    this.adicionarMarcador(latLng);

                    this.toastr.success(
                      'Localização do CEP no mapa!',
                      'Sucesso'
                    );
                  } else {
                    this.toastr.error(
                      'Não foi possível encontrar a localização do CEP',
                      'Erro'
                    );
                  }
                },
                error: (error) => {
                  console.error('Erro ao obter a localização do CEP:', error);
                  this.toastr.error(
                    'Erro ao tentar buscar a localização do CEP',
                    'Erro'
                  );
                },
              });
          }
        },
        error: (error) => {
          console.error('Erro ao consultar o CEP:', error);
          this.toastr.error('Erro ao tentar consultar o CEP', 'Erro');
        },
      });
    }
  }

  adicionarMarcador(latLng: any): void {
    if (this.marker) {
      this.marker.setMap(null);
    }

    this.marker = new google.maps.Marker({
      position: latLng,
      map: this.map,
      title: 'Localização do CEP',
    });
  }

  cadastrarCep() {
    if (
      !this.dsCep ||
      !this.dsLogradouro ||
      !this.dsBairro ||
      !this.dsEstado ||
      !this.nrDdd
    ) {
      this.toastr.error(
        'Por favor, preencha todos os campos obrigatórios!',
        'Erro'
      );
      return;
    }

    const cepLimpo = this.limparCep(this.dsCep);
    if (cepLimpo.length !== 8) {
      this.toastr.error(
        'CEP inválido. Por favor, insira um CEP válido!',
        'Erro'
      );
      return;
    }

    if (this.nrDdd.length !== 2) {
      this.toastr.error(
        'DDD inválido. Por favor, insira um DDD válido!',
        'Erro'
      );
      return;
    }

    const cepObj: Cep = {
      dsCep: cepLimpo,
      dsLogradouro: this.dsLogradouro,
      dsBairro: this.dsBairro,
      dsEstado: this.dsEstado,
      nrDdd: parseInt(this.nrDdd, 10),
    };

    this.cepService.gravarCep(cepObj).subscribe({
      next: (response) => {
        this.toastr.success('CEP cadastrado com sucesso!', 'Sucesso');
        this.carregarCeps();
      },
      error: (error) => {
        this.toastr.error(
          error.error.message || 'Erro ao cadastrar o CEP',
          'Erro'
        );
      },
    });
  }

  abrirModal(tipo: string) {
    this.tipoModal = tipo;
    this.mostrarModal = true;

    if (this.tipoModal === 'excluir') {
      this.cepParaExcluir = '';
    } else if (this.tipoModal === 'consultar') {
      this.cepParaConsultar = '';
    } else if (this.tipoModal === 'editar') {
      this.cepParaEditar = '';
    }
  }

  fecharModal() {
    this.mostrarModal = false;
    this.tipoModal = '';
    this.cepParaExcluir = '';
    this.cepParaConsultar = '';
    this.cepParaEditar = '';
  }

  excluirCep() {
    const cepLimpo = this.limparCep(this.cepParaExcluir);

    if (!cepLimpo) {
      this.toastr.error(
        'Por favor, insira um CEP cadastrado para excluir.',
        'Erro'
      );
      return;
    }

    this.cepService.consultarCep(cepLimpo).subscribe({
      next: (dados) => {
        if (dados.erro) {
          this.toastr.error(
            'CEP não encontrado. Não é possível excluir.',
            'Erro'
          );
          return;
        }

        this.cepService.excluirCep(cepLimpo).subscribe({
          next: () => {
            this.toastr.success('CEP excluído com sucesso!', 'Sucesso');
            this.fecharModal();
            this.carregarCeps();
          },
          error: (error) => {
            console.error('Erro ao excluir o CEP:', error);
            this.toastr.error('Erro ao excluir o CEP', 'Erro');
            this.fecharModal();
          },
        });
      },
      error: (error) => {
        console.error('Erro ao excluir o CEP:', error);
        this.toastr.error('Erro ao tentar excluir o CEP', 'Erro');
      },
    });
  }

  consultarCep() {
    const cepLimpo = this.limparCep(this.cepParaConsultar);

    if (!cepLimpo) {
      this.toastr.error('Por favor, insira um CEP para consultar.', 'Erro');
      return;
    }

    this.cepService.consultarCepPorBackend(cepLimpo).subscribe({
      next: (dados) => {
        if (dados.erro) {
          this.toastr.error('CEP não encontrado.', 'Erro');
          return;
        }

        this.toastr.success('CEP encontrado com sucesso!', 'Sucesso');
        this.fecharModal();
        this.router.navigate(['/detalhes-cep', cepLimpo]);
      },
      error: (error) => {
        console.error('Erro ao consultar o CEP:', error);
        this.toastr.error('Erro ao tentar consultar o CEP', 'Erro');
      },
    });
  }

  editarCep() {
    const cepLimpo = this.limparCep(this.cepParaEditar);

    if (!cepLimpo) {
      this.toastr.error('Por favor, insira um CEP para Editar.', 'Erro');
      return;
    }

    this.cepService.consultarCepPorBackend(cepLimpo).subscribe({
      next: (dados) => {
        if (dados.erro) {
          this.toastr.error('CEP não encontrado.', 'Erro');
          return;
        }

        this.toastr.success('CEP encontrado com sucesso!', 'Sucesso');
        this.fecharModal();
        this.router.navigate(['/alterar-cep', cepLimpo]);
      },
      error: (error) => {
        console.error('Erro ao consultar o CEP:', error);
        this.toastr.error('Erro ao tentar consultar o CEP', 'Erro');
      },
    });
  }
}
