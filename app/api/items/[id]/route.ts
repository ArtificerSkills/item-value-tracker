import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

const optionalNumber = (v: unknown) => v === "" || v == null ? null : Number(v);

export async function GET(_: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const item = await prisma.item.findUnique({ where: { id } });
  if (!item) return new NextResponse("Item not found.", { status: 404 });
  return NextResponse.json(item);
}

export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  try {
    const body = await request.json();
    const item = await prisma.item.update({
      where: { id },
      data: {
        name: String(body.name),
        category: body.category ? String(body.category) : null,
        purchaseDate: new Date(String(body.purchaseDate) + "T12:00:00"),
        purchasePrice: Number(body.purchasePrice),
        additionalCosts: Number(body.additionalCosts || 0),
        currentValue: optionalNumber(body.currentValue),
        depreciationModel: String(body.depreciationModel || "market"),
        annualRate: optionalNumber(body.annualRate),
        source: body.source ? String(body.source) : null,
        conditionBought: body.conditionBought ? String(body.conditionBought) : null,
        conditionCurrent: body.conditionCurrent ? String(body.conditionCurrent) : null,
        serialModel: body.serialModel ? String(body.serialModel) : null,
        hoursUsed: optionalNumber(body.hoursUsed),
        photoUrl: body.photoUrl ? String(body.photoUrl) : null,
        receiptUrl: body.receiptUrl ? String(body.receiptUrl) : null,
        targetSalePrice: optionalNumber(body.targetSalePrice),
        salePlatform: body.salePlatform ? String(body.salePlatform) : null,
        saleFees: Number(body.saleFees || 0),
        shippingCost: Number(body.shippingCost || 0),
        packagingCost: Number(body.packagingCost || 0),
        notes: body.notes ? String(body.notes) : null,
        status: String(body.status || "owned")
      }
    });
    return NextResponse.json(item);
  } catch {
    return new NextResponse("Could not update item.", { status: 400 });
  }
}
export async function DELETE(_: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  try {
    await prisma.item.delete({ where: { id } });
    return new NextResponse(null, { status: 204 });
  } catch {
    return new NextResponse("Could not delete item.", { status: 400 });
  }
}
