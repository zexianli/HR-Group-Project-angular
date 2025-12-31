import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RejectComponent } from './reject.component';

describe('RejectComponent', () => {
  let component: RejectComponent;
  let fixture: ComponentFixture<RejectComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [RejectComponent],
    });
    fixture = TestBed.createComponent(RejectComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
