import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { CaseDetailPage } from './case-detail.page';

describe('CaseDetailPage', () => {
  let component: CaseDetailPage;
  let fixture: ComponentFixture<CaseDetailPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CaseDetailPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(CaseDetailPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
