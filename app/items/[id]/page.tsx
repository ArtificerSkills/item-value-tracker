import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { estimatedValue, invested, money } from "@/lib/calculations";

export const dynamic = "force-dynamic";

export default async function ItemPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const item = await prisma.item.findUnique({ where: { id } });
  if (!item) notFound();

  const data = {
    purchasePrice: Number(item.purchasePrice),
    additionalCosts: Number(item.additionalCosts),
    currentValue: item.currentValue === null ? null : Number(item.currentValue),
    purchaseDate: item.purchaseDate,
    depreciationModel: item.depreciationModel,
    annualRate: item.annualRate === null ? null : Number(item.annualRate)
  };
  const cost = invested(data);
  const value = estimatedValue(data);
  const depreciation = cost - value;

  return <><header><div className="container nav"><Link className="brand" href="/">Item Value Tracker</Link><Link className="button" href="/items/new">+ Add item</Link></div></header>
  <main className="container"><Link className="muted" href="/">← Dashboard</Link><div className="card" style={{marginTop:16}}>
    <h1>{item.name}</h1><p className="muted">{item.category || "Uncategorised"} · {item.status}</p>
    <div className="grid stats">
      <div><div className="muted">Invested</div><div className="stat-value">{money(cost)}</div></div>
      <div><div className="muted">Current value</div><div className="stat-value">{money(value)}</div></div>
      <div><div className="muted">Depreciation</div><div className={"stat-value " + (depreciation > 0 ? "negative" : "positive")}>{money(depreciation)}</div></div>
      <div><div className="muted">Recovery</div><div className="stat-value">{cost ? ((value / cost) * 100).toFixed(0) : 0}%</div></div>
    </div>
    <p><strong>Purchased:</strong> {item.purchaseDate.toLocaleDateString("en-GB")}</p>
    {item.notes && <p><strong>Notes:</strong> {item.notes}</p>}
  </div></main></>;
}