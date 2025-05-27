import { Routes } from '@angular/router';

// Telas Iniciais / Login / Cadastro / Status
import { TelaLoginCadastroComponent } from './telas/tela-login-cadastro/tela-login-cadastro.component';
import { TelaLoginComponent } from './telas/tela-login/tela-login.component';
import { TelaCadastroComponent } from './telas/tela-cadastro/tela-cadastro.component';
import { TelaEsperaValidacaoComponent } from './telas/tela-espera-validacao/tela-espera-validacao.component';

// Telas de Aluno (Adicionar as que faltam quando tiver)
import { TelaNotificacoesAlunoComponent } from './telas/aluno/tela-notificacoes-aluno/tela-notificacoes-aluno.component';
// import { TelaVisaoGeralAlunoComponent } from './telas/tela-visao-geral-aluno/tela-visao-geral-aluno.component'; // Exemplo
// import { TelaHorariosAlunoComponent } from './telas/tela-horarios-aluno/tela-horarios-aluno.component'; // Exemplo
// import { TelaCarteiraAlunoComponent } from './telas/tela-carteira-aluno/tela-carteira-aluno.component'; // Exemplo
// import { TelaRenovacaoAlunoComponent } from './telas/tela-renovacao-aluno/tela-renovacao-aluno.component'; // Exemplo


// Telas de Funcionário
import { TelaPrincipalFuncionarioComponent } from './telas/funcionario/tela-principal-funcionario/tela-principal-funcionario.component';
import { ValidarCarteirasComponent } from './telas/funcionario/validar-carteiras/validar-carteiras.component';
import { CarteirasAtivasComponent } from './telas/funcionario/carteiras-ativas/carteiras-ativas.component';
import { HorariosComponent } from './telas/funcionario/horarios/horarios.component';
import { PreviewCarteiraValidacaoComponent } from './telas/funcionario/preview-carteira-validacao/preview-carteira-validacao.component';
import { ConfirmacaoValidacaoComponent } from './telas/funcionario/confirmacao-validacao/confirmacao-validacao.component';

export const routes: Routes = [
  // --- Rotas Iniciais ---
  { path: '', redirectTo: 'boas-vindas', pathMatch: 'full' }, // Mudei para 'boas-vindas' para clareza
  { path: 'boas-vindas', component: TelaLoginCadastroComponent },
  { path: 'login', component: TelaLoginComponent },
  { path: 'cadastro', component: TelaCadastroComponent },
  { path: 'espera-validacao', component: TelaEsperaValidacaoComponent },

  // --- Rotas de Aluno ---
  // (Idealmente, poderíamos ter um layout/pai para aluno também, mas por agora:)
  // { path: 'aluno', component: AlgumLayoutAlunoComponent, children: [ // <- SUGESTÃO FUTURA
  //   { path: '', redirectTo: 'visao-geral', pathMatch: 'full' },
  //   { path: 'visao-geral', component: TelaVisaoGeralAlunoComponent },
  //   { path: 'notificacoes', component: TelaNotificacoesAlunoComponent },
  //   { path: 'horarios', component: TelaHorariosAlunoComponent },
  //   { path: 'carteira', component: TelaCarteiraAlunoComponent },
  //   { path: 'renovacao', component: TelaRenovacaoAlunoComponent },
  // ]},
  // Por agora, apenas a que temos:
  { path: 'aluno/notificacoes', component: TelaNotificacoesAlunoComponent },


  // --- Rotas de Funcionário ---
  {
    path: 'funcionario',
    component: TelaPrincipalFuncionarioComponent,
    children: [
      { path: '', redirectTo: 'validar-carteiras', pathMatch: 'full' },
      { path: 'validar-carteiras', component: ValidarCarteirasComponent },
      { path: 'carteiras-ativas', component: CarteirasAtivasComponent },
      { path: 'horarios', component: HorariosComponent },
      { path: 'validar-carteiras/:id', component: PreviewCarteiraValidacaoComponent },
      { path: 'validacao-resultado', component: ConfirmacaoValidacaoComponent },
    ]
  },

  // --- Rota Curinga ---
  { path: '**', redirectTo: 'boas-vindas' } // Redireciona qualquer coisa não encontrada
];