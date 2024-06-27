import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RestoDashboardFilterComponent } from './resto-dashboard-filter.component';

describe('RestoDashboardFilterComponent', () => {
  let component: RestoDashboardFilterComponent;
  let fixture: ComponentFixture<RestoDashboardFilterComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RestoDashboardFilterComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RestoDashboardFilterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
