import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { calculateGuideValue } from "@/lib/depreciationCalc";
import { findGuideItem } from "@/lib/depreciationGuide";

export async function GET() {
  const items = await prisma.item.findMany({ orderBy: { updatedAt: "desc" } });
  return NextResponse.json(items);
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    if (!body.name || !body.purchaseDate || body.purchasePrice === undefined) return new NextResponse("Name, purchase date and purchase price are required.", { status: 400 });
    const category = body.category ? String(body.category) : null;
    const subcategory = body.subcategory ? String(body.subcategory) : null;
    const purchasePrice = Number(body.purchasePrice);
    const additionalCosts = Number(body.additionalCosts || 0);
    const replacementCost = body.replacementCost === "" || body.replacementCost == null ? null : Number(body.replacementCost);
    const manualValue = body.currentValue === "" || body.currentValue == null ? null : Number(body.currentValue);
    const guide = category && subcategory ? findGuideItem(category, subcategory) : null;
    const calc = guide && manualValue == null ? calculateGuideValue({category,subcategory,purchaseDate:String(body.purchaseDate)+"T12:00:00",purchasePrice,additionalCosts,replacementCost,currentCondition:body.conditionCurrent}) : null;
    const item = await prisma.item.create({ data: {
      name:String(body.name), category, subcategory,
      purchaseDate:new Date(String(body.purchaseDate)+"T12:00:00"), purchasePrice, additionalCosts, replacementCost,
      currentValue: manualValue ?? (calc?.value ?? null), depreciationModel: guide ? "guide" : String(body.depreciationModel || "market"),
      annualRate: guide?.method === "useful_life" && guide.years ? 1/guide.years : null,
      source:body.source?String(body.source):null, conditionBought:body.conditionBought?String(body.conditionBought):null, conditionCurrent:body.conditionCurrent?String(body.conditionCurrent):null,
      serialModel:body.serialModel?String(body.serialModel):null, hoursUsed:body.hoursUsed===""||body.hoursUsed==null?null:Number(body.hoursUsed), photoUrl:body.photoUrl?String(body.photoUrl):null, receiptUrl:body.receiptUrl?String(body.receiptUrl):null,
      targetSalePrice:body.targetSalePrice===""||body.targetSalePrice==null?null:Number(body.targetSalePrice), salePlatform:body.salePlatform?String(body.salePlatform):null,
      saleFees:Number(body.saleFees||0), shippingCost:Number(body.shippingCost||0), packagingCost:Number(body.packagingCost||0), notes:body.notes?String(body.notes):null, status:String(body.status||"owned")
    }});
    return NextResponse.json(item);
  } catch { return new NextResponse("Could not save item.", { status: 400 }); }
}
