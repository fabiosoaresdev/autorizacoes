import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';

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
  

  pesquisar(){}
}
