import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TelaNotificacoesAlunoComponent } from './tela-notificacoes-aluno.component';

describe('TelaNotificacoesAlunoComponent', () => {
  let component: TelaNotificacoesAlunoComponent;
  let fixture: ComponentFixture<TelaNotificacoesAlunoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TelaNotificacoesAlunoComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TelaNotificacoesAlunoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
