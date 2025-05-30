import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConfirmacaoValidacaoComponent } from './confirmacao-validacao.component';

describe('ConfirmacaoValidacaoComponent', () => {
  let component: ConfirmacaoValidacaoComponent;
  let fixture: ComponentFixture<ConfirmacaoValidacaoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ConfirmacaoValidacaoComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ConfirmacaoValidacaoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
