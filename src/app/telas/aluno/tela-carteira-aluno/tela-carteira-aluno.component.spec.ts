import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TelaCarteiraAlunoComponent } from './tela-carteira-aluno.component';

describe('TelaCarteiraAlunoComponent', () => {
  let component: TelaCarteiraAlunoComponent;
  let fixture: ComponentFixture<TelaCarteiraAlunoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TelaCarteiraAlunoComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TelaCarteiraAlunoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
