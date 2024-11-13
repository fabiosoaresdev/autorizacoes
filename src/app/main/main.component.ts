import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule, NgModel } from '@angular/forms';
import { MainService } from './main.service';
import { Router } from '@angular/router';


interface Colaborador{
  id: number,
  nome: string,
  ocupacao: string,
  empresa: string,
}

@Component({
  selector: 'app-main',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './main.component.html',
  styleUrl: './main.component.css'
})
export class MainComponent {
  colaboradores: Colaborador[] = []
  colaboradorSelecionado: any
  empresa:string = ''
  colaborador:string = ''
  isAuthenticatedFlag = true

  constructor(private mainService: MainService, private router: Router) {}

  ngOnInit(): void {
    this.pesquisar();
  }

  selecionarColaborador(colaborador: Colaborador) {
    if (this.colaboradorSelecionado === colaborador) {
      this.colaboradorSelecionado = null;
    } else {
      this.colaboradorSelecionado = colaborador;
    }
    console.log('Colaborador selecionado:', this.colaboradorSelecionado);
  }
  
  pesquisar() {
    this.mainService.getColaboradores(this.empresa, this.colaborador).subscribe(
      (data) => {
        this.colaboradores = data; 
      },
      (error) => {
        console.error('Erro ao buscar colaboradores', error);
      }
    );
  }

  navegarParaCadastroEmpresa(){
    this.router.navigate(['/cadastro-empresa'])
  }
  navegarParaCadastroColaborador() {
    this.router.navigate(['/cadastro-colaborador']);
  }

  navegarParaEditarColaborador() {
    if (this.colaboradorSelecionado) {
      // Navega para a página de edição passando o ID
      this.router.navigate(['/edicao-colaborador', this.colaboradorSelecionado.id]);
    } else {
      alert('Selecione um colaborador para editar!');
    }
  }
}  
