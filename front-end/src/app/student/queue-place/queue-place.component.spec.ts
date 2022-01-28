import { ComponentFixture, TestBed } from '@angular/core/testing';

import { QueuePlaceComponent } from './queue-place.component';

describe('QueuePlaceComponent', () => {
  let component: QueuePlaceComponent;
  let fixture: ComponentFixture<QueuePlaceComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ QueuePlaceComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(QueuePlaceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
