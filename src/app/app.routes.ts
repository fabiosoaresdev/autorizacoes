import { Component, NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { MainComponent } from './main/main.component';
import { CadastroEmpresaComponent } from './cadastro-empresa/cadastro-empresa.component';
import { CadastroColaboradorComponent } from './cadastro-colaborador/cadastro-colaborador.component';

export const routes: Routes = [
    {path: 'login', component: LoginComponent},
    {path: '', redirectTo: '/login', pathMatch: 'full'},
    {path: 'home', component: MainComponent},
    {path: 'cadastro-empresa', component: CadastroEmpresaComponent},
    {path: 'cadastro-colaborador', component: CadastroColaboradorComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}
