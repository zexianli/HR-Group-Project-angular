import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PdfComponent } from './pdf.component';

describe('PdfComponent', () => {
  let component: PdfComponent;
  let fixture: ComponentFixture<PdfComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [PdfComponent],
    });
    fixture = TestBed.createComponent(PdfComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
