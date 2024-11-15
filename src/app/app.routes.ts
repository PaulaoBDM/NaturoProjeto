import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './cors/login/login.component';
import { CadastroComponent } from './cors/cadastro/cadastro.component';
import { PrincipalComponent } from './cors/principal/principal.component';
import { CepDetalhesComponent } from './cors/principal/cep-detalhes/cep-detalhes.component';
import { CepAlterarComponent } from './cors/principal/cep-alterar/cep-alterar.component';
import { GoogleMapsModule } from '@angular/google-maps';

export const routes: Routes = [
  { path: 'autenticar', component: LoginComponent },
  { path: 'cadastrar', component: CadastroComponent },
  { path: 'principal', component: PrincipalComponent },
  { path: 'alterar-cep/:cep', component: CepAlterarComponent },
  { path: 'detalhes-cep/:cep', component: CepDetalhesComponent },
  { path: '', redirectTo: '/autenticar', pathMatch: 'full' },
];

@NgModule({
  imports: [RouterModule.forChild(routes), GoogleMapsModule],
  exports: [RouterModule],
})
export class AppRoutes {}
