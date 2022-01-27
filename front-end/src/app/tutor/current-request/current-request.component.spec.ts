import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CurrentRequestComponent } from './current-request.component';

describe('CurrentRequestComponent', () => {
  let component: CurrentRequestComponent;
  let fixture: ComponentFixture<CurrentRequestComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CurrentRequestComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CurrentRequestComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
