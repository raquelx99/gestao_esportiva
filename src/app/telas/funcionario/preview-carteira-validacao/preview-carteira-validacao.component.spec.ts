import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PreviewCarteiraValidacaoComponent } from './preview-carteira-validacao.component';

describe('PreviewCarteiraValidacaoComponent', () => {
  let component: PreviewCarteiraValidacaoComponent;
  let fixture: ComponentFixture<PreviewCarteiraValidacaoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PreviewCarteiraValidacaoComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PreviewCarteiraValidacaoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
