import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FuncionarioTopBarComponent } from './funcionario-top-bar.component';

describe('FuncionarioTopBarComponent', () => {
  let component: FuncionarioTopBarComponent;
  let fixture: ComponentFixture<FuncionarioTopBarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FuncionarioTopBarComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FuncionarioTopBarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
