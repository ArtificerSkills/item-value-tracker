"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function NewItem() {
  const router = useRouter();
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  async function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSaving(true);
    setError("");
    const form = new FormData(e.currentTarget);
    const payload = Object.fromEntries(form.entries());
    const response = await fetch("/api/items", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload) });
    if (!response.ok) {
      setError(await response.text());
      setSaving(false);
      return;
    }
    const item = await response.json();
    router.push("/items/" + item.id);
  }

  return <><header><div className="container nav"><a className="brand" href="/">Item Value Tracker</a></div></header><main className="container">
    <h1>Add item</h1><p className="muted">Start with what you actually paid. Add repairs/upgrades separately.</p>
    <form className="card form" onSubmit={submit}>
      <div className="fields">
        <div className="field full"><label>Name</label><input name="name" required placeholder="e.g. CR-10 Smart Pro" /></div>
        <div className="field"><label>Category</label><input name="category" placeholder="3D printing" /></div>
        <div className="field"><label>Purchase date</label><input name="purchaseDate" type="date" required /></div>
        <div className="field"><label>Purchase price (£)</label><input name="purchasePrice" type="number" min="0" step="0.01" required /></div>
        <div className="field"><label>Repairs / upgrades / extra costs (£)</label><input name="additionalCosts" type="number" min="0" step="0.01" defaultValue="0" /></div>
        <div className="field"><label>Current estimated value (£)</label><input name="currentValue" type="number" min="0" step="0.01" placeholder="Leave blank to use invested cost" /></div>
        <div className="field"><label>Depreciation model</label><select name="depreciationModel" defaultValue="market"><option value="market">Market value</option><option value="straight-line">Straight-line</option><option value="declining-balance">Declining balance</option></select></div>
        <div className="field"><label>Annual depreciation rate</label><input name="annualRate" type="number" min="0" max="1" step="0.01" placeholder="0.20 = 20%" /></div>
        <div className="field full"><label>Notes</label><textarea name="notes" placeholder="Serial number, condition, included accessories, receipt location..."/></div>
      </div>
      {error && <p className="negative">{error}</p>}
      <div className="actions"><button className="button primary" disabled={saving}>{saving ? "Saving..." : "Save item"}</button><a className="button" href="/">Cancel</a></div>
    </form>
  </main></>;
}