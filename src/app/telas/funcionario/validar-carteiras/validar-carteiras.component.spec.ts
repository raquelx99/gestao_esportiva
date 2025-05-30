import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ValidarCarteirasComponent } from './validar-carteiras.component';

describe('ValidarCarteirasComponent', () => {
  let component: ValidarCarteirasComponent;
  let fixture: ComponentFixture<ValidarCarteirasComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ValidarCarteirasComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ValidarCarteirasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
