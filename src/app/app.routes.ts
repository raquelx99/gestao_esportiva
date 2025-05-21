// src/app/app.routes.ts
import { Routes } from '@angular/router';

import { TelaLoginCadastroComponent } from './tela-login-cadastro/tela-login-cadastro.component';
import { TelaLoginComponent }           from './tela-login/tela-login.component';
import { TelaCadastroComponent }        from './tela-cadastro/tela-cadastro.component';

export const routes: Routes = [
  { path: '',         component: TelaLoginCadastroComponent },
  { path: 'login',    component: TelaLoginComponent },
  { path: 'cadastro', component: TelaCadastroComponent },
  { path: '**',       redirectTo: '' }
];
