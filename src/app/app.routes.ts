import { Routes } from '@angular/router';

// Telas Iniciais / Login / Cadastro / Status
import { TelaLoginCadastroComponent } from './telas/tela-login-cadastro/tela-login-cadastro.component';
import { TelaLoginComponent } from './telas/tela-login/tela-login.component';
import { TelaCadastroComponent } from './telas/tela-cadastro/tela-cadastro.component';
import { TelaEsperaValidacaoComponent } from './telas/tela-espera-validacao/tela-espera-validacao.component';

// Telas de Aluno
import { TelaNotificacoesAlunoComponent } from './telas/aluno/tela-notificacoes-aluno/tela-notificacoes-aluno.component';
import { TelaVisaoGeralComponent } from './telas/tela-visao-geral/tela-visao-geral.component'; // <--- DA COLEGA
// ... Outros imports de aluno ...

// Telas de Funcionário
import { TelaPrincipalFuncionarioComponent } from './telas/funcionario/tela-principal-funcionario/tela-principal-funcionario.component';
import { VisaoGeralFuncionarioComponent } from './telas/funcionario/visao-geral-funcionario/visao-geral-funcionario.component';
import { ValidarCarteirasComponent } from './telas/funcionario/validar-carteiras/validar-carteiras.component';
import { CarteirasAtivasComponent } from './telas/funcionario/carteiras-ativas/carteiras-ativas.component';
import { HorariosComponent } from './telas/funcionario/horarios/horarios.component';
import { PreviewCarteiraValidacaoComponent } from './telas/funcionario/preview-carteira-validacao/preview-carteira-validacao.component';
import { ConfirmacaoValidacaoComponent } from './telas/funcionario/confirmacao-validacao/confirmacao-validacao.component';

export const routes: Routes = [
  // --- Rotas Iniciais ---
  { path: '', redirectTo: 'boas-vindas', pathMatch: 'full' },
  { path: 'boas-vindas', component: TelaLoginCadastroComponent },
  { path: 'login', component: TelaLoginComponent },
  { path: 'cadastro', component: TelaCadastroComponent },
  { path: 'espera-validacao', component: TelaEsperaValidacaoComponent },

  // --- Rotas de Aluno ---
  { path: 'visao-geral', component: TelaVisaoGeralComponent },
  { path: 'notificacoes', component: TelaNotificacoesAlunoComponent },
  // ... Outras rotas de aluno ...

  // --- Rotas de Funcionário ---
  {
  path: 'funcionario',
  component: TelaPrincipalFuncionarioComponent,
  children: [
    { path: '', component: VisaoGeralFuncionarioComponent, pathMatch: 'full' },
    { path: 'validar-carteiras', component: ValidarCarteirasComponent },
    { path: 'carteiras-ativas', component: CarteirasAtivasComponent },
    { path: 'horarios', component: HorariosComponent },
    { path: 'validar-carteiras/:id', component: PreviewCarteiraValidacaoComponent },
    { path: 'validacao-resultado', component: ConfirmacaoValidacaoComponent },
  ]
},

  // --- Rota Curinga ---
  { path: '**', redirectTo: 'boas-vindas' }
];