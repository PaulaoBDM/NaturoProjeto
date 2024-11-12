import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './cors/login/login.component';
import { CadastroComponent } from './cors/cadastro/cadastro.component';
import { PrincipalComponent } from './cors/principal/principal.component';

export const routes: Routes = [
  { path: '', component: LoginComponent },
  { path: 'cadastro', component: CadastroComponent },
  {path : 'principal', component : PrincipalComponent}
];

@NgModule({
  imports: [RouterModule.forChild(routes)], 
  exports: [RouterModule],
})
export class AppRoutes {}
