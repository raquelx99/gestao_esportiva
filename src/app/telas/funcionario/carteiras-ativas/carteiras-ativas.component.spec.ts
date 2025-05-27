import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CarteirasAtivasComponent } from './carteiras-ativas.component';

describe('CarteirasAtivasComponent', () => {
  let component: CarteirasAtivasComponent;
  let fixture: ComponentFixture<CarteirasAtivasComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CarteirasAtivasComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CarteirasAtivasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
