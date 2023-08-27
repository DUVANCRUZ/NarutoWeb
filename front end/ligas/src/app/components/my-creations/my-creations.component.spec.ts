import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MyCreationsComponent } from './my-creations.component';

describe('MyCreationsComponent', () => {
  let component: MyCreationsComponent;
  let fixture: ComponentFixture<MyCreationsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [MyCreationsComponent]
    });
    fixture = TestBed.createComponent(MyCreationsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
