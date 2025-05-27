import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TelaVisaoGeralComponent } from './tela-visao-geral.component';

describe('TelaVisaoGeralComponent', () => {
  let component: TelaVisaoGeralComponent;
  let fixture: ComponentFixture<TelaVisaoGeralComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TelaVisaoGeralComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TelaVisaoGeralComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
