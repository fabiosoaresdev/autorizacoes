import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
  email:string = ''
  password:string = ''

  constructor(private router: Router) {}

  onSubmit() {
    console.log('Email:', this.email)
    console.log('Senha:', this.password)
    this.router.navigate(['/home']);
  }
}
