import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TelaConfirmacaoRenovacaoComponent } from './tela-confirmacao-renovacao.component';

describe('TelaConfirmacaoRenovacaoComponent', () => {
  let component: TelaConfirmacaoRenovacaoComponent;
  let fixture: ComponentFixture<TelaConfirmacaoRenovacaoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TelaConfirmacaoRenovacaoComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TelaConfirmacaoRenovacaoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
