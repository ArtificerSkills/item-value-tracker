"use client";
import { useState } from "react"; import { useRouter } from "next/navigation";

const CATEGORIES = [
  "3D Printing",
  "Tools & Workshop",
  "PC & Gaming",
  "Networking & Electronics",
  "Home Improvement",
  "DIY & Hardware",
  "Automotive",
  "Household",
  "Photography & Audio",
  "Outdoor & Camping",
  "Collectibles",
  "Clothing & Personal",
  "Other"
];

export default function NewItem(){const router=useRouter();const[saving,setSaving]=useState(false);const[error,setError]=useState("");
async function submit(e:React.FormEvent<HTMLFormElement>){e.preventDefault();setSaving(true);const payload=Object.fromEntries(new FormData(e.currentTarget).entries());const r=await fetch("/api/items",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify(payload)});if(!r.ok){setError(await r.text());setSaving(false);return}const x=await r.json();router.push("/items/"+x.id)}
return <><header><div className="container nav"><a className="brand" href="/">Item Value Tracker</a></div></header><main className="container"><h1>Add item</h1><p className="muted">Capture enough detail now that resale value is useful later.</p><form className="card form" onSubmit={submit}><div className="fields">
<div className="field full"><label>Name</label><input name="name" required placeholder="e.g. CR-10 Smart Pro"/></div><div className="field"><label>Category</label><select name="category" defaultValue=""><option value="" disabled>Select a category</option>{CATEGORIES.map(category=><option key={category} value={category}>{category}</option>)}</select></div><div className="field"><label>Status</label><select name="status" defaultValue="owned"><option value="owned">Owned</option><option value="for-sale">For sale</option></select></div>
<div className="field"><label>Purchase date</label><input name="purchaseDate" type="date" required/></div><div className="field"><label>Purchase price (£)</label><input name="purchasePrice" type="number" min="0" step=".01" required/></div>
<div className="field"><label>Extra costs (£)</label><input name="additionalCosts" type="number" min="0" step=".01" defaultValue="0"/></div><div className="field"><label>Current value (£)</label><input name="currentValue" type="number" min="0" step=".01"/></div>
<div className="field"><label>Target sale price (£)</label><input name="targetSalePrice" type="number" min="0" step=".01"/></div><div className="field"><label>Where bought</label><input name="source"/></div>
<div className="field"><label>Condition bought</label><input name="conditionBought"/></div><div className="field"><label>Current condition</label><input name="conditionCurrent"/></div>
<div className="field"><label>Serial / model</label><input name="serialModel"/></div><div className="field"><label>Hours used</label><input name="hoursUsed" type="number" step=".1"/></div>
<div className="field full"><label>Receipt URL</label><input name="receiptUrl" placeholder="Optional"/></div><div className="field full"><label>Notes</label><textarea name="notes" placeholder="Accessories, defects, repairs, storage location..."/></div>
</div>{error&&<p className="negative">{error}</p>}<div className="actions"><button className="button primary" disabled={saving}>{saving?"Saving...":"Save item"}</button><a className="button" href="/">Cancel</a></div></form></main></>}
