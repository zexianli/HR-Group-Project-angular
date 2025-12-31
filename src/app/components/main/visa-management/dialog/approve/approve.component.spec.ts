import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ApproveComponent } from './approve.component';

describe('ApproveComponent', () => {
  let component: ApproveComponent;
  let fixture: ComponentFixture<ApproveComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ApproveComponent],
    });
    fixture = TestBed.createComponent(ApproveComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
