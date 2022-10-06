import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UserRoleEditorComponent } from './user-role-editor.component';

describe('UserRoleEditorComponent', () => {
  let component: UserRoleEditorComponent;
  let fixture: ComponentFixture<UserRoleEditorComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [UserRoleEditorComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UserRoleEditorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
