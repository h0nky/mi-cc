import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddVideoComponent } from './add-video.component';

describe('FormComponent', () => {
  let component: AddVideoComponent;
  let fixture: ComponentFixture<AddVideoComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AddVideoComponent]
    });
    fixture = TestBed.createComponent(AddVideoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
