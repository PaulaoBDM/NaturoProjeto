import { Component } from '@angular/core';
import { CepFormatDirective } from '../cep-format.directive';

@Component({
  selector: 'app-principal',
  standalone: true,
  imports: [CepFormatDirective],
  templateUrl: './principal.component.html',
  styleUrl: './principal.component.scss'
})
export class PrincipalComponent {

}
