// src/app/app.routes.ts
import { Routes } from '@angular/router';

import { TelaLoginCadastroComponent } from './telas/tela-login-cadastro/tela-login-cadastro.component';
import { TelaLoginComponent }           from './telas/tela-login/tela-login.component';
import { TelaCadastroComponent }        from './telas/tela-cadastro/tela-cadastro.component';
import { TelaEsperaValidacaoComponent } from './telas/tela-espera-validacao/tela-espera-validacao.component';
import { TelaVisaoGeralComponent } from './telas/tela-visao-geral/tela-visao-geral.component';

export const routes: Routes = [
  { path: '',         component: TelaLoginCadastroComponent },
  { path: 'login',    component: TelaLoginComponent },
  { path: 'cadastro', component: TelaCadastroComponent },
  { path: 'espera-validacao', component: TelaEsperaValidacaoComponent },
  { path: 'visao-geral',    component: TelaVisaoGeralComponent },
  { path: '**',       redirectTo: '' }
];
