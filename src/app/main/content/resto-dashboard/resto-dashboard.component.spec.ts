import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RestoDashboardComponent } from './resto-dashboard.component';

describe('RestoDashboardComponent', () => {
  let component: RestoDashboardComponent;
  let fixture: ComponentFixture<RestoDashboardComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RestoDashboardComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RestoDashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
