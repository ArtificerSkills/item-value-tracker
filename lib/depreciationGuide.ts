import { GUIDE_PART_1 } from "./guidePart1";
import { GUIDE_PART_2 } from "./guidePart2";
import { GUIDE_PART_3 } from "./guidePart3";

export type GuideMethod = "useful_life" | "replacement_percent" | "replacement_cost" | "replacement_cost_or_commercial" | "comparative_replacement" | "commercial_value" | "appraisal_value" | "face_or_actual" | "actual_or_replacement_cap" | "materials_cost" | "monthly_after_initial" | "cb_radio" | "stereo_tape" | "indefinite" | "unspecified";
export type GuideItem = { category:string; subcategory:string; method:GuideMethod; years?:number; percent?:number; initialPercent?:number; monthlyPercent?:number; notes?:string };

type Row = readonly [string,string,GuideMethod,number|null,number|null,number|null,number|null,string];
const rows = [...GUIDE_PART_1,...GUIDE_PART_2,...GUIDE_PART_3] as readonly Row[];
export const DEPRECIATION_GUIDE: GuideItem[] = rows.map(([category,subcategory,method,years,percent,initialPercent,monthlyPercent,notes]) => ({category,subcategory,method,...(years!=null?{years}:{}),...(percent!=null?{percent}:{}),...(initialPercent!=null?{initialPercent}:{}),...(monthlyPercent!=null?{monthlyPercent}:{}),...(notes?{notes}: {})}));
export const GUIDE_CATEGORIES = [...new Set(DEPRECIATION_GUIDE.map(x => x.category))];
export function findGuideItem(category:string, subcategory:string){ return DEPRECIATION_GUIDE.find(x => x.category===category && x.subcategory===subcategory) ?? null; }
export function guideRuleText(rule:GuideItem){
 if(rule.method === "useful_life") return `${rule.years} year useful life`;
 if(rule.method === "replacement_percent") return `Use ${rule.percent}% of replacement cost`;
 if(rule.method === "monthly_after_initial") return `Depreciate ${rule.initialPercent}% immediately, then ${rule.monthlyPercent}% per month`;
 if(rule.method === "indefinite") return "Will last indefinitely";
 return rule.notes || "Manual valuation required";
}
