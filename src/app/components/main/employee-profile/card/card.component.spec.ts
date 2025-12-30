import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EPCardComponent } from './card.component';

describe('CardComponent', () => {
  let component: EPCardComponent;
  let fixture: ComponentFixture<EPCardComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [EPCardComponent],
    });
    fixture = TestBed.createComponent(EPCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
