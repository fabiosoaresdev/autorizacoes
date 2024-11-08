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
  empresa:string = ''
  colaborador:string = ''


  ngOnInit(): void {
    this.pesquisar();
  }
  
  constructor(private mainService: MainService, private router: Router) {}

  isAuthenticatedFlag = true

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
}  
