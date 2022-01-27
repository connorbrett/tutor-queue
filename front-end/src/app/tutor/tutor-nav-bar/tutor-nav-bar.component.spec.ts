import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TutorNavBarComponent } from './tutor-nav-bar.component';

describe('TutorNavBarComponent', () => {
  let component: TutorNavBarComponent;
  let fixture: ComponentFixture<TutorNavBarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TutorNavBarComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TutorNavBarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
