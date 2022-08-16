import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SearchPaneComponent } from './search-pane.component';

describe('SearchPaneComponent', () => {
  let component: SearchPaneComponent;
  let fixture: ComponentFixture<SearchPaneComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SearchPaneComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SearchPaneComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
