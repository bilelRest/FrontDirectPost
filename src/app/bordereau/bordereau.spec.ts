import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Bordereau } from './bordereau';

describe('Bordereau', () => {
  let component: Bordereau;
  let fixture: ComponentFixture<Bordereau>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Bordereau]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Bordereau);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
