import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TelaRenovacaoFormularioComponent } from './tela-renovacao-formulario.component';

describe('TelaRenovacaoFormularioComponent', () => {
  let component: TelaRenovacaoFormularioComponent;
  let fixture: ComponentFixture<TelaRenovacaoFormularioComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TelaRenovacaoFormularioComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TelaRenovacaoFormularioComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
