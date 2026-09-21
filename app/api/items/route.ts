import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const items = await prisma.item.findMany({ orderBy: { updatedAt: "desc" } });
  return NextResponse.json(items);
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    if (!body.name || !body.purchaseDate || body.purchasePrice === undefined) {
      return new NextResponse("Name, purchase date and purchase price are required.", { status: 400 });
    }

    const item = await prisma.item.create({
      data: {
        name: String(body.name),
        category: body.category ? String(body.category) : null,
        purchaseDate: new Date(String(body.purchaseDate) + "T12:00:00"),
        purchasePrice: Number(body.purchasePrice),
        additionalCosts: Number(body.additionalCosts || 0),
        currentValue: body.currentValue === "" || body.currentValue == null ? null : Number(body.currentValue),
        depreciationModel: String(body.depreciationModel || "market"),
        annualRate: body.annualRate === "" || body.annualRate == null ? null : Number(body.annualRate),
        notes: body.notes ? String(body.notes) : null
      }
    });

    return NextResponse.json(item);
  } catch {
    return new NextResponse("Could not save item.", { status: 400 });
  }
}