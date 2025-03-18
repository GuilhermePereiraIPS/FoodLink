import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RecipeBookDetailsComponent } from './recipe-book-details.component';

describe('RecipeBookDetailsComponent', () => {
  let component: RecipeBookDetailsComponent;
  let fixture: ComponentFixture<RecipeBookDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [RecipeBookDetailsComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(RecipeBookDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
