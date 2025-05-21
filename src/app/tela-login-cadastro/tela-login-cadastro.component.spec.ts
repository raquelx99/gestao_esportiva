import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TelaLoginCadastroComponent } from './tela-login-cadastro.component';

describe('TelaLoginCadastroComponent', () => {
  let component: TelaLoginCadastroComponent;
  let fixture: ComponentFixture<TelaLoginCadastroComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TelaLoginCadastroComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TelaLoginCadastroComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
