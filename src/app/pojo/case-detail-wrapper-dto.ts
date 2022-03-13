import { PayoutReviewDataGridDto } from './payout-review-data-grid-dto';
import { SpecialCase } from './special-case';

export class CaseDetailWrapperDto {
public payoutReviewDto:PayoutReviewDataGridDto;
public payoutDetailOverrideList:SpecialCase[];
//public remarkMap:Map<string,string>;
public remarkList:{name:string,remark:string}[]=[];
}
