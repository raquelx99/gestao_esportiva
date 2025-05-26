import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TelaEsperaValidacaoComponent } from './tela-espera-validacao.component';

describe('TelaEsperaValidacaoComponent', () => {
  let component: TelaEsperaValidacaoComponent;
  let fixture: ComponentFixture<TelaEsperaValidacaoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TelaEsperaValidacaoComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TelaEsperaValidacaoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
