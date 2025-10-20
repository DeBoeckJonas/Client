import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SimulationView } from './simulation-view';

describe('SimulationView', () => {
  let component: SimulationView;
  let fixture: ComponentFixture<SimulationView>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SimulationView]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SimulationView);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
