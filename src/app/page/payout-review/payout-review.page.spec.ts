import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { PayoutReviewPage } from './payout-review.page';

describe('PayoutReviewPage', () => {
  let component: PayoutReviewPage;
  let fixture: ComponentFixture<PayoutReviewPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PayoutReviewPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(PayoutReviewPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
