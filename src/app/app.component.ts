import { Component } from '@angular/core';
import { RouterOutlet, RouterModule } from '@angular/router';
import { AppRoutes } from './app.routes'; 

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, RouterModule, AppRoutes],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  title = 'NarutoProjeto';
}
