import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { estimatedValue, invested, money } from "@/lib/calculations";

export const dynamic = "force-dynamic";

export default async function Home() {
  const items = await prisma.item.findMany({ orderBy: { updatedAt: "desc" } });
  const mapped = items.map(item => ({
    ...item,
    purchasePrice: Number(item.purchasePrice),
    additionalCosts: Number(item.additionalCosts),
    currentValue: item.currentValue === null ? null : Number(item.currentValue),
    annualRate: item.annualRate === null ? null : Number(item.annualRate)
  }));

  const totalInvested = mapped.reduce((sum, item) => sum + invested(item), 0);
  const totalValue = mapped.reduce((sum, item) => sum + estimatedValue(item), 0);
  const depreciation = totalInvested - totalValue;
  const recovery = totalInvested ? (totalValue / totalInvested) * 100 : 0;

  return (
    <>
      <header><div className="container nav"><Link className="brand" href="/">Item Value Tracker</Link><Link className="button primary" href="/items/new">+ Add item</Link></div></header>
      <main className="container">
        <h1>Your stuff, tracked properly.</h1>
        <p className="muted">Purchase cost, extra spend, current value and resale recovery in one place.</p>

        <section className="grid stats">
          <div className="card"><div className="muted">Invested</div><div className="stat-value">{money(totalInvested)}</div></div>
          <div className="card"><div className="muted">Estimated value</div><div className="stat-value">{money(totalValue)}</div></div>
          <div className="card"><div className="muted">Depreciation</div><div className={"stat-value " + (depreciation > 0 ? "negative" : "positive")}>{money(depreciation)}</div></div>
          <div className="card"><div className="muted">Recovery</div><div className="stat-value">{recovery.toFixed(0)}%</div></div>
        </section>

        <section>
          <h2>Items</h2>
          {mapped.length === 0 ? (
            <div className="card"><p>No items yet.</p><Link className="button primary" href="/items/new">Add your first item</Link></div>
          ) : (
            <div className="grid items">
              {mapped.map(item => {
                const value = estimatedValue(item);
                const cost = invested(item);
                return <Link className="card item" key={item.id} href={"/items/" + item.id}>
                  <div><h3>{item.name}</h3><div className="muted">{item.category || "Uncategorised"} · {item.status}</div></div>
                  <div><strong>{money(value)}</strong><div className={value < cost ? "muted" : "positive"}>{((value / cost) * 100).toFixed(0)}% recovery</div></div>
                </Link>;
              })}
            </div>
          )}
        </section>
      </main>
    </>
  );
}