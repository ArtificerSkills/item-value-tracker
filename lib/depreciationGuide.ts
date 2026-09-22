export type GuideMethod = "useful_life" | "replacement_percent" | "replacement_cost" | "replacement_cost_or_commercial" | "comparative_replacement" | "commercial_value" | "appraisal_value" | "face_or_actual" | "actual_or_replacement_cap" | "materials_cost" | "monthly_after_initial" | "cb_radio" | "stereo_tape" | "indefinite" | "unspecified";
export type GuideItem = { category:string; subcategory:string; method:GuideMethod; years?:number; percent?:number; initialPercent?:number; monthlyPercent?:number; notes?:string };

export const DEPRECIATION_GUIDE: GuideItem[] = PLACEHOLDER
export const GUIDE_CATEGORIES = [...new Set(DEPRECIATION_GUIDE.map(x => x.category))];
export function findGuideItem(category:string, subcategory:string){ return DEPRECIATION_GUIDE.find(x => x.category===category && x.subcategory===subcategory) ?? null; }
