import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CepService } from '../../../services/cep.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ToastrService } from 'ngx-toastr'; 

declare var google: any;

@Component({
  selector: 'app-detalhes-cep',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './cep-detalhes.component.html',
  styleUrls: ['./cep-detalhes.component.scss']
})
export class CepDetalhesComponent implements OnInit {
  cepData: any = {}; 
  cepId: string = ''; 
  map: any;
  marker: any;
  apiKey = 'AIzaSyC3l8ipoK88-jyIoUfD34Q9ig-NQHquxEM';  

  constructor(
    private route: ActivatedRoute, 
    private cepService: CepService,
    private toastr: ToastrService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.cepId = this.route.snapshot.paramMap.get('cep') || ''; 
    this.consultarCepDetalhes(this.cepId);
  }

  consultarCepDetalhes(cep: string): void {
    this.cepService.consultarCepPorBackend(cep).subscribe({
      next: (dados: any) => {
        this.cepData = dados;
        console.log('Dados recebidos:', this.cepData);
        
        if (dados.erro) {
          this.toastr.error('CEP não encontrado', 'Erro');
        } else {
        
          const endereco = `${dados.dsLogradouro}, ${dados.dsBairro}, ${dados.dsEstado}`;
          if (endereco) {
            this.carregarMapa(endereco); 
          } else {
            this.toastr.error('Endereço incompleto', 'Erro');
          }
        }
      },
      error: (error: any) => {
        console.error('Erro ao consultar o CEP:', error);
        this.toastr.error('Erro ao consultar o CEP', 'Erro');
      }
    });
  }
  carregarMapa(endereco: string): void {
    if (!endereco) {
      this.toastr.error('Endereço inválido', 'Erro');
      return;
    }

    if (typeof google === 'undefined' || !google.maps) {
      const script = document.createElement('script');
      script.src = `https://maps.googleapis.com/maps/api/js?key=${this.apiKey}&libraries=places`;
      script.async = true;
      script.defer = true;
      document.head.appendChild(script);
    
      script.onload = () => {
        console.log('Google Maps carregado com sucesso');
        this.iniciarMapa(endereco); 
      };

      script.onerror = (error) => {
        console.error('Erro ao carregar o Google Maps', error);
        this.toastr.error('Erro ao carregar o Google Maps', 'Erro');
      };
    } else {
      console.log('Google Maps já está carregado');
      this.iniciarMapa(endereco);  
    }
  }

  iniciarMapa(endereco: string): void {
    if (!endereco) {
      console.error('Endereço vazio ou inválido');
      this.toastr.error('Endereço inválido', 'Erro');
      return;
    }

    console.log('Endereço enviado para geocoding:', endereco); // Exibe o endereço sendo enviado

    const geocoder = new google.maps.Geocoder();

    geocoder.geocode({ address: endereco }, (results: google.maps.GeocoderResult[], status: google.maps.GeocoderStatus) => {
      if (status === 'OK' && results && results.length > 0) {
        const latLng = results[0].geometry.location;

        // Inicializa o mapa com a latitude e longitude obtidas
        this.map = new google.maps.Map(document.getElementById('map') as HTMLElement, {
          center: latLng,
          zoom: 16,
        });

        // Adiciona o marcador
        this.adicionarMarcador(latLng);
      } else if (status === 'ZERO_RESULTS') {
        console.error('Não foi possível encontrar a localização para o endereço:', endereco);
        this.toastr.error('Não foi possível encontrar o endereço no mapa', 'Erro');
      } else {
        console.error('Erro ao buscar a localização do endereço:', status);
        this.toastr.error('Erro ao buscar a localização do endereço', 'Erro');
      }
    });
  }

  adicionarMarcador(latLng: any): void {
    if (this.marker) {
      this.marker.setMap(null);  
    }

    this.marker = new google.maps.Marker({
      position: latLng,
      map: this.map,
      title: 'Localização do CEP'
    });
  }
  voltarPagina(): void {
    this.router.navigate(['/principal']); 
  }
}
