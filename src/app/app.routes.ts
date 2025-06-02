import { Routes } from '@angular/router';

// Telas Iniciais / Login / Cadastro / Status
import { TelaLoginCadastroComponent } from './telas/tela-login-cadastro/tela-login-cadastro.component';
import { TelaLoginComponent } from './telas/tela-login/tela-login.component';
import { TelaCadastroComponent } from './telas/tela-cadastro/tela-cadastro.component';
import { TelaEsperaValidacaoComponent } from './telas/tela-espera-validacao/tela-espera-validacao.component';

// Telas de Aluno
import { TelaVisaoGeralComponent } from './telas/tela-visao-geral/tela-visao-geral.component'; // Dashboard do Aluno
import { TelaCarteiraAlunoComponent } from './telas/aluno/tela-carteira-aluno/tela-carteira-aluno.component'; // <<< NOVO IMPORT
import { TelaHorariosAlunoComponent } from './telas/aluno/tela-horarios-aluno/tela-horarios-aluno.component'; // <<< NOVO IMPORT
import { TelaNotificacoesAlunoComponent } from './telas/aluno/tela-notificacoes-aluno/tela-notificacoes-aluno.component';
import { TelaConfirmacaoRenovacaoComponent } from './telas/aluno/tela-confirmacao-renovacao/tela-confirmacao-renovacao.component'; // <<< NOVO IMPORT
import { TelaRenovacaoFormularioComponent } from './telas/aluno/tela-renovacao-formulario/tela-renovacao-formulario.component'; // <<< NOVO IMPORT

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
  // A TelaVisaoGeralComponent pode ser o dashboard principal do aluno
  { path: 'aluno-visao-geral', component: TelaVisaoGeralComponent }, // Mantendo o path antigo ou ajustando para /aluno/dashboard, por exemplo
  { path: 'aluno/carteira', component: TelaCarteiraAlunoComponent },
  { path: 'aluno/horarios', component: TelaHorariosAlunoComponent },
  { path: 'aluno/notificacoes', component: TelaNotificacoesAlunoComponent }, // Movido para /aluno
  { path: 'aluno/renovacao-confirmacao', component: TelaConfirmacaoRenovacaoComponent },
  { path: 'aluno/renovacao-formulario', component: TelaRenovacaoFormularioComponent },

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