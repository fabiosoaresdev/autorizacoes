import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { CadastroColaboradorService } from './cadastro-colaborador.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-cadastro-colaborador',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './cadastro-colaborador.component.html',
  styleUrl: './cadastro-colaborador.component.css'
})
export class CadastroColaboradorComponent {
  colaborador = {
    nome: '',
    ocupacao: '',  // Ocupação não é obrigatório
    empresa: '',
    empresa_id: null, // Armazenar o ID da empresa selecionada
  };

  empresas: any[] = []; // Lista de empresas para preencher o combobox

  constructor(
    private router: Router,
    private cadastroColaborador: CadastroColaboradorService
  ) {}

  cadastrar() {
    // Verifica se todos os campos obrigatórios estão preenchidos
    if (this.colaborador.nome.trim() && this.colaborador.empresa_id !== null) {
      const colaboradorData = {
        nome: this.colaborador.nome,
        ocupacao: this.colaborador.ocupacao,
        empresa_id: this.colaborador.empresa_id, 
      };

      // Chama o serviço para cadastrar o colaborador
      this.cadastroColaborador.cadastrarColaborador(colaboradorData).subscribe(
        (response) => {
          console.log('Colaborador cadastrado com sucesso:', response);
          alert('Colaborador cadastrado com sucesso!');
          // Redireciona para a página inicial após sucesso
          this.router.navigate(['/home']);
        },
        (error) => {
          console.error('Erro ao cadastrar o colaborador:', error);
          alert('Erro ao cadastrar o colaborador. Tente novamente mais tarde.');
        }
      );
    } else {
      alert('Por favor, preencha todos os campos obrigatórios.');
    }
  }

  voltarAoMenu() {
    this.router.navigate(['/home']);
  }

  buscarEmpresas() {
    console.log('Input alterado para:', this.colaborador.empresa);
    if (this.colaborador.empresa.trim()) {
      this.cadastroColaborador.getEmpresas(this.colaborador.empresa).subscribe(
        (data) => {
          console.log('Empresas retornadas:', data);
          this.empresas = data;
  
          // Verifica se há uma empresa com nome exato correspondente
          const empresaCorrespondente = this.empresas.find(
            (empresa) => empresa.nome.toLowerCase() === this.colaborador.empresa.trim().toLowerCase()
          );
  
          if (empresaCorrespondente) {
            // Preenche automaticamente o ID e limpa as sugestões
            this.colaborador.empresa_id = empresaCorrespondente.id;
            this.empresas = [];
          } else {
            // Limpa o ID se não houver correspondência exata
            this.colaborador.empresa_id = null;
          }
        },
        (error) => {
          console.error('Erro ao buscar empresas', error);
        }
      );
    } else {
      this.empresas = [];
      this.colaborador.empresa_id = null;
    }
  }
  
  
  

  selecionarEmpresa(empresa: any) {
    this.colaborador.empresa = empresa.nome;  // Preenche o campo de empresa com o nome da empresa selecionada
    this.colaborador.empresa_id = empresa.id; // Armazenando o ID da empresa selecionada
    this.empresas = [];  // Limpa a lista de empresas
  }
}