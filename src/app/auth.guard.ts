import { Injectable, input } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { LoginService } from './login/login.service';

@Injectable({
  providedIn: 'root',
})

export class AuthGuard implements CanActivate {
  
  constructor(private loginService: LoginService, private router: Router) {}
  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean> | Promise<boolean> | boolean {
    if (this.loginService.isAuthenticated()) {
      console.log('Usuário autenticado')
      return true;
    } else {
      this.router.navigate(['/login']);
      console.log('Usuário não autenticado, retornando ao login')
      return false;
    }
  }
}
