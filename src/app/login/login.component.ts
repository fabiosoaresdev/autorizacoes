import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../auth.service';
import { HttpClientModule } from '@angular/common/http'; // Importe HttpClientModule aqui

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule, HttpClientModule],  // Adicione o HttpClientModule aqui
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  email: string = '';
  password: string = '';

  constructor(private router: Router, private authService: AuthService) {}

  onLogin() {
    this.authService.login(this.email, this.password).subscribe({
      next: (response) => {
        if (response && response.length > 0) {
          this.router.navigate(['/home']);
        } else {
          console.error('Usuário ou senha incorretos, tente novamente.');
        }
      },
      error: (error) => {
        console.error('Erro de conexão com o servidor');
      }
    });
  }
}
