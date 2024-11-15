import { Component } from '@angular/core';
import { RouterOutlet, RouterModule } from '@angular/router';
import { AppRoutes } from './app.routes';
import { CepService } from './services/cep.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, RouterModule, AppRoutes],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  providers: [CepService],
})
export class AppComponent {
  title = 'NarutoProjeto';
}
