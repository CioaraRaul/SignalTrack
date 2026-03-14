import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FuelBarComponent } from './fuel-bar.component';

describe('FuelBarComponent', () => {
  let component: FuelBarComponent;
  let fixture: ComponentFixture<FuelBarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FuelBarComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(FuelBarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
