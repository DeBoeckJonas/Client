import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Highscores } from './highscores';

describe('Highscores', () => {
  let component: Highscores;
  let fixture: ComponentFixture<Highscores>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Highscores]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Highscores);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
