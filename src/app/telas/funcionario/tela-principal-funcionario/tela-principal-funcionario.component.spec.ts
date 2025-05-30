import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TelaPrincipalFuncionarioComponent } from './tela-principal-funcionario.component';

describe('TelaPrincipalFuncionarioComponent', () => {
  let component: TelaPrincipalFuncionarioComponent;
  let fixture: ComponentFixture<TelaPrincipalFuncionarioComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TelaPrincipalFuncionarioComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TelaPrincipalFuncionarioComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
