import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Situationprint } from './situationprint';

describe('Situationprint', () => {
  let component: Situationprint;
  let fixture: ComponentFixture<Situationprint>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Situationprint]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Situationprint);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
