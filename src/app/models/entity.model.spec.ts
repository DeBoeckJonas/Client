import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EntityModel } from './entity.model';

describe('EntityModel', () => {
  let component: EntityModel;
  let fixture: ComponentFixture<EntityModel>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EntityModel]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EntityModel);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
