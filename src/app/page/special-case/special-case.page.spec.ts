import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { SpecialCasePage } from './special-case.page';

describe('SpecialCasePage', () => {
  let component: SpecialCasePage;
  let fixture: ComponentFixture<SpecialCasePage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SpecialCasePage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(SpecialCasePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
