import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { CadastroEmpresaService } from './cadastro-empresa.service';

@Component({
  selector: 'app-cadastro-empresa',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './cadastro-empresa.component.html',
  styleUrl: './cadastro-empresa.component.css'
})
export class CadastroEmpresaComponent {
  empresa = {
    nome: '',
  };

  constructor(
    private router: Router,
    private cadastroEmpresa: CadastroEmpresaService
  ) {}

  cadastrar() {
    if (this.empresa.nome.trim()) {
      this.cadastroEmpresa.cadastrarEmpresa(this.empresa.nome).subscribe(
        (response) => {
          console.log('Empresa cadastrada com sucesso:', response);
          alert(response.message); // Exibe a mensagem de sucesso
        },
        (err) => {  // Corrigido o nome de "error" para "err"
          console.error('Erro ao cadastrar a empresa:', err);
          alert('Erro ao cadastrar a empresa. Tente novamente mais tarde.');
        }
      );
    } else {
      alert('Por favor, preencha o nome da empresa.');
    }
  }

  voltarAoMenu() {
    this.router.navigate(['/home']);
  }
}
