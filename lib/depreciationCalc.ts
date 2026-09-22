import { findGuideItem } from "./depreciationGuide";

export function ageInMonths(purchaseDate:string|Date, asOf=new Date()) { const start=new Date(purchaseDate); return Math.max(0,(asOf.getFullYear()-start.getFullYear())*12+(asOf.getMonth()-start.getMonth())-(asOf.getDate()<start.getDate()?1:0)); }
export function ageInYears(purchaseDate:string|Date, asOf=new Date()) { return ageInMonths(purchaseDate,asOf)/12; }
function functionalCap(value:number,basis:number,functional:boolean){ if(!functional||basis<=0)return Math.max(0,value); return Math.max(basis*.1,Math.max(0,value)); }
export function calculateGuideValue(opts:{category:string;subcategory:string;purchaseDate:string|Date;purchasePrice:number;additionalCosts?:number;replacementCost?:number|null;currentCondition?:string|null;asOf?:Date}) {
 const rule=findGuideItem(opts.category,opts.subcategory); if(!rule)return null;
 const basis=Math.max(0,Number(opts.purchasePrice||0)+Number(opts.additionalCosts||0)); const replacement=opts.replacementCost==null?basis:Math.max(0,Number(opts.replacementCost)); const asOf=opts.asOf??new Date();
 const condition=String(opts.currentCondition||"").toLowerCase(); const functional=!/(non[- ]?functional|not working|broken|beyond repair|scrap|destroyed|unusable)/i.test(condition); let value:number|null=null; let explanation=rule.notes||"";
 switch(rule.method){
  case "useful_life": { const years=rule.years??0; value=years>0?basis*(1-Math.min(ageInYears(opts.purchaseDate,asOf)/years,.9)):basis; explanation=`${years} year useful life; straight-line depreciation based on age.`; break; }
  case "replacement_percent": value=replacement*((rule.percent??0)/100); break;
  case "replacement_cost": value=replacement; break;
  case "replacement_cost_or_commercial": value=replacement; break;
  case "comparative_replacement": value=replacement; break;
  case "commercial_value": case "appraisal_value": case "face_or_actual": case "materials_cost": value=null; break;
  case "actual_or_replacement_cap": value=replacement*.9; break;
  case "monthly_after_initial": { const months=ageInMonths(opts.purchaseDate,asOf); const initial=(rule.initialPercent??0)/100; const monthly=(rule.monthlyPercent??0)/100; value=basis*(1-initial)*Math.max(.1,1-monthly*months); explanation=rule.notes||"Initial depreciation followed by monthly depreciation."; break; }
  case "cb_radio": { const months=ageInMonths(opts.purchaseDate,asOf); const depreciation=months<=12?0:Math.min(.9,(months-12)*.01); value=basis*(1-depreciation); explanation=rule.notes||"No depreciation for the first year; then at least 1% per month."; break; }
  case "stereo_tape": { const months=ageInMonths(opts.purchaseDate,asOf); if(months<=3)value=replacement*.75; else if(months<=13)value=replacement*Math.max(.25,.75-(months-3)*.05); else value=replacement*.2; explanation=rule.notes||"75% of replacement cost for first three months, then 5% monthly through month 13, then 20%."; break; }
  case "indefinite": value=replacement; break;
  case "unspecified": value=null; break;
 }
 if(value!=null)value=functionalCap(value,(rule.method==="useful_life"||rule.method==="monthly_after_initial"||rule.method==="cb_radio")?basis:replacement,functional);
 return {rule,value,explanation,basis,replacementCost:replacement,ageYears:ageInYears(opts.purchaseDate,asOf),ageMonths:ageInMonths(opts.purchaseDate,asOf)};
}
