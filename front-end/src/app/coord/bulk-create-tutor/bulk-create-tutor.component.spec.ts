import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BulkCreateTutorComponent } from './bulk-create-tutor.component';

describe('BulkCreateTutorComponent', () => {
  let component: BulkCreateTutorComponent;
  let fixture: ComponentFixture<BulkCreateTutorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [BulkCreateTutorComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BulkCreateTutorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
