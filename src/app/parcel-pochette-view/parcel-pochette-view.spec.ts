import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ParcelPochetteView } from './parcel-pochette-view';

describe('ParcelPochetteView', () => {
  let component: ParcelPochetteView;
  let fixture: ComponentFixture<ParcelPochetteView>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ParcelPochetteView]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ParcelPochetteView);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
