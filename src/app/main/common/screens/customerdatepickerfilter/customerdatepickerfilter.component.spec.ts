import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CustomerDatepickerFilterComponent } from './customerdatepickerfilter.component';

describe('CustomerDatepickerFilterComponent', () => {
  let component: CustomerDatepickerFilterComponent;
  let fixture: ComponentFixture<CustomerDatepickerFilterComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CustomerDatepickerFilterComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CustomerDatepickerFilterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
