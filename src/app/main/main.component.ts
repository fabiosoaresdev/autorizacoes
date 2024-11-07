import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule, NgModel } from '@angular/forms';
import { MainService } from '../services/main.service';

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

  constructor(private mainService: MainService) {}

  pesquisar() {
    this.mainService.getColaboradores(this.empresa, this.colaborador).subscribe(
      (data) => {
        this.colaboradores = data; // Atualiza a lista de colaboradores na tabela
      },
      (error) => {
        console.error('Erro ao buscar colaboradores', error);
      }
    );
  }
  
 
}
