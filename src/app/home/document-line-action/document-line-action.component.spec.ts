import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DocumentLineActionComponent } from './document-line-action.component';

describe('DocumentLineActionComponent', () => {
  let component: DocumentLineActionComponent;
  let fixture: ComponentFixture<DocumentLineActionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [DocumentLineActionComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DocumentLineActionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
