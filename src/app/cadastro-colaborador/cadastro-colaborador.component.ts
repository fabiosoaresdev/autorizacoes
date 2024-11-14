import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';  // Importando ActivatedRoute
import { CadastroColaboradorService } from './cadastro-colaborador.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-cadastro-colaborador',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './cadastro-colaborador.component.html',
  styleUrls: ['./cadastro-colaborador.component.css']
})
export class CadastroColaboradorComponent implements OnInit {
  colaborador = {
    id: null as number | null,  // Pode ser null ou number
    nome: '',
    ocupacao: '', 
    empresa: '',
    empresa_id: null as number | null, // Pode ser null ou number
  };

  modoEdicao: boolean = false;
  mostrarEmpresasSugeridas: boolean = false;
  mostrarModalExclusao: boolean = false;
  mostrarBotaoExcluir: boolean = false;
  mostrarBotaoCadastroEmpresa: boolean = true;
  empresas: any[] = [];

  constructor(
    private router: Router,
    private cadastroColaborador: CadastroColaboradorService,
    private activatedRoute: ActivatedRoute 
  ) {}

  ngOnInit() {
    this.loadEmpresas();

    const id = this.activatedRoute.snapshot.paramMap.get('id');
    if (id) {
      this.modoEdicao = true;
      this.mostrarBotaoExcluir = true;
      this.mostrarBotaoCadastroEmpresa = false;
      this.loadColaborador(id); 
    }
  }

  loadEmpresas() {
    this.cadastroColaborador.getEmpresas('').subscribe(
      (data) => {
        this.empresas = data;
        console.log('Empresas carregadas:', this.empresas); 
      },
      (error) => {
        console.error('Erro ao carregar empresas:', error);
      }
    );
  }

  loadColaborador(id: string) {
    this.cadastroColaborador.getColaboradorById(id).subscribe(
      (data) => {
        this.colaborador = data;

        console.log('Colaborador carregado:', this.colaborador); 
        if (this.colaborador.empresa_id && this.empresas.length > 0) {
          const empresa = this.empresas.find(empresa => empresa.id === this.colaborador.empresa_id);
          if (empresa) {
            this.colaborador.empresa = empresa.nome; 
            console.log('Nome da empresa encontrado:', empresa.nome); 
          }
        }
      },
      (error) => {
        console.error('Erro ao carregar colaborador:', error);
      }
    );
  }

  cadastrar() {
    if (!this.modoEdicao) {
      // Cadastro de novo colaborador
      if (this.colaborador.nome.trim() && this.colaborador.empresa_id !== null) {
        const colaboradorData = {
          nome: this.colaborador.nome,
          ocupacao: this.colaborador.ocupacao,
          empresa_id: this.colaborador.empresa_id, 
        };
  
        this.cadastroColaborador.cadastrarColaborador(colaboradorData).subscribe(
          (response) => {
            console.log('Colaborador cadastrado com sucesso:', response);
            alert('Colaborador cadastrado com sucesso!');
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
    } else {
      // Edição de colaborador existente
      if (this.colaborador.id !== null && this.colaborador.nome.trim() && this.colaborador.empresa_id !== null) {
        const colaboradorData = {
          nome: this.colaborador.nome,
          ocupacao: this.colaborador.ocupacao,
          empresa_id: this.colaborador.empresa_id,
        };
  
        // Convertendo id para string
        this.cadastroColaborador.editarColaborador(this.colaborador.id.toString(), colaboradorData).subscribe(
          (response) => {
            console.log('Colaborador atualizado com sucesso:', response);
            alert('Colaborador atualizado com sucesso!');
            this.router.navigate(['/home']);
          },
          (error) => {
            console.error('Erro ao atualizar o colaborador:', error);
            alert('Erro ao atualizar o colaborador. Tente novamente mais tarde.');
          }
        );
      } else {
        alert('Por favor, preencha todos os campos obrigatórios.');
      }
    }
  }
  
  voltarAoMenu() {
    this.router.navigate(['/home']);
  }

  buscarEmpresas() {
    console.log('Input alterado para:', this.colaborador.empresa);

    if (this.colaborador.empresa.trim()) {
      this.mostrarEmpresasSugeridas = true;
      this.cadastroColaborador.getEmpresas(this.colaborador.empresa).subscribe(
        (data) => {
          console.log('Empresas retornadas:', data);
          this.empresas = data;

          // Verifica se o nome completo da empresa foi digitado
          const empresaCorrespondente = this.empresas.find(
            (empresa) => empresa.nome.toLowerCase() === this.colaborador.empresa.trim().toLowerCase()
          );

          if (empresaCorrespondente) {
            this.colaborador.empresa_id = empresaCorrespondente.id;
            this.empresas = [];  // Limpa as sugestões
            this.mostrarEmpresasSugeridas = false;  // Esconde a lista de sugestões
          }
        },
        (error) => {
          console.error('Erro ao buscar empresas', error);
        }
      );
    } else {
      this.empresas = [];
      this.mostrarEmpresasSugeridas = false;  // Esconde a lista de sugestões quando o campo estiver vazio
    }
  }

  selecionarEmpresa(empresa: any) {
    this.colaborador.empresa = empresa.nome;
    this.colaborador.empresa_id = empresa.id;
    this.empresas = [];
    this.mostrarEmpresasSugeridas = false;  // Esconde a lista após seleção
  }

  // Exibe o modal de confirmação de exclusão
  validacaoDeExclusao() {
    this.mostrarModalExclusao = true;
  }

  // Fecha o modal de confirmação
  cancelarExclusao() {
    this.mostrarModalExclusao = false;
  }

  // Deleta o colaborador e fecha o modal
  deletarRegistroColaborador() {
    const id = this.colaborador.id;  // Obtém o ID do colaborador a ser excluído

    // Verifica se o id não é null antes de chamar a exclusão
    if (id !== null) {
      // Chama o método deletarColaborador passando o ID do colaborador
      this.cadastroColaborador.deletarColaborador(id).subscribe(
        (response) => {
          console.log('Colaborador excluído com sucesso:', response);

          // Atualize a interface ou redirecione, se necessário
          this.router.navigate(['/home']);
          
          // Se precisar atualizar a lista de colaboradores após a exclusão:
          this.atualizarListaColaboradores();
        },
        (error) => {
          console.error('Erro ao deletar colaborador:', error);
          alert('Erro ao excluir colaborador. Tente novamente mais tarde.');
        }
      );
    } else {
      console.error('ID do colaborador não encontrado');
    }
  }

  atualizarListaColaboradores() {
    this.cadastroColaborador.getEmpresas('').subscribe(
      (data) => {
        console.log('Lista de colaboradores atualizada:', data);
      },
      (error) => {
        console.error('Erro ao atualizar lista de colaboradores:', error);
      }
    );
  }

  cadastrarEmpresa(){
    this.router.navigate(['/cadastro-empresa'])
  }
}
