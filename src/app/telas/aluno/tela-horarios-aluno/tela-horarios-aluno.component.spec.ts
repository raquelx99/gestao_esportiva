import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TelaHorariosAlunoComponent } from './tela-horarios-aluno.component';

describe('TelaHorariosAlunoComponent', () => {
  let component: TelaHorariosAlunoComponent;
  let fixture: ComponentFixture<TelaHorariosAlunoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TelaHorariosAlunoComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TelaHorariosAlunoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
