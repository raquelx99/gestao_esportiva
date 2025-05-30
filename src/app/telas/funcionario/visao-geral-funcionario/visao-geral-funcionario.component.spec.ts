import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VisaoGeralFuncionarioComponent } from './visao-geral-funcionario.component';

describe('VisaoGeralFuncionarioComponent', () => {
  let component: VisaoGeralFuncionarioComponent;
  let fixture: ComponentFixture<VisaoGeralFuncionarioComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [VisaoGeralFuncionarioComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(VisaoGeralFuncionarioComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
