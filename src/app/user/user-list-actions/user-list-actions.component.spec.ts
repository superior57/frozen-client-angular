import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UserListActionsComponent } from './user-list-actions.component';

describe('UserListActionsComponent', () => {
  let component: UserListActionsComponent;
  let fixture: ComponentFixture<UserListActionsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [UserListActionsComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UserListActionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
