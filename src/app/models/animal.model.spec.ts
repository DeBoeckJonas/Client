import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AnimalModel } from './animal.model';

describe('AnimalModel', () => {
  let component: AnimalModel;
  let fixture: ComponentFixture<AnimalModel>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AnimalModel]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AnimalModel);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
