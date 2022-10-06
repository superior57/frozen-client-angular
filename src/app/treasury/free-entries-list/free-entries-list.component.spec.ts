import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FreeEntriesListComponent } from './free-entries-list.component';

describe('FreeEntriesListComponent', () => {
  let component: FreeEntriesListComponent;
  let fixture: ComponentFixture<FreeEntriesListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [FreeEntriesListComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FreeEntriesListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
