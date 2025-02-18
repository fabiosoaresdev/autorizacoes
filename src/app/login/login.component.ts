import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { LoginService } from './login.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  email: string = '';
  password: string = '';

  constructor(private router: Router, private LoginService: LoginService) {}

  moverFoco() {
    setTimeout(() => {
      const passwordField = document.getElementById('password') as HTMLInputElement;
      if (passwordField) {
        passwordField.focus();
        console.log('Foco movido para a senha');
      } else {
        console.log('Campo de senha não encontrado');
      }
    }, 0); // Usa 0 para garantir que o foco aconteça depois que o evento foi processado
  }

  onLogin() {
    this.LoginService.login(this.email, this.password).subscribe({
      next: (response) => {
        if (response && response.token) {
          // Salve o token no localStorage
          localStorage.setItem('token', response.token);
          
          // Agora redirecione para a home
          this.router.navigate(['/home']).then(() => {
            console.log('Redirecionado para a home');
          }).catch(err => {
            console.error('Erro ao redirecionar:', err);
          });
        } else {
          console.error('Usuário ou senha incorretos, tente novamente.');
        }
      },
      error: (error) => {
        console.error('Erro de conexão com o servidor:', error);
      }
    });
  }  
}
