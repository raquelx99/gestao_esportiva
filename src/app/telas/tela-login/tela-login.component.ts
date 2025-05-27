import { Component }      from '@angular/core';
import { FormsModule }     from '@angular/forms';
import { RouterModule, Router } from '@angular/router';
import { AuthService }     from '../../services/auth.service'

@Component({
  selector: 'app-tela-login',
  standalone: true,
  imports: [FormsModule, RouterModule],
  templateUrl: './tela-login.component.html',
  styleUrls: ['./tela-login.component.css']
})
export class TelaLoginComponent {
  username = '';
  password = '';

  constructor(
    private auth: AuthService,
    private router: Router
  ) {}

  onSubmit() {
    this.auth.loginDummy(this.username, this.password);
    this.router.navigate(['/visao-geral']);
  }
}
